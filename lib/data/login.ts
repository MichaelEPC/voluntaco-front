import type { AccountType, SocialProvider } from "@/types";
import FundacionIcon from "@/components/icons/FundacionIcon";
import VoluntarioIcon from "@/components/icons/VoluntarioIcon";

export const accountTypes: AccountType[] = [
  {
    title: "Fundacion",
    badge: "Para organizaciones",
    description:
      "Publica convocatorias, gestiona postulaciones y conecta con voluntarios alineados a tu causa.",
    cta: "Fundación",
    dark: true,
    Icon: FundacionIcon,
  },
  {
    title: "Voluntario",
    badge: "Para personas",
    description:
      "Explora oportunidades, arma tu perfil y postulate en organizaciones que generan impacto real.",
    cta: "Voluntario",
    dark: false,
    Icon: VoluntarioIcon,
  },
];

export const socialProviders: SocialProvider[] = [
  { name: "Google", mark: "G", accent: "text-[#db4437]" },
  { name: "Facebook", mark: "f", accent: "text-[#1877f2]" },
];
