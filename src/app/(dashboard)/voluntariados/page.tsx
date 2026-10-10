import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getVoluntariadosFundacion, getModalidades, getVoluntariosRoles, getHabilidades } from "@/lib/data/voluntariados";
import { ROLES } from "@/lib/constants/roles";
import VoluntariadosView from "@/components/voluntariados/VoluntariadosView";

export default async function VoluntariadosPage() {
  const session = await getSession();

  // Solo las fundaciones pueden gestionar voluntariados
  if (!session || Number(session.role) !== ROLES.FUNDACION) {
    redirect("/");
  }

  const fundacionId = session.sub ?? "";

  const [voluntariados, modalidades, voluntariosRoles, habilidades] = await Promise.all([
    fundacionId ? getVoluntariadosFundacion(fundacionId) : Promise.resolve([]),
    getModalidades(),
    getVoluntariosRoles(),
    getHabilidades(),
  ]);

  return (
    <VoluntariadosView
      fundacionId={fundacionId}
      voluntariados={voluntariados}
      modalidades={modalidades}
      voluntariosRoles={voluntariosRoles}
      habilidades={habilidades}
    />
  );
}
