import { Variants } from "framer-motion";

export const textAppear = {
  initial: {
    opacity: 0.5,
    y: 4,
    transition: { duration: 0.3 },
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
} as Variants;
