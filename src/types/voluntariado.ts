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
