import { useProgress } from "@react-three/drei";
import { motion } from "framer-motion";

export default function Loader() {
  const { progress } = useProgress();

  return (
    <div className="flex justify-center items-center h-full">
      <motion.div
        initial={{ opacity: 0.5, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 2.5 }} // Specify exit animation here
        transition={{ duration: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold">Loading...</h2>
        <div className="w-48 h-4 bg-gray-200 rounded-md overflow-hidden">
          <motion.div
            className="h-full bg-blue-500"
            style={{ width: `${progress}%` }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          ></motion.div>
        </div>
        <p className="text-lg mt-2">{progress}% loaded</p>
      </motion.div>
    </div>
  );
}
