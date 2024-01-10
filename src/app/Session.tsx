"use client";

import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

export default function Session({
  children,
  session,
}: {
  session?: Session;
  children: React.ReactNode;
}) {
  return <SessionProvider session={session}>{children}</SessionProvider>;
}
