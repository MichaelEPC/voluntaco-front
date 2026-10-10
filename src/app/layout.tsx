import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import RoleNavbar from "@/components/navigation/RoleNavbar";
import { getSession } from "@/lib/auth/session";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Voluntaco | Voluntariado para fundaciones y personas",
  description:
    "Landing page de un aplicativo donde fundaciones publican ofertas de voluntariado y las personas pueden descubrirlas y postularse.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html
      lang="es"
      className={`${manrope.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--color-surface)]">
        <RoleNavbar session={session} />
        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}
