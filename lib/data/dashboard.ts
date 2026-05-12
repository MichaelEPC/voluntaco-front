import type { Insight, ActivityItem, PipelineStep } from "@/types";

export const navigation: string[] = [
  "Explorar",
  "Mis aplicaciones",
  "Notificaciones",
  "Perfil",
];

export const insights: Insight[] = [
  { value: "+1.4k", label: "Postulaciones este mes" },
  { value: "87%", label: "Vacantes con cupos completos" },
  { value: "42", label: "Fundaciones verificadas" },
];

export const pipeline: PipelineStep[] = [
  { title: "Explora", copy: "Filtra por causa, ciudad y modalidad en segundos." },
  { title: "Postula", copy: "Comparte motivacion, experiencia y disponibilidad desde tu perfil." },
  { title: "Haz seguimiento", copy: "Recibe respuestas, alertas y siguientes pasos desde un mismo lugar." },
];

export const activity: ActivityItem[] = [
  { label: "Nueva vacante en educacion", time: "Hace 12 min", tone: "status-dot" },
  { label: "Tu perfil fue visto por EcoRaices", time: "Hace 1 hora", tone: "status-dot status-dot--warm" },
  { label: "Cierre de postulaciones manana", time: "Hace 3 horas", tone: "status-dot status-dot--danger" },
];
