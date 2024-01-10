import MOI_DifferentAxes from "~/components/project/moment_of_inertia/MOI_DifferentAxes";
import { ShapesOfInertia } from "~/services/Moment_of_inertia";
import PlateAnimation from "./Animation";

const Sphere = () => {
  return (
    <div className=" mt-2 flex w-full flex-col  items-center justify-center lg:flex-row">
      <PlateAnimation />
      <MOI_DifferentAxes shape={ShapesOfInertia.Plate} />
    </div>
  );
};
export default Sphere;
