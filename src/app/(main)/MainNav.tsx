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
      className={cn(
        "flex flex-col sm:flex-row items-stretch sm:items-center gap-1 lg:gap-x-1.5",
        className
      )}
      {...props}
    >
      <Link
        href="/calc"
        className={buttonVariants({
          variant: "ghost",
          className: pathname !== "/calc" && "text-muted-foreground",
        })}
        title="Explore the latest scientific calculators and simulators"
      >
        Explore
      </Link>
      <Link
        href="/feedback"
        className={buttonVariants({
          variant: "ghost",
          className: pathname !== "/feedback" && "text-muted-foreground",
        })}
        title="Send us your feedback"
      >
        Feedback
      </Link>
    </nav>
  );
}
