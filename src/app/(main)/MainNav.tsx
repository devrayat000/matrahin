"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export default function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  return (
    <nav
      className={cn("flex items-center gap-x-0.5 lg:gap-x-1.5", className)}
      {...props}
    >
      <Link
        href="/calc"
        className={buttonVariants({
          variant: "ghost",
          className: pathname !== "/calc" && "text-muted-foreground",
        })}
      >
        Calculators
      </Link>
      <Link
        href="/register"
        className={buttonVariants({
          variant: "ghost",
          className: pathname !== "/register" && "text-muted-foreground",
        })}
      >
        Pricing
      </Link>
      <Link
        href="/feedback"
        className={buttonVariants({
          variant: "ghost",
          className: pathname !== "/feedback" && "text-muted-foreground",
        })}
      >
        Feedback
      </Link>
    </nav>
  );
}
