"use client";
import VectorField from "./vectorField";

const page = () => {
  return (
    <div>
      <h1 className="text-4xl text-center">Vector Field</h1>
      <div className="text-center text-2xl">
        {/* <MathJax inline hideUntilTypeset={"first"}>
          {`\\(\\vec{V}(x,y,z) = y\\space\\hat{i} -x\\space\\hat{j} +z\\space \\hat{k} \\)`}
        </MathJax> */}
        <p>y i +x j + z k</p>
      </div>
      {/* <div className=" w-full flex flex-row justify-center items-center"> */}
      <main className="h-[95vh] w-[75vw] m-auto bg-[#282c34]">
        <VectorField />
      </main>
    </div>
  );
};

export default page;
