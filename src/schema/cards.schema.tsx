import { z } from 'zod';

export const cardSchema = z.object({
    title: z.string().min(1, { message: 'O título é obrigatório' }),
    description: z.string().optional(),
    priority: z.string().optional(),
    type: z.array(z.string()), 
});

export type cardSchemaType = z.infer<typeof cardSchema>

export const editCardSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    solution: z.string().optional(),
    priority: z.string().optional(),
    type: z.array(z.string()).optional(), 
});

export type editCardSchemaType = z.infer<typeof editCardSchema>