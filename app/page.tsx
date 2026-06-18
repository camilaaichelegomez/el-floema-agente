import Navbar from "@/components/Navbar";
import { ParallaxHero } from "@/components/ParallaxHero";
import { AgentesIA } from "@/components/AgentesIA";
import { PlantasMedicinalesSection } from "@/components/PlantasMedicinalesSection";
import { KnowledgeCards } from "@/components/KnowledgeCards";
import { SectionDivider } from "@/components/SectionDivider";
import { NavCards } from "@/components/NavCards";
import { LaBotica } from "@/components/LaBotica";

export default function Home() {
  return (
    <>
      <Navbar />
      <ParallaxHero />
      <AgentesIA />
      <PlantasMedicinalesSection />
      <section style={{ background: "var(--bg-primary)" }}>
        <KnowledgeCards />
      </section>
      <SectionDivider />
      <section style={{ background: "var(--bg-secondary)" }}>
        <NavCards />
      </section>
      <LaBotica />
      <footer className="site-footer">
        <img src="/logo.jpg" alt="El Floema" className="footer-logo" />
        <p className="footer-tagline">Con ciencia, mi magia despierta</p>
        <p className="footer-handle">@elfloema</p>
      </footer>
    </>
  );
}
