import OptionsCard from "~/components/project/moment_of_inertia/OptionsCard";
import constants from "~/components/project/moment_of_inertia/schema";
const Moment_of_inertia = () => {
  return (
    <>
      <h1 className="text-center text-4xl py-3 text-primary font-bold leading-8 text-gray-900 ">
        Moment of Inertia
      </h1>
      <p className="max-w-3xl  mx-auto text-center text-base leading-6 text-gray-500 p-2">
        The moment of inertia of a rigid body about a given axis describes how
        difficult it is to change its angular motion about that axis. The SI
        unit of moment of inertia is the kilogram square metre (kg⋅m2).
      </p>
      {/* <div className="flex flex-col sm:flex-row m-2 mx-10 gap-6 items-center justify-center">
        {constants.map((option, index) => (
          <OptionsCard
            key={index}
            image={option.image}
            imageAlt={option.title}
            name={option.title}
            path={option.path}
          />
        ))}
      </div> */}
      <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg: px-40 m-2 mx-10">
        {constants.map((option, index) => (
          <OptionsCard
            key={index}
            image={option.image}
            imageAlt={option.title}
            name={option.title}
            path={option.path}
          />
        ))}
      </div>
    </>
  );
};

export default Moment_of_inertia;
