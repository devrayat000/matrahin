import React from "react";
import MainNav from "./MainNav";
import UserNav from "./UserNav";
import Link from "next/link";
import Footer from "./Footer";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <header className="border-b w-full sticky top-0 z-50 bg-background/50 backdrop-blur-md">
        <div className="flex h-16 justify-between items-center px-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-xl font-bold px-1 py-0.5 bg-foreground text-background rounded">
              Logo
            </span>
            <span className="text-xl font-semibold">Matrahin</span>
          </Link>
          <MainNav className="mx-6" />
          <div className="flex items-center">
            <UserNav />
          </div>
        </div>
      </header>
      <main className="min-h-screen">{children}</main>
      <Footer />
    </div>
  );
}
