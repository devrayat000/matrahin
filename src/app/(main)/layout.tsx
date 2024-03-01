import React from "react";
import MainNav from "./MainNav";
import UserNav from "./UserNav";
import Link from "next/link";
import Footer from "./Footer";
import logo from "~/assets/logo.png";
import Image from "next/image";
import MainDrawer from "./MainDrawer";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full">
      <main className="min-h-[calc(100vh-10rem)]">{children}</main>
      <Footer />
    </div>
  );
}
