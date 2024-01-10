import MOI_Cases from "~/components/project/moment_of_inertia/MOI_Cases";
import { ShapesOfInertia } from "~/services/Moment_of_inertia";
import Animation from "./Animation";

const Sphere = () => {
  return (
    <div className=" mt-2 flex w-full flex-col  items-center justify-center lg:flex-row">
      <Animation />
      <MOI_Cases shape={ShapesOfInertia.Sphere} />
    </div>
  );
};
export default Sphere;
