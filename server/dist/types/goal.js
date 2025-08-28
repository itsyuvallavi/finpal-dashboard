"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGoalSchema = exports.createGoalSchema = void 0;
const zod_1 = require("zod");
exports.createGoalSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required'),
    description: zod_1.z.string().optional(),
    targetAmount: zod_1.z.number().positive('Target amount must be positive'),
    targetDate: zod_1.z.string(),
    category: zod_1.z.string().min(1, 'Category is required'),
    priority: zod_1.z.enum(['high', 'medium', 'low']).default('medium'),
    monthlyContribution: zod_1.z.number().min(0).default(0),
});
exports.updateGoalSchema = exports.createGoalSchema.partial().extend({
    currentAmount: zod_1.z.number().min(0).optional(),
    status: zod_1.z.enum(['on-track', 'behind', 'ahead', 'completed']).optional(),
});
//# sourceMappingURL=goal.js.map