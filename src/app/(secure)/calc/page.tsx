import Link from "next/link";
import { use } from "react";
import Image from "next/image";
import type { Url } from "next/dist/shared/lib/router/router";

import { buttonVariants } from "~/components/ui/button";
import { getCalculators } from "~/services/graphql/calc";
import { CardBody, CardContainer, CardItem } from "~/components/ui/3d-card";
import Animated from "./Animated";

export default function HomePage() {
  const imageSize = {
    width: 420,
    get height() {
      return Math.round((this.width / 16) * 9);
    },
  };
  const { products: cards } = use(getCalculators(imageSize));

  return (
    <Animated>
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
            <ProjectCard key={card.id} {...card} />
          ))}
        </div>
      </section>
    </Animated>
  );
}

interface ProjectCardProps {
  to: Url;
  img: { src: string };
  title: string;
}

function ProjectCard(props: ProjectCardProps) {
  return (
    <CardContainer className="inter-var">
      <CardBody className="group/card border-black/[0.1] h-auto rounded-xl p-4 border">
        <CardItem translateZ="100">
          <Image
            {...props.img}
            width={420}
            alt="projectile"
            className="aspect-video object-fill rounded-xl group-hover/card:shadow-xl border-2 border-muted"
          />
        </CardItem>
        <div className="mt-2 [transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d]">
          <CardItem
            translateZ={70}
            className="text-xl font-semibold text-center group-hover:underline"
            asChild
          >
            <h6 className="w-full">{props.title}</h6>
          </CardItem>
          <div className="flex flex-col items-stretch gap-y-1 mt-3 [transform-style:preserve-3d] [&>*]:[transform-style:preserve-3d]">
            <CardItem
              asChild
              className={buttonVariants({
                size: "sm",
                variant: "outline",
                className: "w-full group-hover/card:shadow-sm transition",
              })}
              translateZ={35}
              translateY={-4}
              rotateZ={-2}
            >
              <Link href={`/calc/${props.to}`}>Calculator and Simulation</Link>
            </CardItem>
            <CardItem
              asChild
              className={buttonVariants({
                size: "sm",
                variant: "outline",
                className: "w-full group-hover/card:shadow-sm  transition",
              })}
              translateZ={25}
              rotateZ={1}
            >
              <Link href={`/calc/${props.to}/examples`}>
                Theory and Examples
              </Link>
            </CardItem>
          </div>
        </div>
      </CardBody>
    </CardContainer>
  );

  return (
    <div className="card rounded-md shadow-md hover:shadow-lg transition ease-in-out overflow-hidden">
      <Image
        {...props.img}
        width={420}
        alt="projectile"
        className="aspect-video object-fill rounded-xl group-hover/card:shadow-xl border-2 border-muted"
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
