import { getSession } from "@/lib/auth/session";
import { ROLES } from "@/lib/constants/roles";
import FoundationHome from "@/components/home/FoundationHome";
import VolunteerHome from "@/components/home/VolunteerHome";

export default async function Home() {
  const session = await getSession();
  const role = Number(session?.role ?? ROLES.VOLUNTARIO);
  const name = session?.name ?? "Usuario";

  if (role === ROLES.FUNDACION) {
    return <FoundationHome name={name} />;
  }

  return <VolunteerHome name={name} />;
}

