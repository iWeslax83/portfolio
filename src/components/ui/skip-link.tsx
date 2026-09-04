"use client";

import { scrollToSection } from "@/lib/scroll-to-section";

export default function SkipLink() {
  return (
    <a
      href="#home"
      className="skip-link"
      onClick={(e) => {
        e.preventDefault();
        scrollToSection("home");
      }}
    >
      skip to content
    </a>
  );
}
