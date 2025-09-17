import UserLayout from "@/components/UserLayout";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return <UserLayout>{children}</UserLayout>;
};

export default layout;
