import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { ROLES } from "@/lib/constants/roles";

export default async function ProyectosLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (Number(session.role) !== ROLES.FUNDACION) redirect("/");

  return (
    <main className="relative px-4 py-3 sm:px-6 lg:px-8">
      <div className="shell-panel mx-auto w-full max-w-5xl rounded-[2rem] p-2.5">
        <div className="dashboard-content min-w-0">{children}</div>
      </div>
    </main>
  );
}
