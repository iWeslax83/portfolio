/**
 * Page wrapper. The terminal world runs full-bleed, so this is a plain
 * background sheet now (kept as a component because every page mounts it).
 */
export default function Frame({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-bg">{children}</div>;
}
