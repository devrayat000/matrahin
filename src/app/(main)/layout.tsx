import React from "react";
import MainNav from "./MainNav";
import UserNav from "./UserNav";
import { auth } from "~/lib/auth";
import Link from "next/link";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <main className="h-screen">
      <header className="border-b w-full fixed top-0 z-50 bg-background">
        <div className="flex h-16 justify-between items-center px-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-xl font-bold px-1 py-0.5 bg-foreground text-background rounded">
              Logo
            </span>
            <span className="text-xl font-semibold">Matrahin</span>
          </Link>
          <MainNav className="mx-6" />
          {!!session && (
            <div className="flex items-center">
              <UserNav />
            </div>
          )}
        </div>
      </header>
      <section className="pt-[calc(4rem+1px)] h-full">{children}</section>
    </main>
  );
}
