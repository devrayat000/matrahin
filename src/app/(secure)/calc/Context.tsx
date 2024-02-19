"use client";

import { MathJaxContext } from "better-react-mathjax";
import { AnimatePresence } from "framer-motion";
import { Children } from "react";

const config = {
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

export default function CalcContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const child = Children.only(children);

  return (
    <MathJaxContext version={3} config={config}>
      <AnimatePresence mode="sync">{child}</AnimatePresence>
    </MathJaxContext>
  );
}
