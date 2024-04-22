import { z } from 'zod';

export const clientSchema = z.object({
    codigo: z.string(),
    companyName: z.string().min(1, { message: 'Nome obrigatório' }),
    socialName: z.string().min(1, { message: 'Nome obrigatório' }),
    cnpj: z.string().optional(),
    cpf: z.string().optional(),
    businessPhone_1: z.string().optional(),
    businessPhone_2: z.string().optional(),
    businessEmail: z.string().optional(),
    site: z.string().optional(),
    comment: z.string().optional(),
    cep: z.string().optional(),
    state: z.string().optional(),
    city: z.string().optional(),
    street: z.string().optional(),
    neighborhood: z.string().optional(),
    number: z.string().optional(),

});

export type clientSchemaType = z.infer<typeof clientSchema>;