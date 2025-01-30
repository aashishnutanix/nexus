export function Logo({
  size = "default",
}: {
  size?: "default" | "small" | "large";
}) {
  const sizes = {
    small: {
      text: "text-2xl",
      x: "text-3xl",
    },
    default: {
      text: "text-4xl",
      x: "text-5xl",
    },
    large: {
      text: "text-5xl",
      x: "text-6xl",
    },
  };

  const isCompact = size === "small";

  return (
    <h1 className={`font-bold tracking-tighter ${sizes[size].text}`}>
      {!isCompact && "NE"}
      <span className={`relative ${sizes[size].x}`}>
        <span
          className="relative bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text"
          style={{ top: isCompact ? "0px" : "4px" }}
        >
          X
        </span>
        <span
          className="absolute left-0 w-full h-0.5 bg-primary/50 rounded-full"
          style={{ bottom: isCompact ? "0px" : "4px" }}
        ></span>
      </span>
      {!isCompact && "US"}
    </h1>
  );
}

import { motion } from "framer-motion";

export function LogoMotion({
  size = "default",
}: {
  size?: "default" | "small" | "large";
}) {
  const sizes = {
    small: {
      text: "text-2xl",
      x: "text-3xl",
    },
    default: {
      text: "text-4xl",
      x: "text-5xl",
    },
    large: {
      text: "text-5xl",
      x: "text-6xl",
    },
  };

  return (
    <motion.h1
      className={`font-bold tracking-tighter flex items-center justify-center ${sizes[size].text}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.span
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        NE
      </motion.span>
      <motion.span
        className={`relative ${sizes[size].x} mx-1`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <span
          className="relative bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text"
          style={{ top: "0px" }}
        >
          X
        </span>
        <motion.span
          className="absolute left-0 w-full h-0.5 bg-primary/50 rounded-full"
          style={{ bottom: "0px" }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        ></motion.span>
      </motion.span>
      <motion.span
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        US
      </motion.span>
    </motion.h1>
  );
}
