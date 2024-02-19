"use client";

import { type HTMLMotionProps, motion } from "framer-motion";
import { fade } from "./page-transition";

export default function Animated(props: HTMLMotionProps<"main">) {
  return (
    <motion.main
      variants={fade}
      initial="initial"
      animate="animate"
      exit="initial"
      {...props}
    />
  );
}
