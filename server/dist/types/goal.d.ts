import { z } from 'zod';
export declare const createGoalSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    targetAmount: z.ZodNumber;
    targetDate: z.ZodString;
    category: z.ZodString;
    priority: z.ZodDefault<z.ZodEnum<["high", "medium", "low"]>>;
    monthlyContribution: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    category: string;
    title: string;
    targetAmount: number;
    targetDate: string;
    priority: "high" | "medium" | "low";
    monthlyContribution: number;
    description?: string | undefined;
}, {
    category: string;
    title: string;
    targetAmount: number;
    targetDate: string;
    description?: string | undefined;
    priority?: "high" | "medium" | "low" | undefined;
    monthlyContribution?: number | undefined;
}>;
export declare const updateGoalSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    targetAmount: z.ZodOptional<z.ZodNumber>;
    targetDate: z.ZodOptional<z.ZodString>;
    category: z.ZodOptional<z.ZodString>;
    priority: z.ZodOptional<z.ZodDefault<z.ZodEnum<["high", "medium", "low"]>>>;
    monthlyContribution: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
} & {
    currentAmount: z.ZodOptional<z.ZodNumber>;
    status: z.ZodOptional<z.ZodEnum<["on-track", "behind", "ahead", "completed"]>>;
}, "strip", z.ZodTypeAny, {
    status?: "on-track" | "behind" | "ahead" | "completed" | undefined;
    description?: string | undefined;
    category?: string | undefined;
    title?: string | undefined;
    targetAmount?: number | undefined;
    targetDate?: string | undefined;
    priority?: "high" | "medium" | "low" | undefined;
    monthlyContribution?: number | undefined;
    currentAmount?: number | undefined;
}, {
    status?: "on-track" | "behind" | "ahead" | "completed" | undefined;
    description?: string | undefined;
    category?: string | undefined;
    title?: string | undefined;
    targetAmount?: number | undefined;
    targetDate?: string | undefined;
    priority?: "high" | "medium" | "low" | undefined;
    monthlyContribution?: number | undefined;
    currentAmount?: number | undefined;
}>;
export type CreateGoalRequest = z.infer<typeof createGoalSchema>;
export type UpdateGoalRequest = z.infer<typeof updateGoalSchema>;
//# sourceMappingURL=goal.d.ts.map