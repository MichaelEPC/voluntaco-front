import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getVoluntariadosFundacion, getModalidades, getVoluntariosRoles, getHabilidades } from "@/lib/data/voluntariados";
import VoluntariadosView from "@/components/voluntariados/VoluntariadosView";

const FUNDACION_ROLE = 2;

export default async function VoluntariadosPage() {
  const session = await getSession();

  // Only foundations can manage voluntariados
  if (!session || Number(session.role) !== FUNDACION_ROLE) {
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
