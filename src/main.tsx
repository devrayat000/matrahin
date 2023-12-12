import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "~/lib/globals.ts";

import { MathJaxContext } from "better-react-mathjax";
export const config = {
  loader: { load: ["[tex]/html"] },
  tex: {
    packages: { "[+]": ["html"] },
    inlineMath: [
      ["$", "$"],
      ["\\(", "\\)"],
    ],
    displayMath: [
      ["$$", "$$"],
      ["\\[", "\\]"],
    ],
  },
};
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MathJaxContext version={3} config={config}>
      <App />
    </MathJaxContext>
  </React.StrictMode>
);
