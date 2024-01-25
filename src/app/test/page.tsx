import Animation from "./Animation";
import Input from "./Input";
import Result from "./Result";

const page = () => {
  return (
    <>
      <h1 className="text-center text-4xl py-3 text-primary font-bold leading-8 text-gray-900 ">
        Rain Umbrella Problem
      </h1>

      <div className="m-auto flex flex-col lg:mx-3 lg:flex-row items-center gap-1 lg:gap-8 justify-center">
        <Animation />

        <div className=" self-start my-4">
          <Input />
          <Result />
        </div>
      </div>
    </>
  );
};

export default page;
