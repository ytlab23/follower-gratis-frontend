import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Admin Login | Access Your SMM Panel",
    description: "Login to your admin dashboard and manage your SMM panel",
};

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
