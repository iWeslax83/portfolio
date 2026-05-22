"use client";

import { useRef, ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";

/**
 * Card that tilts in 3D toward the cursor and lifts slightly on hover.
 * Accepts a reveal `variants` prop so it can still participate in a parent's
 * staggered scroll choreography.
 */
export default function TiltCard({
  children,
  className,
  variants,
  max = 7,
}: {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), {
    stiffness: 200,
    damping: 18,
  });
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), {
    stiffness: 200,
    damping: 18,
  });

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };

  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      variants={variants}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      whileHover={{ y: -4 }}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className={`[transform-style:preserve-3d] ${className ?? ""}`}
    >
      {children}
    </motion.div>
  );
}
