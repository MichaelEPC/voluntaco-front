import type { ComponentType } from "react";

// ── Domain models ────────────────────────────────────────────────────────────

export interface Opportunity {
  title: string;
  foundation: string;
  location: string;
  mode: string;
  type: string;
  duration: string;
  schedule: string;
  impact: string;
  badge: string;
  accent: string;
}

export interface Insight {
  value: string;
  label: string;
}

export interface ActivityItem {
  label: string;
  time: string;
  tone: string;
}

export interface PipelineStep {
  title: string;
  copy: string;
}

export interface AccountType {
  title: string;
  badge: string;
  description: string;
  cta: string;
  dark: boolean;
  Icon: ComponentType;
}

export interface SocialProvider {
  name: string;
  mark: string;
  accent: string;
}

// ── Voluntariados ────────────────────────────────────────────────────────────

export type VoluntariadoEstado = "ABIERTO" | "EN_PROGRESO" | "FINALIZADO";

export interface Voluntariado {
  id: number;
  fundacion_id: string;
  nombre: string;
  descripcion?: string;
  modalidad_id?: number;
  /** Name of the modalidad, may be populated by the API via join. */
  modalidad?: string;
  usuario_rol_id?: number;
  /** Name of the volunteer role, may be populated by the API via join. */
  rol_voluntario?: string;
  estado: VoluntariadoEstado;
  fecha_creacion: string;
  /** Number of applicants, if returned by the API. */
  postulaciones_count?: number;
  /** Skills linked to this voluntariado, may be returned by the API. */
  habilidades?: Habilidad[];
}

export interface Modalidad {
  id: number;
  nombre: string;
}

export interface VoluntarioRol {
  id: number;
  nombre: string;
}

export interface Habilidad {
  id: number;
  nombre: string;
}
