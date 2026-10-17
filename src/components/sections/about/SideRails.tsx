const rail =
  "sticky top-[30vh] font-mono text-[11px] uppercase tracking-[0.3em] text-ink [writing-mode:vertical-rl]";

/** Vertical mono captions on both edges, desktop only. Decorative. */
export default function SideRails({
  left,
  right,
}: {
  left: string;
  right: string;
}) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden lg:block">
      <div className="absolute inset-y-0 left-8">
        <p className={`${rail} rotate-180`}>{left}</p>
      </div>
      <div className="absolute inset-y-0 right-8">
        <p className={rail}>{right}</p>
      </div>
    </div>
  );
}
