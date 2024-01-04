"use client";

import Image from "next/image";
import underConstruction from "~/assets/under_construction.svg";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function UnderConstruction() {
  const router = useRouter();

  return (
    <div>
      <section className="min-h-screen grid place-items-center">
        <div className="grid place-items-center">
          <Image
            {...underConstruction}
            width={600}
            height={600}
            alt="Under Construction"
          />
          <div className="mt-4 grid place-items-center">
            <p className="text-center text-base font-medium">
              The page you're trying to reach might not be available at the
              moment.
            </p>
            <Button
              variant="secondary"
              className="mt-2 w-44"
              onClick={router.back}
            >
              Go Back
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
