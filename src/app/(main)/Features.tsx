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
      "Dust off your curiosity, not your textbooks! Dive into physics like never before with our website, where captivating teachers explode dry lectures with interactive lessons. Experience forces, motion, and energy like they're tangible through mind-blowing simulations. Plus, dive deeper! Find all examples for each topic neatly organized on one page. Contribute the missing gems! Share your own problems and help curate our library. This isn't just a physics website, it's a revolution! Join the excitement and uncover the universe, one click at a time.",
    image: Pillars,
  },
];

const textDir = {
  0: "md:text-left",
  1: "md:text-right",
};

const floatDir = {
  0: "sm:float-left sm:mr-6",
  1: "sm:float-right sm:ml-6",
};

export default function Features() {
  return (
    <section id="features" className="bg-white py-12 sm:py-16 container">
      <div className="px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to crack the exam
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Unleash your inner explorer - dive into our world of cutting-edge
            features
          </p>
        </div>
        <div className="mx-auto mt-16 sm:mt-20 lg:mt-24">
          <dl className="flex flex-col gap-y-12 lg:gap-y-24">
            {features.map((feature, i) => (
              <div
                key={feature.name}
                className="flex flex-col sm:block text-justify"
              >
                <feature.image
                  aria-hidden="true"
                  className={cn(
                    "h-64 lg:h-80 w-auto rounded-lg mb-8",
                    floatDir[i % 2]
                  )}
                />
                <div className={cn("flex-1", textDir[i % 2])}>
                  <dt className="text-lg sm:text-xl md:text-2xl font-semibold leading-7 capitalize text-gray-900">
                    {feature.name}
                  </dt>
                  <dd className="mt-2 text-base md:leading-7 text-gray-600">
                    {feature.description}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
