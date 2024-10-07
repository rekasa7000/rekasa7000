"use client";
import Navigation from "@/components/Navigation";
import SocialMedia from "@/components/SocialMedia";

export default function Home() {
  return (
    <div className="mx-auto min-h-screen max-w-screen-xl px-6 py-12 font-sans md:px-12 md:py-20 lg:px-24 lg:py-0">
      <div className="lg:flex lg:flex-row-reverse lg:justify-between lg:gap-4 container">
        <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-1/2 lg:flex-col lg:justify-between lg:py-24 text-end">
          <div>
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
          </div>

          <SocialMedia />
        </header>
        <main className="pt-24 lg:w-1/2 lg:py-24">
          <section
            id="about"
            className="about-section mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
          >
            <p>
              I am a dedicated full-stack developer with a deep passion for
              creating efficient, user-friendly websites and software. My
              journey into tech began with a fascination for problem-solving and
              has since evolved into a full-time commitment to building
              impactful digital solutions. Whether it’s developing complex
              applications or refining user interfaces, I always strive to
              deliver work that blends both functionality and aesthetics.
            </p>
            <p>
              Technology is ever-changing, and I believe in constantly evolving
              along with it. I invest time in learning new tools, frameworks,
              and techniques to stay ahead in the field. This commitment has
              allowed me to work on a variety of projects, each expanding my
              knowledge in web development, software engineering, and cloud
              technologies. I value challenges as they push me to innovate and
              find creative solutions to problems.
            </p>
            <p>
              Collaboration is at the heart of my work. I love working closely
              with clients and teams to bring ideas to life. Understanding the
              user’s needs and translating them into intuitive digital
              experiences is what drives me. My focus is always on delivering
              high-quality products that leave a lasting impact and serve the
              needs of the business and the end-users alike.
            </p>
          </section>
          <section
            id="experience"
            className="about-section mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
          >
            <h2>Experience</h2>
            <p>
              I am a dedicated full-stack developer with a deep passion for
              creating efficient, user-friendly websites and software. My
              journey into tech began with a fascination for problem-solving and
              has since evolved into a full-time commitment to building
              impactful digital solutions. Whether it’s developing complex
              applications or refining user interfaces, I always strive to
              deliver work that blends both functionality and aesthetics.
            </p>
            <p>
              Technology is ever-changing, and I believe in constantly evolving
              along with it. I invest time in learning new tools, frameworks,
              and techniques to stay ahead in the field. This commitment has
              allowed me to work on a variety of projects, each expanding my
              knowledge in web development, software engineering, and cloud
              technologies. I value challenges as they push me to innovate and
              find creative solutions to problems.
            </p>
            <p>
              Collaboration is at the heart of my work. I love working closely
              with clients and teams to bring ideas to life. Understanding the
              user’s needs and translating them into intuitive digital
              experiences is what drives me. My focus is always on delivering
              high-quality products that leave a lasting impact and serve the
              needs of the business and the end-users alike.
            </p>
          </section>
          <section
            id="projects"
            className="about-section mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
          >
            <h2>Projects</h2>
            <p>
              I am a dedicated full-stack developer with a deep passion for
              creating efficient, user-friendly websites and software. My
              journey into tech began with a fascination for problem-solving and
              has since evolved into a full-time commitment to building
              impactful digital solutions. Whether it’s developing complex
              applications or refining user interfaces, I always strive to
              deliver work that blends both functionality and aesthetics.
            </p>
            <p>
              Technology is ever-changing, and I believe in constantly evolving
              along with it. I invest time in learning new tools, frameworks,
              and techniques to stay ahead in the field. This commitment has
              allowed me to work on a variety of projects, each expanding my
              knowledge in web development, software engineering, and cloud
              technologies. I value challenges as they push me to innovate and
              find creative solutions to problems.
            </p>
            <p>
              Collaboration is at the heart of my work. I love working closely
              with clients and teams to bring ideas to life. Understanding the
              user’s needs and translating them into intuitive digital
              experiences is what drives me. My focus is always on delivering
              high-quality products that leave a lasting impact and serve the
              needs of the business and the end-users alike.
            </p>
          </section>
          <section
            id="education"
            className="about-section mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
          >
            <h2>Education</h2>
            <p>
              I am a dedicated full-stack developer with a deep passion for
              creating efficient, user-friendly websites and software. My
              journey into tech began with a fascination for problem-solving and
              has since evolved into a full-time commitment to building
              impactful digital solutions. Whether it’s developing complex
              applications or refining user interfaces, I always strive to
              deliver work that blends both functionality and aesthetics.
            </p>
            <p>
              Technology is ever-changing, and I believe in constantly evolving
              along with it. I invest time in learning new tools, frameworks,
              and techniques to stay ahead in the field. This commitment has
              allowed me to work on a variety of projects, each expanding my
              knowledge in web development, software engineering, and cloud
              technologies. I value challenges as they push me to innovate and
              find creative solutions to problems.
            </p>
            <p>
              Collaboration is at the heart of my work. I love working closely
              with clients and teams to bring ideas to life. Understanding the
              user’s needs and translating them into intuitive digital
              experiences is what drives me. My focus is always on delivering
              high-quality products that leave a lasting impact and serve the
              needs of the business and the end-users alike.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}
