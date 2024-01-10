import Calculator2 from "~/assets/calc_2.svg";

export default function About() {
  return (
    <div className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 flex gap-16">
        <Calculator2 className="max-w-xs lg:max-w-sm" />
        <div className="flex-1 text-center md:text-left">
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            What's this all about?
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Quis tellus eget adipiscing convallis sit sit eget aliquet quis.
            Suspendisse eget egestas a elementum pulvinar et feugiat blandit at.
            In mi viverra elit nunc.
          </p>
        </div>
      </div>
    </div>
  );
}
