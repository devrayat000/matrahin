import { HashRouter, Route, Routes } from "react-router-dom";

import ProjectilePage from "./pages/projectile/page";
import RainManPage from "./pages/rain/page";
import VectorPage from "./pages/vector/page";
import HomePage from "./pages/page";

function App() {
  return (
    <HashRouter future={{ v7_startTransition: true }}>
      <Routes>
        <Route path="/">
          <Route index element={<HomePage />} />
          <Route path="projectile" element={<ProjectilePage />} />
          <Route path="rain" element={<RainManPage />} />
          <Route path="vector" element={<VectorPage />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
