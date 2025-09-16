import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Accedi a FollowerGratis.it - Area Utenti",
  description:
    "Entra nella tua area personale su FollowerGratis.it per gestire i tuoi servizi e monitorare i tuoi progressi in pochi click.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
