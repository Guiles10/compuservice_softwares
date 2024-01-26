import { z } from 'zod';

export const commentSchema = z.object({
    comment: z.string().min(1, { message: 'Digite sua mensagem' }),
});

export type commentSchemaType = z.infer<typeof commentSchema>

export const editCommentSchema = z.object({
    comment: z.string().min(1, { message: 'Digite sua mensagem' }),
});

export type editCommentSchemaType = z.infer<typeof editCommentSchema>