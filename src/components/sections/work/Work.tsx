import { useTranslations } from "next-intl";
import { projects } from "@/data/projects";
import { galleryProjects } from "@/lib/work-gallery";
import WorkIntro from "./WorkIntro";
import WorkGallery from "./WorkGallery";
import StaticGallery from "./StaticGallery";

/**
 * Capsule, pinned gallery, capsule again: the reference's Work rhythm. The
 * gallery is decorative motion, so the real links live in a list that is
 * hidden until it takes keyboard focus; the full record is on /projects.
 */
export default function Work() {
  const t = useTranslations("projects");
  const items = galleryProjects(projects);
  return (
    <section id="work" aria-labelledby="work-title">
      <h2 id="work-title" className="sr-only">
        Work
      </h2>
      <nav
        aria-label={t("listLabel")}
        className="sr-only focus-within:not-sr-only focus-within:block focus-within:border-b focus-within:border-ink focus-within:p-6"
      >
        <ul className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-[0.1em]">
          {items.map((p) => {
            const primary = p.links.find((l) => l.isPrimary) ?? p.links[0];
            return primary ? (
              <li key={p.slug}>
                <a
                  href={primary.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-draw"
                >
                  {p.title}
                </a>
              </li>
            ) : null;
          })}
          <li>
            <a href="/projects" className="link-draw">
              {t("allTitle")} · {t("count", { count: projects.length })}
            </a>
          </li>
        </ul>
      </nav>
      <div className="work-animated">
        <WorkIntro />
        <WorkGallery items={items} />
        <WorkIntro mode="out" />
      </div>
      <div className="work-static">
        <StaticGallery items={items} />
      </div>
    </section>
  );
}
