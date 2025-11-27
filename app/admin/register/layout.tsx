import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Admin Registration | Create Your SMM Panel",
    description: "Register as a Script Admin and launch your own branded SMM panel",
};

export default function RegisterLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
