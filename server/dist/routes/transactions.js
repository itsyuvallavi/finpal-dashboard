"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const transaction_1 = require("../types/transaction");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.use(auth_1.authenticateToken);
router.get('/', async (req, res) => {
    try {
        const userId = req.user.userId;
        const transactions = await prisma.transaction.findMany({
            where: { userId },
            orderBy: { date: 'desc' },
        });
        res.json({ transactions });
    }
    catch (error) {
        console.error('Get transactions error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const userId = req.user.userId;
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
    }
    catch (error) {
        console.error('Get transaction error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.post('/', (0, validation_1.validateRequest)(transaction_1.createTransactionSchema), async (req, res) => {
    try {
        const userId = req.user.userId;
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
    }
    catch (error) {
        console.error('Create transaction error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.put('/:id', (0, validation_1.validateRequest)(transaction_1.updateTransactionSchema), async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
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
        const updateData = { ...req.body };
        if (updateData.date) {
            updateData.date = new Date(updateData.date);
        }
        const transaction = await prisma.transaction.update({
            where: { id },
            data: updateData,
        });
        res.json({ transaction });
    }
    catch (error) {
        console.error('Update transaction error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
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
    }
    catch (error) {
        console.error('Delete transaction error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
//# sourceMappingURL=transactions.js.map