/**
 * Numeric role identifiers used by the backend's `usuario.rol_id`.
 * Centralized here so pages and components don't redefine these magic
 * numbers independently.
 */
export const ROLES = {
  VOLUNTARIO: 1,
  FUNDACION: 2,
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
