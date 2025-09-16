import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reimposta la tua password - FollowerGratis.it",
  description:
    "Hai dimenticato la password? Reimposta facilmente l'accesso al tuo account FollowerGratis.it in pochi secondi.",
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
