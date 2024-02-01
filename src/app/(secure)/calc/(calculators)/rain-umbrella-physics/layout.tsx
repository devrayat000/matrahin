import { Suspense } from "react";
import Animation from "~/components/project/rain_animated/Animation";

const page = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <h1 className="text-center text-4xl py-3 text-primary font-bold leading-8 text-gray-900 ">
        Rain Umbrella Problem
      </h1>

      {/* <div className="m-auto flex flex-col  lg:flex-row items-center lg:items-start gap-0 lg:gap-4 justify-center"> */}
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-4">
        <Suspense>
          <Animation />
        </Suspense>

        <div className=" self-start lg:my-3">{children}</div>
      </div>
    </>
  );
};

export default page;
