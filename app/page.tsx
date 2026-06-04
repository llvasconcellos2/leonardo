import { Hero } from "./components/Hero";
import { AboutSection } from "./components/AboutSection";
import { WorkSection } from "./components/WorkSection";
import { WritingSection } from "./components/WritingSection";
import { Testimonials } from "./components/Testimonials";
import { ContactFooter } from "./components/ContactFooter";
import { Parallax } from "./components/Parallax";

export default function HomePage() {
  return (
    <>
      <Hero background="pattern" />
      <AboutSection />
      <Parallax flip={true} />
      <WorkSection />
      <Parallax />
      <WritingSection />
      <Parallax flip={true} />
      <Testimonials />
      <Parallax targetColor="44, 47, 52" />
      <ContactFooter />
    </>
  );
}
