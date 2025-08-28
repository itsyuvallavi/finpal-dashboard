import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { createTransactionSchema, updateTransactionSchema, CreateTransactionRequest, UpdateTransactionRequest } from '../types/transaction';

const router = Router();
const prisma = new PrismaClient();

// All routes require authentication
router.use(authenticateToken);

// Get all transactions for user
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });

    res.json({ transactions });

  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single transaction
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const transaction = await prisma.transaction.findFirst({
      where: { 
        id,
        userId 
      },
    });

    if (!transaction) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }

    res.json({ transaction });

  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new transaction
router.post('/', validateRequest(createTransactionSchema), async (req: Request<{}, {}, CreateTransactionRequest>, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { amount, description, category, date, location, paymentMethod, recurring } = req.body;

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        amount,
        description,
        category,
        date: date ? new Date(date) : new Date(),
        location,
        paymentMethod,
        recurring,
      },
    });

    res.status(201).json({ transaction });

  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update transaction
router.put('/:id', validateRequest(updateTransactionSchema), async (req: Request<{ id: string }, {}, UpdateTransactionRequest>, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    // Check if transaction exists and belongs to user
    const existingTransaction = await prisma.transaction.findFirst({
      where: { 
        id,
        userId 
      },
    });

    if (!existingTransaction) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }

    const updateData: any = { ...req.body };
    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }

    const transaction = await prisma.transaction.update({
      where: { id },
      data: updateData,
    });

    res.json({ transaction });

  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Bulk delete all transactions for user (must come before /:id route)
router.delete('/bulk', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    const result = await prisma.transaction.deleteMany({
      where: { userId },
    });

    res.json({ 
      message: `Successfully deleted ${result.count} transactions`,
      deletedCount: result.count 
    });

  } catch (error) {
    console.error('Bulk delete transactions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete transaction
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    // Check if transaction exists and belongs to user
    const existingTransaction = await prisma.transaction.findFirst({
      where: { 
        id,
        userId 
      },
    });

    if (!existingTransaction) {
      res.status(404).json({ error: 'Transaction not found' });
      return;
    }

    await prisma.transaction.delete({
      where: { id },
    });

    res.json({ message: 'Transaction deleted successfully' });

  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Recategorize all transactions for user
router.put('/recategorize/all', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;

    // Get all transactions for the user
    const transactions = await prisma.transaction.findMany({
      where: { userId },
    });

    if (transactions.length === 0) {
      res.json({ message: 'No transactions to recategorize', updated: 0 });
      return;
    }

    // Categorization logic (same as frontend)
    const categorizeTransaction = (description: string, amount: number): string => {
      const desc = description.toLowerCase();
      
      // ALL POSITIVE AMOUNTS ARE INCOME - NO EXCEPTIONS!
      if (amount > 0) {
        return 'Income';
      }
      
      // Credit Card Payments
      if (desc.includes('wells fargo card') || desc.includes('applecard') || desc.includes('credit card pymt') ||
          desc.includes('cc payment') || desc.includes('card payment') || desc.includes('credit card')) {
        return 'Credit Card Payments';
      }
      
      // Rent & Housing
      if (desc.includes('bilt') || desc.includes('rent') || desc.includes('housing') || 
          desc.includes('apartment') || desc.includes('lease')) {
        return 'Rent & Housing';
      }
      
      // Money Transfers (including Venmo)
      if (desc.includes('venmo') || desc.includes('zelle') || desc.includes('paypal') || 
          desc.includes('cashapp') || desc.includes('transfer') || desc.includes('wire') || 
          desc.includes('ach') || desc.includes('send money') || desc.includes('money transfer')) {
        return 'Money Transfers';
      }
      
      // Online Bill Payments
      if (desc.includes('online pymt') || desc.includes('online payment') || desc.includes('bill pay') ||
          desc.includes('autopay') || desc.includes('auto pay') || desc.includes('scheduled payment')) {
        return 'Bill Payments';
      }
      
      // Subscriptions & Services - Recurring digital payments
      if (desc.includes('apple.com') || desc.includes('netflix') || desc.includes('spotify') || 
          desc.includes('amazon prime') || desc.includes('windscribe') || desc.includes('adobe') ||
          desc.includes('microsoft') || desc.includes('distrokid') || desc.includes('subscription') ||
          desc.includes('recurring payment') || desc.includes('monthly') || desc.includes('annual')) {
        return 'Subscriptions';
      }
      
      // Shopping - Purchases, retail stores
      if (desc.includes('purchase authorized') || desc.includes('amazon') || desc.includes('target') ||
          desc.includes('walmart') || desc.includes('store') || desc.includes('shop') ||
          desc.includes('retail') || desc.includes('merchant') || desc.includes('pos purchase')) {
        return 'Shopping';
      }
      
      // ATM & Cash
      if (desc.includes('atm withdrawal') || desc.includes('atm') || desc.includes('cash advance') ||
          desc.includes('cash back') || desc.includes('withdrawal')) {
        return 'ATM & Cash';
      }
      
      // Fees & Charges
      if (desc.includes('fee') || desc.includes('charge') || desc.includes('interest') ||
          desc.includes('penalty') || desc.includes('service charge') || desc.includes('overdraft')) {
        return 'Fees & Charges';
      }
      
      // For everything else, use a simple generic category
      return 'Others';
    };

    // Update transactions in batches
    let updatedCount = 0;
    const updatePromises = transactions.map(async (transaction) => {
      const newCategory = categorizeTransaction(transaction.description, transaction.amount);
      
      // Only update if category changed
      if (newCategory !== transaction.category) {
        await prisma.transaction.update({
          where: { id: transaction.id },
          data: { category: newCategory },
        });
        updatedCount++;
      }
    });

    await Promise.all(updatePromises);

    res.json({ 
      message: `Successfully recategorized transactions`,
      updated: updatedCount,
      total: transactions.length 
    });

  } catch (error) {
    console.error('Recategorize transactions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;