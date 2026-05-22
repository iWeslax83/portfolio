"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * Hero "mission control" console - a decorative engineering panel that fills the
 * right side of the hero on large screens. Lines boot in on mount; a live UTC
 * clock and an ambient signal equalizer keep it alive. Content is truthful
 * (real capabilities), not fabricated metrics.
 */
const lines = [
  { t: "$ systemctl status mission", muted: true },
  { t: "flight-controller", ok: true },
  { t: "sensor-fusion", ok: true },
  { t: "target-detection", ok: true },
  { t: "autonomous-nav", ok: true },
  { t: "web-services · k8s", ok: true },
  { t: "ci/cd pipeline", ok: true },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.5 } },
};
const line = {
  hidden: { opacity: 0, x: 12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, stiffness: 220, damping: 22 },
  },
};

function Clock() {
  const [now, setNow] = useState("--:--:--");
  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString("en-GB", { timeZone: "UTC", hour12: false });
    setNow(fmt());
    const id = setInterval(() => setNow(fmt()), 1000);
    return () => clearInterval(id);
  }, []);
  return <span>{now} UTC</span>;
}

export default function HeroConsole() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotateY: 6 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ type: "spring", stiffness: 90, damping: 18, delay: 0.35 }}
      style={{ transformPerspective: 1000 }}
      className="rounded-2xl border border-card-border bg-panel/80 backdrop-blur-sm shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)] overflow-hidden"
    >
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-card-border bg-panel-2/60">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]/70" />
        <span className="ml-2 font-mono text-[11px] text-text-muted">
          stratos://mission-control
        </span>
      </div>

      {/* Boot log */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="px-5 py-5 font-mono text-[12.5px] leading-relaxed space-y-1.5"
      >
        {lines.map((l) => (
          <motion.div key={l.t} variants={line} className="flex items-center gap-2">
            {l.ok && <span className="text-accent">[ OK ]</span>}
            <span className={l.muted ? "text-text-secondary" : "text-text-primary"}>
              {l.t}
            </span>
          </motion.div>
        ))}

        <motion.div variants={line} className="flex items-center gap-2 pt-2">
          <span className="h-2 w-2 rounded-full bg-accent animate-blink" />
          <span className="text-text-secondary">all systems nominal</span>
        </motion.div>
      </motion.div>

      {/* Telemetry footer */}
      <div className="flex items-center justify-between px-5 py-3.5 border-t border-card-border bg-panel-2/40">
        <div className="flex items-end gap-[3px] h-6">
          {[0.35, 0.7, 0.45, 0.9, 0.6, 0.8, 0.5].map((base, i) => (
            <motion.span
              key={i}
              className="w-[3px] rounded-full bg-accent/70"
              style={{ originY: 1 }}
              animate={{ scaleY: [base, base * 1.8, base * 0.6, base] }}
              transition={{
                duration: 1.6 + i * 0.18,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              initial={{ height: "100%", scaleY: base }}
            />
          ))}
        </div>
        <span className="font-mono text-[11px] text-text-muted">
          <Clock />
        </span>
      </div>
    </motion.div>
  );
}
