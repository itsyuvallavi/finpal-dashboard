import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validation';
import { createGoalSchema, updateGoalSchema, CreateGoalRequest, UpdateGoalRequest } from '../types/goal';

const router = Router();
const prisma = new PrismaClient();

// All routes require authentication
router.use(authenticateToken);

// Get all goals for user
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    
    const goals = await prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ goals });

  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single goal
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
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

  } catch (error) {
    console.error('Get goal error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new goal
router.post('/', validateRequest(createGoalSchema), async (req: Request<{}, {}, CreateGoalRequest>, res: Response) => {
  try {
    const userId = req.user!.userId;
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

  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update goal
router.put('/:id', validateRequest(updateGoalSchema), async (req: Request<{ id: string }, {}, UpdateGoalRequest>, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    // Check if goal exists and belongs to user
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

    const updateData: any = { ...req.body };
    if (updateData.targetDate) {
      updateData.targetDate = new Date(updateData.targetDate);
    }

    const goal = await prisma.goal.update({
      where: { id },
      data: updateData,
    });

    res.json({ goal });

  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete goal
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    // Check if goal exists and belongs to user
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

  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;