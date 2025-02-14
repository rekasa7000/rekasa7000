// app/page.tsx
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Contact from "@/components/Contacts";
import Header from "@/components/Header";
import Experience from "@/components/Experience";
import Education from "@/components/Education";
import Skills from "@/components/Skills";
import Activities from "@/components/Activities";

export default function HomePage() {
  return (
    <main>
      <Header />
      <Hero />
      <Experience />
      <Education />

      <Skills />
      <Projects />
      <Activities />
      <Contact />
    </main>
  );
}
