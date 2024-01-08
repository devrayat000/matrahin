import { cn } from "~/lib/utils";

const stats = [
  { id: 1, name: "Transactions every 24 hours", value: "44 million" },
  { id: 2, name: "Assets under holding", value: "$119 trillion" },
  { id: 3, name: "New users annually", value: "46,000" },
];

const gridCols = {
  1: "md:grid-cols-1",
  2: "md:grid-cols-2",
  3: "md:grid-cols-3",
  4: "md:grid-cols-4",
};

export default function Stats() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight text-center">
            Trusted by creators worldwide
          </h2>
          <p className="text-base md:text-lg text-muted-foreground mt-3 text-center">
            Lorem ipsum dolor sit amet consect adipisicing possimus.
          </p>
        </div>
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
