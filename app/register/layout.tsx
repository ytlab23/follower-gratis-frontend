import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registrati su FollowerGratis.it - Crea il tuo account gratis",
  description:
    "Apri subito un account gratuito su FollowerGratis.it e inizia a far crescere il tuo profilo con i nostri strumenti semplici e veloci.",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
