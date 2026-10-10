export type VoluntariadoEstado = "ABIERTO" | "EN_PROGRESO" | "FINALIZADO";

export interface Voluntariado {
  id: number;
  fundacion_id: string;
  nombre: string;
  descripcion?: string;
  modalidad_id?: number;
  /** Nombre de la modalidad, puede venir poblado por la API via join. */
  modalidad?: string;
  usuario_rol_id?: number;
  /** Nombre del rol de voluntario, puede venir poblado por la API via join. */
  rol_voluntario?: string;
  estado: VoluntariadoEstado;
  fecha_creacion: string;
  /** Numero de postulantes, si la API lo retorna. */
  postulaciones_count?: number;
  /** Habilidades vinculadas a este voluntariado, si la API lo retorna. */
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
