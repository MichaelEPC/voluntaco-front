import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Ingresa tu correo")
    .email("Correo invalido")
    .toLowerCase(),
  password: z.string().min(1, "Ingresa tu contrasena"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export type LoginFormState = {
  message?: string;
  attemptedAt?: number;
  values?: LoginInput;
};
