import { Router, Request, Response } from 'express';
import multer from 'multer';
import csv from 'csv-parser';
import { Readable } from 'stream';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  },
});

// CSV row validation schema
const csvRowSchema = z.object({
  date: z.string(),
  description: z.string(),
  amount: z.string(),
  category: z.string().optional().default('Other'),
  location: z.string().optional(),
  paymentMethod: z.string().optional(),
});

// Common CSV column mappings (different banks use different headers)
const columnMappings = {
  // Date columns
  date: ['date', 'transaction date', 'posted date', 'trans date', 'transaction_date'],
  // Description columns  
  description: ['description', 'merchant', 'payee', 'transaction', 'memo', 'details'],
  // Amount columns
  amount: ['amount', 'transaction amount', 'debit', 'credit', 'withdrawal', 'deposit'],
  // Category columns
  category: ['category', 'type', 'transaction type', 'class'],
  // Location columns
  location: ['location', 'address', 'city'],
  // Payment method columns
  paymentMethod: ['payment method', 'card', 'account', 'method'],
};

// Function to normalize column names
const normalizeColumnName = (column: string): string => {
  return column.toLowerCase().trim().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
};

// Function to map CSV headers to our standard fields
const mapColumns = (headers: string[]): { [key: string]: string } => {
  const mapping: { [key: string]: string } = {};
  
  for (const [field, possibleNames] of Object.entries(columnMappings)) {
    for (const header of headers) {
      const normalizedHeader = normalizeColumnName(header);
      if (possibleNames.some(name => normalizedHeader.includes(name))) {
        mapping[field] = header;
        break;
      }
    }
  }
  
  return mapping;
};

