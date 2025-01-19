import { z } from "zod";

export const LoginValidation = z.object({
  email: z.string().email("L'email n'est pas valide."),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères."),
});
