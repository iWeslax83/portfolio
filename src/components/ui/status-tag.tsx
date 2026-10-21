import { Project } from "@/lib/types";

export type StatusLabels = Record<Project["status"], string>;

export default function StatusTag({
  status,
  labels,
}: {
  status: Project["status"];
  /** Worded on the server, per locale. */
  labels: StatusLabels;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.14em] text-ink-3">
      <span
        className={`h-1.5 w-1.5 ${
          status === "SHIPPED"
            ? "bg-ink"
            : status === "IN_PROGRESS"
              ? "border border-ink bg-transparent"
              : "bg-ink-3"
        }`}
        aria-hidden
      />
      {labels[status]}
    </span>
  );
}
