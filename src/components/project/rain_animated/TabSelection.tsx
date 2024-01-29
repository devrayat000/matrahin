"use client";

import Link from "next/link";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

const TabSelection = ({
  activeCase,
  currentCase,
  text,
}: {
  activeCase: string;
  currentCase: string;
  text: string;
}) => {
  return (
    <Link href={`?case=${activeCase}`}>
      <Button
        // disabled={activeCase === "basic"}
        className={cn(
          currentCase === activeCase
            ? "bg-green-500 text-white"
            : "bg-slate-100 text-black",
          "hover:text-black hover:bg-green-300"
        )}
      >
        {text}
      </Button>
    </Link>
  );
};

export default TabSelection;
