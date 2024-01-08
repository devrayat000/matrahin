import MathElements from "~/assets/math_elements.svg";
import { Button } from "~/components/ui/button";

const dataUrl =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDMzZmYiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaGVjay1jaXJjbGUtMiI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiLz48cGF0aCBkPSJtOSAxMiAyIDIgNC00Ii8+PC9zdmc+";

export default function Hero() {
  return (
    <section id="hero" className="container">
      <div className="flex justify-between gap-16 py-20">
        <div className="flex-1">
          <h1 className="text-5xl font-black leading-tight">
            A <span className="bg-blue-200 rounded-sm py-1 px-3">modern</span>{" "}
            React <br /> components library
          </h1>
          <p className="text-muted-foreground text-lg mt-8">
            Build fully functional accessible web applications faster than ever
            – Mantine includes more than 120 customizable components and hooks
            to cover you in any situation
          </p>

          <ul
            className="mt-8 space-y-4 text-muted-foreground text-lg pl-8"
            style={{
              listStyleImage: `url(${dataUrl})`,
              listStylePosition: "inside",
            }}
          >
            <li>
              <b>TypeScript based</b> – build type safe applications, all
              components and hooks export types
            </li>
            <li>
              <b>Free and open source</b> – all packages have MIT license, you
              can use Mantine in any project
            </li>
            <li>
              <b>No annoying focus ring</b> – focus ring will appear only when
              user navigates with keyboard
            </li>
          </ul>

          <div className="flex items-center mt-8 gap-4">
            <Button className="rounded-xl flex-1 md:flex-none" size="lg">
              Get started
            </Button>
            <Button
              className="rounded-xl flex-1 md:flex-none"
              size="lg"
              variant="outline"
            >
              Pricing
            </Button>
          </div>
        </div>
        <MathElements className="flex-1 scale-125 -z-10" />
      </div>
    </section>
  );
}
