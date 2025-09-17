import { Metadata } from "next";
import React from "react";
import AdminLayout from "@/components/AdminLayout";

export const metadata: Metadata = {
  title: "Dashboard | FollowerGratis.it",
};

const layout = ({ children }: { children: React.ReactNode }) => {
  return <AdminLayout>{children}</AdminLayout>;
};

export default layout;
