import Animation from "./Animation";
import TabSelect from "./TabSelect";

const page = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <h1 className="text-center text-4xl py-3 text-primary font-bold leading-8 text-gray-900 ">
        Rain Umbrella Problem
      </h1>

      <div className="m-auto flex flex-col lg:mx-3 lg:flex-row items-center gap-0 lg:gap-8 justify-center">
        <Animation />

        <div className=" self-start lg:my-4">
          <TabSelect />
          {children}
        </div>
      </div>
    </>
  );
};

export default page;
