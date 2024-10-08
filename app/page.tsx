"use client";
import Navigation from "@/components/Navigation";
import SocialMedia from "@/components/SocialMedia";
import { Card, CardContent } from "@/components/ui/card";

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
            className="about-section  scroll-mt-16 md:mb-24 lg:mb-12 lg:scroll-mt-24 lg:text-pretty text-wrap font-medium text-lg"
          >
            <p>
              Hello there! I’m a passionate software engineer who believes in
              freedom, growth, and doing everything with purpose. I currently
              work at a{" "}
              <a
                href="https://www.kloudtechsea.com"
                className="font-bold"
                target="_blank"
              >
                startup company{" "}
              </a>{" "}
              where I manage both the server-side and client-side development,
              along with database management and DevOps.
            </p>
            <p>
              I created and built softwares like a{" "}
              <a
                href="https://www.github.com/rekasa7000/databox"
                target="_blank"
                className="font-bold"
              >
                scheduling system{" "}
              </a>
              and web-based applications like an{" "}
              <a
                href="https://www.github.com/rekasa7000/knowtproject"
                target="_blank"
                className="font-bold"
              >
                article summarizer{" "}
              </a>
              and a{" "}
              <a
                href="https://github.com/dadeyyy/CultureConnectResearch.git"
                target="_blank"
                className="font-bold"
              >
                social media.{" "}
              </a>{" "}
              I’m always open to collaboration as it really helps me to learn
              more and expand my knowledge. I enjoy learning into deep
              algorithms and data structures, and I love reading documentation
              to stay updated and improve my skills.
            </p>
            <p>
              When I’m not coding, I enjoy reading books, listening to music,
              and playing Dota 2. I also like a particular workout called
              pull-ups. After doing all of the above, I finally cuddle with my
              cat, named Miming.
            </p>
          </section>
          <section
            id="experience"
            className="about-section mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24 flex flex-col gap-3"
          >
            <Card>
              <CardContent className="grid grid-cols-6 gap-2 py-3">
                <div className="w-full col-span-2 text-sm">2024 — Present</div>
                <div className="w-full col-span-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">
                      Full Stack Developer • Kloudtech
                    </span>
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z"
                        fill="currentColor"
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="grid grid-cols-6 gap-2 py-3">
                <div className="w-full col-span-2 text-sm text-center">
                  2023 — 2024
                </div>
                <div className="w-full col-span-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">
                      Backend Developer Intern • Kloudtech
                    </span>
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z"
                        fill="currentColor"
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
          <section
            id="projects"
            className="about-section mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
          ></section>
          <section
            id="education"
            className="about-section mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
          ></section>
        </main>
      </div>
    </div>
  );
}
