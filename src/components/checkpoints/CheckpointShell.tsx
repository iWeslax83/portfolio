"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export default function CheckpointShell({
  visible,
  mode,
  fullBleed = false,
  children,
}: {
  visible: boolean;
  mode: "scene" | "flat";
  fullBleed?: boolean;
  children: ReactNode;
}) {
  if (mode === "flat") {
    return (
      <div className="relative z-10 py-24 md:py-36 px-6 md:px-10 lg:px-14 max-w-[1320px] mx-auto">
        {children}
      </div>
    );
  }

  if (fullBleed) {
    return (
      <motion.div
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        inert={!visible}
        className="fixed inset-0 z-10 overflow-hidden"
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      inert={!visible}
      className="fixed inset-0 z-10 flex items-center px-6 md:px-10 lg:px-14"
    >
      <div className="max-w-[1320px] mx-auto w-full max-h-[85vh] overflow-hidden py-4">{children}</div>
    </motion.div>
  );
}
