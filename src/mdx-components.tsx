import type { MDXComponents } from "mdx/types";
import { SECTION_BAR } from "@/components/sections/section-bar";

/** Bars run edge to edge of the note column, cancelling its padding. */
const BLEED = "-mx-6 sm:-mx-12";

/**
 * Note typography: serif body at the About copy's reading size, mono for
 * code, black section bars for h2 (as in the About column). No new fonts.
 */
const components: MDXComponents = {
  h2: ({ children }) => (
    <h2 className={`${SECTION_BAR} ${BLEED} mb-8 mt-14`}>{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-4 mt-10 font-mono text-sm font-bold uppercase tracking-[0.1em]">
      {children}
    </h3>
  ),
  p: ({ children }) => <p className="mb-6 text-pretty">{children}</p>,
  a: ({ href, children }) => {
    const external = href?.startsWith("http");
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="underline decoration-1 underline-offset-4 transition-[text-decoration-thickness] duration-[350ms] hover:decoration-[3px] focus-visible:decoration-[3px]"
      >
        {children}
      </a>
    );
  },
  ul: ({ children }) => (
    <ul className="mb-6 list-disc space-y-2 pl-6">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-6 list-decimal space-y-2 pl-6">{children}</ol>
  ),
  pre: ({ children }) => (
    <pre
      tabIndex={0}
      className={`${BLEED} mb-6 overflow-x-auto border-y border-ink bg-panel px-6 py-5 font-mono text-[13px] leading-[1.6] sm:px-12 sm:text-sm [&>code]:bg-transparent [&>code]:p-0 [&>code]:text-[1em]`}
    >
      {children}
    </pre>
  ),
  code: ({ children }) => (
    <code className="bg-panel px-1 font-mono text-[0.72em]">{children}</code>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mb-6 border-l-2 border-ink pl-5">
      {children}
    </blockquote>
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
