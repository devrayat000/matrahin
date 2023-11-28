import { HashRouter, Route, Routes } from "react-router-dom";

import BoatRiverPage from "./pages/boatRiver/page";
import HomePage from "./pages/page";
import ProjectilePage from "./pages/projectile/page";
import RainManPage from "./pages/rain/page";
import VectorPage from "./pages/vector/page";
import DynamicsPage from "./pages/motion/page";
import ElectricForcePage from "./pages/electric-force/page";

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
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
