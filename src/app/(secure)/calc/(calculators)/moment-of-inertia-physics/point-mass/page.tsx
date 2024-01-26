import MOI_Basic from "~/components/project/moment_of_inertia/MOI_Basic";

import { ShapesOfInertia } from "~/services/Moment_of_inertia";
import PointMassAnimation from "./PointMassAnimWithFiber";

const Sphere = () => {
  return (
    <div className=" mt-2 flex w-full flex-col gap-4 items-center justify-center lg:flex-row">
      <PointMassAnimation />
      <MOI_Basic shape={ShapesOfInertia.PointMass} />
    </div>
  );
};
export default Sphere;
