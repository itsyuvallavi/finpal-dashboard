import { z } from 'zod';

export const createGoalSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  targetAmount: z.number().positive('Target amount must be positive'),
  targetDate: z.string(),
  category: z.string().min(1, 'Category is required'),
  priority: z.enum(['high', 'medium', 'low']).default('medium'),
  monthlyContribution: z.number().min(0).default(0),
});

export const updateGoalSchema = createGoalSchema.partial().extend({
  currentAmount: z.number().min(0).optional(),
  status: z.enum(['on-track', 'behind', 'ahead', 'completed']).optional(),
});

export type CreateGoalRequest = z.infer<typeof createGoalSchema>;
export type UpdateGoalRequest = z.infer<typeof updateGoalSchema>;