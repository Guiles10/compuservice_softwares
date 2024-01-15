import { z } from 'zod';

export const supCardSchema = z.object({
    title: z.string().min(1, { message: 'O título é obrigatório' }),
    description: z.string(),
    solution: z.string(),
    priority: z.string(),
});

export type supCardSchemaType = z.infer<typeof supCardSchema>

export const supEditCardSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    solution: z.string().optional(),
    priority: z.string().optional(),
});

export type supEditCardSchemaType = z.infer<typeof supEditCardSchema>