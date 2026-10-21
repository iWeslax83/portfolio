import createMiddleware from "next-intl/middleware";
import { routing } from "../i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Everything except API routes, Next and Vercel internals, the generated
  // favicon (/icon) and OG cards (/en/opengraph-image, linked with their
  // locale prefix by the metadata), and any path with a dot (static files
  // such as /resume.pdf or /robots.txt).
  matcher: "/((?!api|_next|_vercel|icon$|.*/opengraph-image|.*\\..*).*)",
};
