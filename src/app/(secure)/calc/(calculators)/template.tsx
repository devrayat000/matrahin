"use client";

import { usePathname } from "next/navigation";
import { useEffect, useTransition } from "react";
import { publishHistory } from "~/services/graphql/history";

export default function CalculatorTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => publishHistory(pathname));
  }, [pathname]);

  return children;
}
