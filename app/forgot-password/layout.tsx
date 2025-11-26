"use client";

import { LanguageToggle } from "@/components/LanguageToggle";

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <div className="fixed top-4 right-4 z-50">
        <LanguageToggle />
      </div>
      {children}
    </div>
  );
}
