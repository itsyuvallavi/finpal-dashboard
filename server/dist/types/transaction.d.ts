import { z } from 'zod';
export declare const createTransactionSchema: z.ZodObject<{
    amount: z.ZodNumber;
    description: z.ZodString;
    category: z.ZodString;
    date: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
    paymentMethod: z.ZodOptional<z.ZodString>;
    recurring: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    amount: number;
    description: string;
    category: string;
    recurring: boolean;
    date?: string | undefined;
    location?: string | undefined;
    paymentMethod?: string | undefined;
}, {
    amount: number;
    description: string;
    category: string;
    date?: string | undefined;
    location?: string | undefined;
    paymentMethod?: string | undefined;
    recurring?: boolean | undefined;
}>;
export declare const updateTransactionSchema: z.ZodObject<{
    amount: z.ZodOptional<z.ZodNumber>;
    description: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    date: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    location: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    paymentMethod: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    recurring: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    amount?: number | undefined;
    description?: string | undefined;
    category?: string | undefined;
    date?: string | undefined;
    location?: string | undefined;
    paymentMethod?: string | undefined;
    recurring?: boolean | undefined;
}, {
    amount?: number | undefined;
    description?: string | undefined;
    category?: string | undefined;
    date?: string | undefined;
    location?: string | undefined;
    paymentMethod?: string | undefined;
    recurring?: boolean | undefined;
}>;
export type CreateTransactionRequest = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionRequest = z.infer<typeof updateTransactionSchema>;
//# sourceMappingURL=transaction.d.ts.map