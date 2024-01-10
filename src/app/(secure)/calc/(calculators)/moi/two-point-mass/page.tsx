import MOI_Basic from "~/components/project/moment_of_inertia/MOI_Basic";

import { ShapesOfInertia } from "~/services/Moment_of_inertia";
import Animation from "./Animation";

const Sphere = () => {
  return (
    <div className=" mt-2 flex md:gap-4 w-full flex-col  items-center justify-center lg:flex-row">
      <Animation />
      <MOI_Basic shape={ShapesOfInertia.TwoMass} />
    </div>
  );
};
export default Sphere;
