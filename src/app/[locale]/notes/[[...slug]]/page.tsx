import type { Metadata, ResolvingMetadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "../../../../../i18n/routing";
import Frame from "@/components/frame";
import SiteHeader from "@/components/site-header";
import Footer from "@/components/footer";
import BackToTop from "@/components/ui/back-to-top";
import { notes, loadNote } from "@/content/notes";
import { SHOW_DRAFTS, publishedNotes, type NoteMeta } from "@/lib/notes";
import type { Locale } from "@/lib/locales";
import { localizedPath } from "@/lib/locale-path";
import { shareMetadata } from "@/lib/share-metadata";
import { formatDay } from "@/lib/format-date";
import { metaDescription } from "@/lib/project-nav";
import { loadMessages, type Messages } from "@/lib/messages";

type Params = Promise<{ locale: string; slug?: string[] }>;

const listed = publishedNotes(notes, SHOW_DRAFTS);

// One route for the index and every note. Only the listed params exist;
// with nothing published (a production build with only drafts) it emits
// none, so /notes, /tr/notes and every note URL fall through to the
// framed global 404 (notFound() here would render a client-only shell).
export const dynamicParams = false;

export function generateStaticParams() {
  if (listed.length === 0) return [];
  return routing.locales.flatMap((locale) => [
    { locale, slug: undefined },
    ...listed.map((n) => ({ locale, slug: [n.slug] })),
  ]);
}

/** Notes are English only, so every locale points search engines there. */
function englishOnly(path: string): Metadata["alternates"] {
  return { canonical: localizedPath("en", path) };
}

export async function generateMetadata(
  { params }: { params: Params },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { locale, slug } = (await params) as {
    locale: Locale;
    slug?: string[];
  };
  const note = slug && listed.find((n) => n.slug === slug[0]);
  if (note) {
    const path = `/notes/${note.slug}`;
    const title = `${note.title} - Emir Sakarya`;
    const description = metaDescription(note.summary);
    return {
      title,
      description,
      alternates: englishOnly(path),
      ...shareMetadata({
        locale,
        path,
        canonicalPath: localizedPath("en", path),
        title,
        description,
        type: "article",
        parent: await parent,
      }),
    };
  }
  const t = await getTranslations({ locale, namespace: "meta" });
  const title = t("notesTitle");
  const description = t("notesDescription");
  return {
    title,
    description,
    alternates: englishOnly("/notes"),
    ...shareMetadata({
      locale,
      path: "/notes",
      canonicalPath: localizedPath("en", "/notes"),
      title,
      description,
      type: "website",
      parent: await parent,
    }),
  };
}

export default async function NotesPage({ params }: { params: Params }) {
  const { locale, slug } = (await params) as {
    locale: Locale;
    slug?: string[];
  };
  setRequestLocale(locale);
  const m = await loadMessages();
  const note = slug && listed.find((n) => n.slug === slug[0]);
  return (
    <Frame>
      <SiteHeader t={m.nav} locale={locale} />
      <main id="main" tabIndex={-1} className="outline-none">
        {note ? (
          <NoteArticle note={note} t={m.notes} locale={locale} />
        ) : (
          <NotesIndex t={m.notes} locale={locale} />
        )}
      </main>
      <Footer t={m.footer} nav={m.nav} locale={locale} />
      <BackToTop label={m.common.backToTop} />
    </Frame>
  );
}

function DraftMark({ label, locale }: { label: string; locale: Locale }) {
  return (
    <span
      lang={locale}
      className="ml-3 border border-ink px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em]"
    >
      {label}
    </span>
  );
}

function NotesIndex({ t, locale }: { t: Messages["notes"]; locale: Locale }) {
  const translated = locale !== "en";
  return (
    <>
      <h1 className="border-b border-ink px-4 py-10 text-center font-display text-[clamp(3rem,12vw,10rem)] uppercase leading-[0.85] sm:px-10">
        {t.heading}
      </h1>
      {translated && (
        <p className="border-b border-ink px-4 py-3 font-mono text-xs uppercase tracking-[0.1em] text-ink-2 sm:px-10">
          {t.englishOnly}
        </p>
      )}
      <ul>
        {listed.map((n) => (
          <li key={n.slug} className="border-b border-ink">
            <a
              href={localizedPath(locale, `/notes/${n.slug}`)}
              hrefLang="en"
              className="group grid gap-3 px-4 py-8 transition-colors duration-300 hover:bg-ink hover:text-bg focus-visible:bg-ink focus-visible:text-bg sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-10 sm:px-10"
            >
              <span className="font-mono text-xs uppercase tracking-[0.1em] tabular-nums text-ink-2 group-hover:text-bg group-focus-visible:text-bg">
                {formatDay(n.date, locale)}
              </span>
              <span>
                <span
                  lang="en"
                  className="block text-balance font-serif text-2xl leading-[1.2] sm:text-[32px]"
                >
                  {n.title}
                  {translated && (
                    <span className="ml-2 font-mono text-xs tracking-[0.1em]">
                      {t.englishMarker}
                    </span>
                  )}
                  {n.draft && <DraftMark label={t.draft} locale={locale} />}
                </span>
                <span
                  lang="en"
                  className="mt-3 block max-w-[60ch] font-serif text-lg leading-[1.5] text-ink-2 group-hover:text-bg group-focus-visible:text-bg"
                >
                  {n.summary}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}

async function NoteArticle({
  note,
  t,
  locale,
}: {
  note: NoteMeta;
  t: Messages["notes"];
  locale: Locale;
}) {
  const { default: Body } = await loadNote(note.slug);
  return (
    <article lang="en">
      <p className="border-b border-ink px-4 py-3 font-mono text-xs uppercase tracking-[0.1em] sm:px-10">
        <a
          href={localizedPath(locale, "/notes")}
          lang={locale}
          className="link-draw"
        >
          <span aria-hidden>← </span>
          {t.back}
        </a>
      </p>
      <header className="border-b border-ink px-4 py-10 text-center sm:px-10">
        <p className="font-mono text-xs uppercase tracking-[0.1em] tabular-nums text-ink-2">
          <time dateTime={note.date}>{formatDay(note.date)}</time>
          {note.draft && <DraftMark label={t.draft} locale={locale} />}
        </p>
        <h1 className="mx-auto mt-6 max-w-[18ch] text-balance font-display text-[clamp(2.5rem,7vw,6rem)] uppercase leading-[0.9]">
          {note.title}
        </h1>
      </header>
      <div className="mx-4 max-w-[760px] border-x border-ink px-6 py-14 font-serif text-[22px] leading-[1.5] tracking-[-0.01em] sm:mx-auto sm:px-12 sm:py-20 sm:text-[30px]">
        <Body />
      </div>
    </article>
  );
}
