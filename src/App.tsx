import { HashRouter, Route, Routes } from "react-router-dom";

import MOI_Basic from "./components/project/moment_of_inertia/MOI_Basic";
import MOI_Cases from "./components/project/moment_of_inertia/MOI_Cases";
import MOI_DifferentAxes from "./components/project/moment_of_inertia/MOI_DifferentAxes";
import BoatRiverPage from "./pages/boatRiver/page";
import ElectricForcePage from "./pages/electric-force/page";
import Moment_of_inertia from "./pages/moment_of_inertia/page";
import DynamicsPage from "./pages/motion/page";
import HomePage from "./pages/page";
import PendulumPage from "./pages/pendulum/page";
import ProjectilePage from "./pages/projectile/page";
import RainManPage from "./pages/rain/page";
import VectorPage from "./pages/vector/page";
import { ShapesOfInertia } from "./services/Moment_of_inertia";

function App() {
  return (
    <HashRouter future={{ v7_startTransition: true }}>
      <Routes>
        <Route path="/">
          <Route index element={<HomePage />} />
          <Route path="projectile" element={<ProjectilePage />} />
          <Route path="rain" element={<RainManPage />} />
          <Route path="vector" element={<VectorPage />} />
          <Route path="boat-river" element={<BoatRiverPage />} />
          <Route path="dynamics" element={<DynamicsPage />} />
          <Route path="electric-force" element={<ElectricForcePage />} />
          <Route path="pendulum" element={<PendulumPage />} />
          <Route path="moment-of-inertia">
            <Route index element={<Moment_of_inertia />} />
            <Route
              path="point_mass"
              element={<MOI_Basic shape={ShapesOfInertia.PointMass} />}
            />
            <Route
              path="two_point_mass"
              element={<MOI_Basic shape={ShapesOfInertia.TwoMass} />}
            />
            <Route
              path="rod"
              element={<MOI_DifferentAxes shape={ShapesOfInertia.Rod} />}
            />
            <Route
              path="rectangular_plate"
              element={<MOI_DifferentAxes shape={ShapesOfInertia.Plate} />}
            />
            <Route
              path="solid_cuboid"
              element={<MOI_DifferentAxes shape={ShapesOfInertia.Cuboid} />}
            />
            <Route
              path="cylinder"
              element={<MOI_Cases shape={ShapesOfInertia.Cylinder} />}
            />

            <Route
              path="sphere"
              element={<MOI_Cases shape={ShapesOfInertia.Sphere} />}
            />
            <Route
              path="disk"
              element={<MOI_Cases shape={ShapesOfInertia.Disk} />}
            />
          </Route>
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
