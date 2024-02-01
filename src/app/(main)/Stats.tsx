import { use } from "react";
import { cn } from "~/lib/utils";
import { getCounts } from "~/services/graphql/stat";

const gridCols = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
};

export default function Stats() {
  const { students, examples, calculators } = use(getCounts());

  const stats = [
    { id: 1, name: "Students", value: students },
    { id: 2, name: "Simulators", value: calculators },
    { id: 3, name: "Examples", value: examples },
  ];

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <dl
          className={cn("mt-16 grid grid-cols-1 gap-1", gridCols[stats.length])}
        >
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="flex flex-col gap-y-4 first:rounded-t-xl md:first:rounded-t-none md:first:rounded-l-xl last:rounded-b-xl md:last:rounded-b-none md:last:rounded-r-xl bg-gray-50 px-8 py-6 md:py-12"
            >
              <dt className="text-sm md:text-base leading-7 text-gray-600 text-center">
                {stat.name}
              </dt>
              <dd className="order-first text-2xl md:text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl text-center">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
