import createMiddleware from "next-intl/middleware";
import { routing } from "../i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Everything except API routes (`/api`, `/api/...`, but not `/apiary`),
  // Next and Vercel internals, the generated favicon (/icon), the OG cards
  // (/en/opengraph-image, linked with their locale prefix by the metadata)
  // and any path with a dot (static files such as /resume.pdf). Unknown
  // paths, matched or skipped, end at app/global-not-found.tsx.
  matcher: "/((?!api/|api$|_next|_vercel|icon$|.*/opengraph-image|.*\\..*).*)",
};
