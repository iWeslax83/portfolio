import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0c0c0c",
        "text-primary": "#e2e2e2",
        "text-secondary": "#a0a0a0",
        "text-muted": "#555555",
        accent: "#d4a373",
        "card-bg": "rgba(255,255,255,0.02)",
        "card-border": "rgba(255,255,255,0.06)",
        "card-border-hover": "rgba(212,163,115,0.3)",
      },
      fontFamily: {
        mono: ["JetBrains Mono", "monospace"],
        sans: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
