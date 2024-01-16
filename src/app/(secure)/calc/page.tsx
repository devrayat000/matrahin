import Link from "next/link";
import Image, { type StaticImageData } from "next/image";
import type { Url } from "next/dist/shared/lib/router/router";

import projectile from "~/assets/cards/projectile.png";
import rain from "~/assets/cards/rain.jpg";
import vector from "~/assets/cards/vector.jpg";
import boat from "~/assets/cards/boat.jpg";
import dynamics from "~/assets/cards/dynamics.webp";
import electric from "~/assets/cards/electric.png";
import pendulum from "~/assets/cards/pendulum_card.jpg";
import inertia from "~/assets/cards/inertia.jpg";
import { buttonVariants } from "~/components/ui/button";

const cards = [
  { to: "projectile", img: projectile, title: "Projectile" },
  { to: "rain", img: rain, title: "Rain" },
  { to: "vector", img: vector, title: "Vector" },
  { to: "boat-river", img: boat, title: "Boat River" },
  { to: "dynamics", img: dynamics, title: "Dynamics" },
  { to: "electric-force", img: electric, title: "Electric Force" },
  { to: "pendulum", img: pendulum, title: "Pendulum" },
  { to: "moi", img: inertia, title: "Moment of Inertia" },
];

export default function HomePage() {
  return (
    <main>
      <section className="mt-6 sm:mx-20 p-3">
        <h1 className="text-center text-2xl sm:text-3xl font-bold">
          Tools Available at Matrahin
        </h1>
        <p className="text-center text-sm sm:text-base text-muted-foreground">
          Unleash the power of problem-solving and delve into the wonders of
          physics with Matrahin. Our versatile tools go beyond basic arithmetic
          and rote learning, offering user-friendly, interactive experiences
          that cater to diverse needs. Tackle complex mathematical challenges
          with our advanced calculators, featuring step-by-step solutions for
          everything from projectile motion to electric circuits. For a more
          immersive learning journey, explore our cutting-edge physics
          simulations, where you can experiment with concepts like projectile
          motion,river-boat math and 2D motion in ways traditional methods
          cannot replicate. Simplify your problem-solving journey, visualize
          complex concepts, and deepen your understanding of the physical world
          – all with Matrahin, your one-stop shop for conquering mathematical
          and scientific challenges with ease.
        </p>

        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 place-items-center gap-x-6 gap-y-10">
          {cards.map((card) => (
            <ProjectCard key={card.title} {...card} />
          ))}
        </div>
      </section>
    </main>
  );
}

interface ProjectCardProps {
  to: Url;
  img: StaticImageData;
  title: string;
}

function ProjectCard(props: ProjectCardProps) {
  return (
    <div className="card rounded-md shadow-md hover:shadow-lg transition ease-in-out overflow-hidden">
      <Image
        {...props.img}
        width={320}
        alt="projectile"
        className="aspect-video object-fill"
      />
      <div className="p-2">
        <h6 className="text-xl font-semibold text-center mt-2 group-hover:underline">
          {props.title}
        </h6>
        <div className="flex flex-col gap-y-1 mt-3">
          <Link
            href={`/calc/${props.to}`}
            className={buttonVariants({ size: "sm", variant: "outline" })}
          >
            Calculator and Simulation
          </Link>
          <Link
            href={`/calc/${props.to}/examples`}
            className={buttonVariants({ size: "sm", variant: "outline" })}
          >
            Theory and Examples
          </Link>
        </div>
      </div>
    </div>
  );
}
