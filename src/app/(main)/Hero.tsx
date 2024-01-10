import Link from "next/link";
import MathElements from "~/assets/math_elements.svg";
import { Button, buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

const dataUrl =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDMzZmYiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaGVjay1jaXJjbGUtMiI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiLz48cGF0aCBkPSJtOSAxMiAyIDIgNC00Ii8+PC9zdmc+";

export default function Hero() {
  return (
    <section id="hero" className="container">
      <div className="flex justify-between gap-16 py-20">
        <div className="flex-1">
          <h1 className="text-5xl font-black leading-tight">
            Take your{" "}
            <span className="bg-blue-200 rounded-sm py-1 px-3">learning</span>{" "}
            <br />
            to new dimensions
          </h1>
          <p className="text-muted-foreground text-xl tracking-widest mt-8">
            Craving knowledge that ignites your curiosity? "Matrahin" fuels your
            mind with hyper-realistic simulations. Master complex concepts,
            solve real-world problems, and prepare for a future beyond limits.
            Learn by doing, experience by exploring.
          </p>

          <div className="flex items-center mt-8 gap-4">
            <Link
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-xl flex-1 md:flex-none"
              )}
              href="/login"
            >
              Get started
            </Link>
          </div>
        </div>
        <MathElements className="flex-1 scale-125 -z-10" />
      </div>
    </section>
  );
}
