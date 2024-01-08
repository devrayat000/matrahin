import Pillars from "~/assets/pillars.svg";
import CartoonCalc from "~/assets/calc_cartoon.svg";
import Simulation from "~/assets/simulation.svg";
import { cn } from "~/lib/utils";

const features = [
  {
    name: "Things We Offer",
    description:
      "Morbi viverra dui mi arcu sed. Tellus semper adipiscing suspendisse semper morbi. Odio urna massa nunc massa.",
    image: Pillars,
  },
  {
    name: "Intuitive Scientific Calculators",
    description:
      "Sit quis amet rutrum tellus ullamcorper ultricies libero dolor eget. Sem sodales gravida quam turpis enim lacus amet.",
    image: CartoonCalc,
  },
  {
    name: "Realtime Simulations",
    description:
      "Quisque est vel vulputate cursus. Risus proin diam nunc commodo. Lobortis auctor congue commodo diam neque.",
    image: Simulation,
  },
];

const flexDir = {
  0: "flex-row",
  1: "flex-row-reverse",
};

const textDir = {
  0: "text-left",
  1: "text-right",
};

export default function Features() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to crack the exam
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Quis tellus eget adipiscing convallis sit sit eget aliquet quis.
            Suspendisse eget egestas a elementum pulvinar et feugiat blandit at.
            In mi viverra elit nunc.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="flex flex-col gap-y-10 lg:gap-y-16">
            {features.map((feature, i) => (
              <div
                key={feature.name}
                className={cn("flex gap-x-10", flexDir[i % 2])}
              >
                <feature.image
                  aria-hidden="true"
                  className="h-40 w-auto rounded-lg"
                />
                <div className={cn("flex-1", textDir[i % 2])}>
                  <dt className="text-2xl font-semibold leading-7 text-gray-900">
                    {feature.name}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    {feature.description}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
