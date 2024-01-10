"use client"; // Error components must be Client Components

import { useEffect } from "react";
import { Button } from "~/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="py-20">
      <section className="container">
        <h1 className="text-center font-black text-9xl md:text-[16rem] mb-10">
          500
        </h1>
        <h2 className="text-center text-black text-3xl md:text-4xl">
          Something bad just happened...
        </h2>
        <p className="text-lg text-center max-w-96 mx-auto my-5 text-muted-foreground">
          Our servers could not handle your request. Don&apos;t worry, our
          development team was already notified. Try refreshing the page.
        </p>
        <div className="flex items-center justify-center">
          <Button variant="secondary" onClick={reset}>
            Refresh the page
          </Button>
        </div>
      </section>
    </div>
  );
}
