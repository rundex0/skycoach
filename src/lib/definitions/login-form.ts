
import { z } from 'zod'

export const LoginFormSchema = z.object({
    email: z.string().email({ message: "L'email n'est pas valide" }).trim(),
    password: z
        .string()
        .min(4, { message: 'Be at least 4 characters long' })
        //.regex(/[a-zA-Z]/, { message: 'Contain at least one letter.' })
        //.regex(/[0-9]/, { message: 'Contain at least one number.' })
        //.regex(/[^a-zA-Z0-9]/, { message: 'Contain at least one special character.'})
        .trim(),
})

export type LoginFormState =
    | {
    errors?: {
        email?: string[]
        password?: string[]
    }
    message?: string
}
    | undefined