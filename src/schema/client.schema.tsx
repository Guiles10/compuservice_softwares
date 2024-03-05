import { z } from 'zod';

export const clientSchema = z.object({
    codigo: z.string().min(1, { message: 'Código obrigatório' }),
    companyName: z.string().min(1, { message: 'Nome obrigatório' }),
    socialName: z.string().min(1, { message: 'Nome obrigatório' }),
    cnpj: z.string().min(1, { message: 'CNPJ obrigatório' }),
    businessPhone: z.string().min(1, { message: 'Obrigatório' }),
    businessEmail: z.string().optional(),
    comment: z.string().optional(),
    cep: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    street: z.string().optional(),
    neighborhood: z.string().optional(),
    number: z.string().optional(),

});

export type clientSchemaType = z.infer<typeof clientSchema>;