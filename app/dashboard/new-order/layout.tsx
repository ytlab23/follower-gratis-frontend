import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nuovo Ordine | FollowerGratis.it",
};

export default function NewOrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
