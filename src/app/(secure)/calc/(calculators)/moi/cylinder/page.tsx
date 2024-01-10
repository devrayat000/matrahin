import MOI_Cases from "~/components/project/moment_of_inertia/MOI_Cases";
import { ShapesOfInertia } from "~/services/Moment_of_inertia";
import CylinderAnimation from "./Animation";

const Sphere = () => {
  return (
    <div className=" mt-2 flex w-full flex-col  items-center justify-center lg:flex-row">
      <CylinderAnimation />
      <MOI_Cases shape={ShapesOfInertia.Cylinder} />
    </div>
  );
};
export default Sphere;
