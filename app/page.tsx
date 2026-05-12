import { getSession } from "@/lib/auth/session";
import FoundationHome from "@/components/home/FoundationHome";
import VolunteerHome from "@/components/home/VolunteerHome";

const FUNDACION_ROLE = 2;

export default async function Home() {
  const session = await getSession();
  const role = Number(session?.role ?? 1);
  const name = session?.name ?? "Usuario";

  if (role === FUNDACION_ROLE) {
    return <FoundationHome name={name} />;
  }

  return <VolunteerHome name={name} />;
}

