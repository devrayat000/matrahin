import MOI_Cases from "~/components/project/moment_of_inertia/MOI_Cases";
import { ShapesOfInertia } from "~/services/Moment_of_inertia";
import DiskAnimation from "./DiskAnimation";

const Sphere = () => {
  return (
    <div className=" mt-2 flex w-full flex-col  items-center justify-center lg:flex-row">
      <DiskAnimation />
      <MOI_Cases shape={ShapesOfInertia.Disk} />
    </div>
  );
};
export default Sphere;
