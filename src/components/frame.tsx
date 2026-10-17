/**
 * The black page frame: four fixed edges over everything, plus a white
 * content sheet inset by the same amount so nothing starts under an edge.
 */
export default function Frame({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[60] border-8 border-frame sm:border-[16px]"
      />
      <div className="min-h-screen p-2 sm:p-4">
        <div className="bg-bg">{children}</div>
      </div>
    </>
  );
}
