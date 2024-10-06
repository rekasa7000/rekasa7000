"use client";
import Navigation from "@/components/Navigation";
import SocialMedia from "@/components/SocialMedia";
import { useEffect, useState } from "react";

export default function Home() {
  const [activeSection, setActiveSection] = useState("#about");

  useEffect(() => {
    setActiveSection("#about");
  }, []);

  const handleSetActive = (section: string) => {
    setActiveSection(section);
  };
  return (
    <div className="flex justify-center items-center h-dvh w-full container max-w-6xl m-auto">
      <main className="pt-24 lg:w-1/2 lg:py-24" id="content">
        <section
          id="about"
          className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
        >
          <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-slate-900/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
            <h2 className="text-sm font-bold uppercase tracking-widest  lg:sr-only">
              About me
            </h2>
          </div>
        </section>
      </main>
      <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-1/2 lg:flex-col lg:justify-end lg:py-24 text-end">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          <a href="/">Regee Casaña</a>
        </h1>
        <h2 className="mt-3 text-lg font-medium tracking-tight text-slate-700 sm:text-xl">
          Full Stack & Software Engineer
        </h2>
        <p className="mt-4 leading-normal">
          I build websites and software to the best of my abilities and
          knowledge.
        </p>
        <Navigation />
        <SocialMedia />
      </header>
    </div>
  );
}
