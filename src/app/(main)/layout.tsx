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
    <div>
      <header className="border-b w-full sticky top-0 z-50 bg-background/80 backdrop-blur-md">
        <div className="flex h-16 justify-between items-center px-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <Image src={logo} alt="Matrahin" width={44} height={44} />
          </Link>
          <div className="hidden sm:flex">
            <MainNav className="mx-6" />
          </div>
          <div className="hidden sm:flex items-center">
            <UserNav />
          </div>
          <MainDrawer />
        </div>
      </header>
      <main className="min-h-[calc(100vh-10rem)]">{children}</main>
      <Footer />
    </div>
  );
}