// Function to parse amount (handle different formats)
const parseAmount = (amountStr: string): number => {
  if (!amountStr) return 0;
  
  // Remove quotes, currency symbols, commas, and spaces
  let cleanAmount = amountStr.toString().replace(/["$,\s]/g, '');
  
  // Handle parentheses for negative amounts
  if (cleanAmount.includes('(') && cleanAmount.includes(')')) {
    cleanAmount = '-' + cleanAmount.replace(/[()]/g, '');
  }
  
  // Parse as float
  const amount = parseFloat(cleanAmount);
  return isNaN(amount) ? 0 : amount;
};

// Function to parse date (handle different formats)
const parseDate = (dateStr: string): Date => {
  if (!dateStr) return new Date();
  
  // Remove quotes if present
  let cleanDate = dateStr.toString().replace(/"/g, '');
  
  // Try parsing the date directly first
  let date = new Date(cleanDate);
  if (!isNaN(date.getTime())) {
    return date;
  }
  
  // Try various date formats with regex
  const formats = [
    // MM/DD/YYYY
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
    // DD/MM/YYYY  
    /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
    // YYYY-MM-DD
    /^(\d{4})-(\d{1,2})-(\d{1,2})$/,
    // MM-DD-YYYY
    /^(\d{1,2})-(\d{1,2})-(\d{4})$/,
  ];
  
  for (const format of formats) {
    const match = cleanDate.match(format);
    if (match) {
      // For MM/DD/YYYY format (most common in US bank CSV)
      if (format === formats[0]) {
        const [, month, day, year] = match;
        date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        if (!isNaN(date.getTime())) {
          return date;
        }
      }
    }
  }
  
  return new Date(); // Fallback to current date
};

// Function to automatically categorize transactions based on description
const categorizeTransaction = (description: string): string => {
  const desc = description.toLowerCase();
  
  // Income/Deposits (check first as positive amounts should be income)
  if (desc.includes('deposit') || desc.includes('payroll') || desc.includes('salary') || 
      desc.includes('refund') || desc.includes('dir dep') || desc.includes('direct deposit') ||
      desc.includes('venmo cashout') || desc.includes('cash out')) {
    return 'Income';
  }
  
  // Subscriptions & Digital Services
  if (desc.includes('apple.com') || desc.includes('netflix') || desc.includes('spotify') || 
      desc.includes('amazon prime') || desc.includes('subscription') || desc.includes('recurring payment') ||
      desc.includes('windscribe') || desc.includes('adobe') || desc.includes('microsoft')) {
    return 'Subscriptions';
  }
  
  // Insurance
  if (desc.includes('insurance') || desc.includes('lemonade') || desc.includes('geico') || 
      desc.includes('state farm') || desc.includes('progressive')) {
    return 'Insurance';
  }
  
  // Transfers & Payments
  if (desc.includes('venmo payment') || desc.includes('zelle') || desc.includes('paypal') || 
      desc.includes('online pymt') || desc.includes('online payment') || desc.includes('transfer')) {
    return 'Transfers';
  }
  
  // Food & Dining
  if (desc.includes('restaurant') || desc.includes('mcdonalds') || desc.includes('starbucks') || 
      desc.includes('pizza') || desc.includes('food') || desc.includes('dining') || 
      desc.includes('cafe') || desc.includes('burger') || desc.includes('coffee') ||
      desc.includes('doordash') || desc.includes('uber eats') || desc.includes('grubhub')) {
    return 'Food & Dining';
  }
  
  // Transportation
  if (desc.includes('gas') || desc.includes('fuel') || desc.includes('uber') || 
      desc.includes('lyft') || desc.includes('taxi') || desc.includes('parking') ||
      desc.includes('metro') || desc.includes('bus') || desc.includes('train')) {
    return 'Transportation';
  }
  
  // Groceries
  if (desc.includes('grocery') || desc.includes('market') || desc.includes('safeway') || 
      desc.includes('walmart') || desc.includes('target') || desc.includes('kroger') ||
      desc.includes('whole foods') || desc.includes('costco')) {
    return 'Groceries';
  }
  
  // Utilities
  if (desc.includes('electric') || desc.includes('gas bill') || desc.includes('water') || 
      desc.includes('internet') || desc.includes('phone') || desc.includes('utility')) {
    return 'Utilities';
  }
  
  // Entertainment
  if (desc.includes('movie') || desc.includes('theater') || desc.includes('entertainment') || 
      desc.includes('game') || desc.includes('steam') || desc.includes('xbox') ||
      desc.includes('playstation') || desc.includes('nintendo')) {
    return 'Entertainment';
  }
  
  // Shopping
  if (desc.includes('amazon') || desc.includes('shopping') || desc.includes('store') || 
      desc.includes('retail') || desc.includes('purchase authorized')) {
    return 'Shopping';
  }
  
  // Healthcare
  if (desc.includes('pharmacy') || desc.includes('medical') || desc.includes('doctor') || 
      desc.includes('hospital') || desc.includes('health') || desc.includes('cvs') ||
      desc.includes('walgreens')) {
    return 'Healthcare';
  }
  
  // ATM/Cash
  if (desc.includes('atm') || desc.includes('cash') || desc.includes('withdrawal')) {
    return 'Cash';
  }
  
  // Default category
  return 'Other';
};

// All routes require authentication
router.use(authenticateToken);

// CSV upload endpoint
router.post('/upload', upload.single('csvFile'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No CSV file uploaded' });
      return;
    }

    const userId = req.user!.userId;
    const results: any[] = [];
    const errors: string[] = [];

    // Convert buffer to stream and parse CSV
    const stream = Readable.from(req.file.buffer.toString());
    
    await new Promise<void>((resolve, reject) => {
      stream
        .pipe(csv())
        .on('headers', (headers: string[]) => {
          console.log('CSV Headers:', headers);
        })
        .on('data', (row: any) => {
          results.push(row);
        })
        .on('end', () => {
          resolve();
        })
        .on('error', (error: Error) => {
          reject(error);
        });
    });

    if (results.length === 0) {
      res.status(400).json({ error: 'CSV file is empty or invalid' });
      return;
    }

    // Detect if this is a headerless bank CSV (5 columns, no recognizable headers)
    const firstRow = results[0];
    const firstRowKeys = Object.keys(firstRow);
    
    // Better detection for bank CSV format:
    // - Columns are numbered (0, 1, 2, 3, 4)
    // - First column looks like a date (MM/DD/YYYY format with quotes)
    // - Second column looks like an amount (starts with quote, contains number with decimal)
    // - Fifth column contains transaction description
    const isHeaderlessBankCSV = firstRowKeys.length >= 5 && 
                                firstRowKeys.every(key => key.match(/^[0-9]+$/)) && 
                                firstRow['0'] && (
                                  firstRow['0'].match(/^\d{2}\/\d{2}\/\d{4}$/) ||  // Already clean date
                                  firstRow['0'].match(/^"\d{2}\/\d{2}\/\d{4}"$/)   // Quoted date
                                ) &&
                                firstRow['1'] && (
                                  firstRow['1'].match(/^-?\d+\.\d{2}$/) ||         // Clean amount
                                  firstRow['1'].match(/^"-?\d+\.\d{2}"$/)          // Quoted amount
                                ) &&
                                firstRow['4'] && firstRow['4'].length > 0;        // Has description

    let columnMapping;
    let processableData;

    if (isHeaderlessBankCSV) {
      console.log('Detected headerless bank CSV format (Wells Fargo style)');
      console.log('First row sample:', {
        date: firstRow['0'],
        amount: firstRow['1'], 
        flag: firstRow['2'],
        empty: firstRow['3'],
        description: firstRow['4']
      });
      
      // Bank CSV format: Date, Amount, Flag, Empty, Description
      columnMapping = {
        date: '0',      // First column
        amount: '1',    // Second column  
        description: '4' // Fifth column
      };
      processableData = results;
    } else {
      console.log('Detected standard CSV format with headers');
      // Regular CSV with headers
      const headers = Object.keys(firstRow);
      console.log('Available headers:', headers);
      columnMapping = mapColumns(headers);
      processableData = results;
      
      if (!columnMapping.date || !columnMapping.description || !columnMapping.amount) {
        throw new Error(`Missing required columns. Found: ${JSON.stringify(columnMapping)}`);
      }
    }

    console.log('Column mapping:', columnMapping);

    // Process each row
    const transactions: any[] = [];
    
    for (let i = 0; i < processableData.length; i++) {
      const row = processableData[i];
      
      try {
        // Extract data using column mapping
        const date = row[columnMapping.date] || '';
        let description = row[columnMapping.description] || '';
        const amountStr = row[columnMapping.amount] || '0';
        const category = row[columnMapping.category] || 'Other';
        const location = row[columnMapping.location] || '';
        const paymentMethod = row[columnMapping.paymentMethod] || '';

        // Clean description - remove quotes and extra whitespace
        description = description.toString().replace(/^"|"$/g, '').trim();

        if (!description.trim()) {
          errors.push(`Row ${i + 1}: Missing description`);
          continue;
        }

        const parsedDate = parseDate(date);
        let amount = parseAmount(amountStr);

        if (amount === 0) {
          errors.push(`Row ${i + 1}: Invalid amount "${amountStr}"`);
          continue;
        }

        // For bank CSV format, automatically categorize based on description
        let detectedCategory = category;
        if (isHeaderlessBankCSV && category === 'Other') {
          detectedCategory = categorizeTransaction(description);
        }

        transactions.push({
          userId,
          date: parsedDate,
          description: description.trim(),
          amount,
          category: detectedCategory.trim() || 'Other',
          location: location.trim() || null,
          paymentMethod: paymentMethod.trim() || null,
          recurring: false,
        });

      } catch (error) {
        errors.push(`Row ${i + 1}: ${error}`);
      }
    }

    if (transactions.length === 0) {
      res.status(400).json({ 
        error: 'No valid transactions found in CSV',
        details: errors 
      });
      return;
    }

    // Save transactions to database
    const savedTransactions = await prisma.transaction.createMany({
      data: transactions,
      skipDuplicates: true,
    });

    res.json({
      success: true,
      message: `Successfully imported ${savedTransactions.count} transactions`,
      imported: savedTransactions.count,
      total: results.length,
      errors: errors.length > 0 ? errors : undefined,
    });

  } catch (error) {
    console.error('CSV import error:', error);
    res.status(500).json({ 
      error: 'Failed to process CSV file',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get import history endpoint
router.get('/history', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    
    // Get recent transactions to show import history
    const recentTransactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    res.json({ transactions: recentTransactions });

  } catch (error) {
    console.error('Import history error:', error);
    res.status(500).json({ error: 'Failed to get import history' });
  }
});

export default router;