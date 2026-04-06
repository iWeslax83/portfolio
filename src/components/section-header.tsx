"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion";

export default function SectionHeader({
  prompt,
  title,
}: {
  prompt: string;
  title: string;
}) {
  return (
    <motion.div
      className="mb-8"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeInUp}
    >
      <p className="font-mono text-xs text-text-muted mb-1.5">
        <span className="text-accent">$</span> {prompt.replace("$ ", "")}
      </p>
      <h2 className="font-mono text-2xl font-bold text-text-primary tracking-tight">
        {title}
      </h2>
    </motion.div>
  );
}
