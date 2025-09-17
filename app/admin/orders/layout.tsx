import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ordini | FollowerGratis.it",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
