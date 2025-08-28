import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  age: z.string().optional().transform((val) => val ? parseInt(val) : undefined),
  maritalStatus: z.string().optional(),
  children: z.string().optional().transform((val) => val ? parseInt(val) : undefined),
  location: z.string().optional(),
  occupation: z.string().optional(),
  annualIncome: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type RegisterRequest = z.infer<typeof registerSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;

export interface JWTPayload {
  userId: string;
  email: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
}