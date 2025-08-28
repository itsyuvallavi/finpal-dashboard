"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTransactionSchema = exports.createTransactionSchema = void 0;
const zod_1 = require("zod");
exports.createTransactionSchema = zod_1.z.object({
    amount: zod_1.z.number(),
    description: zod_1.z.string().min(1, 'Description is required'),
    category: zod_1.z.string().min(1, 'Category is required'),
    date: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
    paymentMethod: zod_1.z.string().optional(),
    recurring: zod_1.z.boolean().default(false),
});
exports.updateTransactionSchema = exports.createTransactionSchema.partial();
//# sourceMappingURL=transaction.js.map