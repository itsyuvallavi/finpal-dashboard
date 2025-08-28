"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const csv_parser_1 = __importDefault(require("csv-parser"));
const stream_1 = require("stream");
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const zod_1 = require("zod");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
            cb(null, true);
        }
        else {
            cb(new Error('Only CSV files are allowed'));
        }
    },
});
const csvRowSchema = zod_1.z.object({
    date: zod_1.z.string(),
    description: zod_1.z.string(),
    amount: zod_1.z.string(),
    category: zod_1.z.string().optional().default('Other'),
    location: zod_1.z.string().optional(),
    paymentMethod: zod_1.z.string().optional(),
});
const columnMappings = {
    date: ['date', 'transaction date', 'posted date', 'trans date', 'transaction_date'],
    description: ['description', 'merchant', 'payee', 'transaction', 'memo', 'details'],
    amount: ['amount', 'transaction amount', 'debit', 'credit', 'withdrawal', 'deposit'],
    category: ['category', 'type', 'transaction type', 'class'],
    location: ['location', 'address', 'city'],
    paymentMethod: ['payment method', 'card', 'account', 'method'],
};
const normalizeColumnName = (column) => {
    return column.toLowerCase().trim().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
};
const mapColumns = (headers) => {
    const mapping = {};
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
const parseAmount = (amountStr) => {
    if (!amountStr)
        return 0;
    let cleanAmount = amountStr.toString().replace(/[$,\s]/g, '');
    if (cleanAmount.includes('(') && cleanAmount.includes(')')) {
        cleanAmount = '-' + cleanAmount.replace(/[()]/g, '');
    }
    const amount = parseFloat(cleanAmount);
    return isNaN(amount) ? 0 : amount;
};
const parseDate = (dateStr) => {
    if (!dateStr)
        return new Date();
    const formats = [
        /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
        /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
        /^(\d{4})-(\d{1,2})-(\d{1,2})$/,
        /^(\d{1,2})-(\d{1,2})-(\d{4})$/,
    ];
    let date = new Date(dateStr);
    if (!isNaN(date.getTime())) {
        return date;
    }
    return new Date();
};
router.use(auth_1.authenticateToken);
router.post('/upload', upload.single('csvFile'), async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No CSV file uploaded' });
            return;
        }
        const userId = req.user.userId;
        const results = [];
        const errors = [];
        const stream = stream_1.Readable.from(req.file.buffer.toString());
        await new Promise((resolve, reject) => {
            stream
                .pipe((0, csv_parser_1.default)())
                .on('headers', (headers) => {
                console.log('CSV Headers:', headers);
            })
                .on('data', (row) => {
                results.push(row);
            })
                .on('end', () => {
                resolve();
            })
                .on('error', (error) => {
                reject(error);
            });
        });
        if (results.length === 0) {
            res.status(400).json({ error: 'CSV file is empty or invalid' });
            return;
        }
        const headers = Object.keys(results[0]);
        const columnMapping = mapColumns(headers);
        console.log('Column mapping:', columnMapping);
        const transactions = [];
        for (let i = 0; i < results.length; i++) {
            const row = results[i];
            try {
                const date = row[columnMapping.date] || '';
                const description = row[columnMapping.description] || '';
                const amountStr = row[columnMapping.amount] || '0';
                const category = row[columnMapping.category] || 'Other';
                const location = row[columnMapping.location] || '';
                const paymentMethod = row[columnMapping.paymentMethod] || '';
                if (!description.trim()) {
                    errors.push(`Row ${i + 1}: Missing description`);
                    continue;
                }
                const parsedDate = parseDate(date);
                const amount = parseAmount(amountStr);
                if (amount === 0) {
                    errors.push(`Row ${i + 1}: Invalid amount "${amountStr}"`);
                    continue;
                }
                transactions.push({
                    userId,
                    date: parsedDate,
                    description: description.trim(),
                    amount,
                    category: category.trim() || 'Other',
                    location: location.trim() || null,
                    paymentMethod: paymentMethod.trim() || null,
                    recurring: false,
                });
            }
            catch (error) {
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
    }
    catch (error) {
        console.error('CSV import error:', error);
        res.status(500).json({
            error: 'Failed to process CSV file',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
router.get('/history', async (req, res) => {
    try {
        const userId = req.user.userId;
        const recentTransactions = await prisma.transaction.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
        res.json({ transactions: recentTransactions });
    }
    catch (error) {
        console.error('Import history error:', error);
        res.status(500).json({ error: 'Failed to get import history' });
    }
});
exports.default = router;
//# sourceMappingURL=csv-import.js.map