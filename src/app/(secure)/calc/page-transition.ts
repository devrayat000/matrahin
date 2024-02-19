import { type Variants } from "framer-motion";

export const fade = {
  initial: {
    opacity: 0.6,
    scale: 0.95,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
    },
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
    },
  },
} satisfies Variants;
