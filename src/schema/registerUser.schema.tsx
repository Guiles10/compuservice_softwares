import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string().min(3, { message: 'Informe o nome do Usuario' }),
    email: z.string().email('o e-mail inserido é inválido'),
    password: z.string().min(6, { message: 'A senha deve ter no mínimo 6 caracteres' }),
    confirmPassword: z.string().min(6, { message: 'A senha deve ter no mínimo 6 caracteres' }),
});

export type registerSchemaType = z.infer<typeof registerSchema>;