import Frame from "@/components/frame";
import SiteHeader from "@/components/site-header";
import Footer from "@/components/footer";
import BackToTop from "@/components/ui/back-to-top";

export default async function Home() {
  return (
    <Frame>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="outline-none"></main>
      <Footer />
      <BackToTop />
    </Frame>
  );
}
