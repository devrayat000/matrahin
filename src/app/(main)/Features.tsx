import Pillars from "~/assets/pillars.svg";
import CartoonCalc from "~/assets/calc_cartoon.svg";
import Simulation from "~/assets/simulation.svg";
import { cn } from "~/lib/utils";

const features = [
  {
    name: "Calculators",
    description:
      "Unlock the power of mathematical problem-solving with Matrahin's advanced calculators. Our versatile calculator tool goes beyond basic arithmetic, offering solutions for a wide array of mathematical problems based on user input. Whether you're tackling problems on projectile motion, Pendulum motion, or complex electric circuit, Matrahin's calculator ensures accurate step by step and efficient results. Simplify your problem solving journey with a user-friendly interface and robust functionality, making complex calculations a breeze. Matrahin's calculator is your go-to companion for conquering mathematical challenges with ease.",
    image: CartoonCalc,
  },
  {
    name: "Interactive simulations on different topics based on user input",
    description:
      "Immerse yourself in the world of physics with Matrahin's cutting-edge simulations. Our innovative platform offers a diverse range of interactive physics simulations, providing users with a hands-on and engaging learning experience. From projectile motion to river-boat math or 2D motion, Matrahin's simulations empower students to visualize and understand complex concepts in ways traditional teaching methods cannot match. Explore, experiment, and deepen your understanding of the physical world through our dynamic and immersive simulations.",
    image: Simulation,
  },
  {
    name: "Theory Explanation and Examples",
    description:
      "Never seen before explanation videos on different topics and Compilation of best theory and every possible examples.",
    image: Pillars,
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
                  <dt className="text-2xl font-semibold leading-7 capitalize text-gray-900">
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
