"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const goal_1 = require("../types/goal");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.use(auth_1.authenticateToken);
router.get('/', async (req, res) => {
    try {
        const userId = req.user.userId;
        const goals = await prisma.goal.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        res.json({ goals });
    }
    catch (error) {
        console.error('Get goals error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        const goal = await prisma.goal.findFirst({
            where: {
                id,
                userId
            },
        });
        if (!goal) {
            res.status(404).json({ error: 'Goal not found' });
            return;
        }
        res.json({ goal });
    }
    catch (error) {
        console.error('Get goal error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.post('/', (0, validation_1.validateRequest)(goal_1.createGoalSchema), async (req, res) => {
    try {
        const userId = req.user.userId;
        const { title, description, targetAmount, targetDate, category, priority, monthlyContribution } = req.body;
        const goal = await prisma.goal.create({
            data: {
                userId,
                title,
                description,
                targetAmount,
                targetDate: new Date(targetDate),
                category,
                priority,
                monthlyContribution,
            },
        });
        res.status(201).json({ goal });
    }
    catch (error) {
        console.error('Create goal error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.put('/:id', (0, validation_1.validateRequest)(goal_1.updateGoalSchema), async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        const existingGoal = await prisma.goal.findFirst({
            where: {
                id,
                userId
            },
        });
        if (!existingGoal) {
            res.status(404).json({ error: 'Goal not found' });
            return;
        }
        const updateData = { ...req.body };
        if (updateData.targetDate) {
            updateData.targetDate = new Date(updateData.targetDate);
        }
        const goal = await prisma.goal.update({
            where: { id },
            data: updateData,
        });
        res.json({ goal });
    }
    catch (error) {
        console.error('Update goal error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        const existingGoal = await prisma.goal.findFirst({
            where: {
                id,
                userId
            },
        });
        if (!existingGoal) {
            res.status(404).json({ error: 'Goal not found' });
            return;
        }
        await prisma.goal.delete({
            where: { id },
        });
        res.json({ message: 'Goal deleted successfully' });
    }
    catch (error) {
        console.error('Delete goal error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
//# sourceMappingURL=goals.js.map