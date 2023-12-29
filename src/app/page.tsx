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
      <section className="mt-6 mx-20 p-3">
        <h1 className="text-center text-3xl font-bold">Physics Calculator</h1>

        <div className="mt-10 grid grid-cols-3 gap-x-6 gap-y-10">
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
    <Link href={props.to} className="group">
      <figure>
        <Image
          {...props.img}
          alt="projectile"
          className="aspect-video object-fill rounded-md shadow-md hover:shadow-lg transition ease-in-out"
        />
        <figcaption className="text-xl font-semibold text-center mt-2 group-hover:underline">
          {props.title}
        </figcaption>
      </figure>
    </Link>
  );
}
