"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { maskWipe, viewportOnce } from "@/lib/motion";

/**
 * Section header that types its `$ command` like a live terminal when scrolled
 * into view, then wipes the title in. The signature dev-identity motif.
 */
export default function SectionMarker({
  command,
  title,
  index,
}: {
  command: string;
  title: string;
  index?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, viewportOnce);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(command.slice(0, i));
      if (i >= command.length) clearInterval(id);
    }, 28);
    return () => clearInterval(id);
  }, [inView, command]);

  return (
    <div ref={ref} className="mb-10">
      <p className="font-mono text-xs text-text-muted mb-3 flex items-center">
        {index && <span className="text-accent/40 mr-2">{index}</span>}
        <span className="text-accent mr-1.5">$</span>
        <span>{typed}</span>
        <span className="ml-0.5 inline-block w-[7px] h-[1em] translate-y-[1px] bg-accent animate-blink" />
      </p>
      <motion.h2
        variants={maskWipe}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        className="font-display text-3xl md:text-4xl font-semibold text-text-primary tracking-tight"
      >
        {title}
      </motion.h2>
    </div>
  );
}
