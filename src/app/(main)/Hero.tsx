import Link from "next/link";
import MathElements from "~/assets/math_elements.svg";
import { buttonVariants } from "~/components/ui/button";

export default function Hero() {
  return (
    <section id="hero" className="container py-12 sm:py-16">
      <div className="flex justify-between gap-16 py-20">
        <div className="flex-1">
          <h1 className="text-6xl font-black leading-tight">
            Take your{" "}
            <span className="bg-blue-200 rounded-sm py-1 px-3 selection:bg-yellow-200">
              learning
            </span>{" "}
            <br />
            to new dimensions
          </h1>
          <p className="text-muted-foreground text-xl tracking-wide mt-8 mr-6">
            Craving knowledge that ignites your curiosity? "Matrahin" fuels your
            mind with hyper-realistic simulations. Master complex concepts,
            solve real-world problems, and prepare for a future beyond limits.
            Learn by doing, experience by exploring.
          </p>

          <div className="flex items-center mt-8 gap-4">
            <Link
              className={buttonVariants({
                size: "lg",
                className: "rounded-xl flex-1 md:flex-none text-xl py-7 px-12",
              })}
              href="/login"
            >
              Get started &rarr;
            </Link>
          </div>
        </div>
        <MathElements className="flex-1 scale-125 -z-10" />
      </div>
    </section>
  );
}
