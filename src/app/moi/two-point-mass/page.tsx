import MOI_Basic from "~/components/project/moment_of_inertia/MOI_Basic";
import { ShapesOfInertia } from "~/services/Moment_of_inertia";

export default () => <MOI_Basic shape={ShapesOfInertia.TwoMass} />;
