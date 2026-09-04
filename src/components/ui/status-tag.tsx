import { Project } from "@/lib/types";

const statusLabel: Record<Project["status"], string> = {
  SHIPPED: "SHIPPED",
  IN_PROGRESS: "IN PROGRESS",
  ARCHIVED: "ARCHIVED",
};

export default function StatusTag({ status }: { status: Project["status"] }) {
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
      {statusLabel[status]}
    </span>
  );
}
