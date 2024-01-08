import MOI_Basic from "~/components/project/moment_of_inertia/MOI_Basic";

import { ShapesOfInertia } from "~/services/Moment_of_inertia";
import TwoPointMassAnimation from "./TwoPointMassAnimation";

const Sphere = () => {
  return (
    <div className=" mt-2 flex w-full flex-col  items-center justify-center lg:flex-row">
      <TwoPointMassAnimation />
      <MOI_Basic shape={ShapesOfInertia.TwoMass} />
    </div>
  );
};
export default Sphere;
