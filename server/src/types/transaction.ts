import { z } from 'zod';

export const createTransactionSchema = z.object({
  amount: z.number(),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  date: z.string().optional(),
  location: z.string().nullable().optional(),
  paymentMethod: z.string().nullable().optional(),
  recurring: z.boolean().default(false),
});

export const updateTransactionSchema = createTransactionSchema.partial();

export type CreateTransactionRequest = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionRequest = z.infer<typeof updateTransactionSchema>;