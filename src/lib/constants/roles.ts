/**
 * Identificadores numericos de rol usados por el `rol_id` del usuario en el backend.
 * Centralizados aqui para que las paginas y componentes no redefinan estos
 * numeros magicos de forma independiente.
 */
export const ROLES = {
  VOLUNTARIO: 1,
  FUNDACION: 2,
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
