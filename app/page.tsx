"use client";
import SocialMedia from "@/components/SocialMedia";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [activeSection, setActiveSection] = useState<string>("#about");

  const aboutRef = useRef<HTMLDivElement | null>(null);
  const experienceRef = useRef<HTMLDivElement | null>(null);
  const projectsRef = useRef<HTMLDivElement | null>(null);

  const handleSetActive = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  useEffect(() => {
    const sections = [
      { id: "#about", ref: aboutRef },
      { id: "#experience", ref: experienceRef },
      { id: "#projects", ref: projectsRef },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute("id");
            if (sectionId) {
              setActiveSection(`#${sectionId}`);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => {
      if (section.ref.current) {
        observer.observe(section.ref.current);
      }
    });

    return () => {
      sections.forEach((section) => {
        if (section.ref.current) {
          observer.unobserve(section.ref.current);
        }
      });
    };
  }, []);

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
            <nav
              className="nav hidden lg:flex justify-end"
              aria-label="In-page jump links"
            >
              <ul className="mt-16 w-max">
                <li>
                  <a
                    className={`group flex gap-3 items-center py-3`}
                    href="#about"
                    onClick={() => handleSetActive("#about")}
                  >
                    <span className="text-xs w-full font-bold uppercase tracking-widest text-slate-600 group-hover:text-slate-400 group-focus-visible:text-slate-200">
                      About
                    </span>
                    <div
                      className={`aspect-square h-1 w-0 bg-blue-500 transform transition-all duration-300 ${
                        activeSection === "#about"
                          ? "opacity-100 scale-100 w-24"
                          : "opacity-0 scale-0"
                      }`}
                    ></div>
                  </a>
                </li>

                <li>
                  <a
                    className={`group flex gap-3 items-center py-3 ${
                      activeSection === "#experience" ? "active" : ""
                    }`}
                    href="#experience"
                    onClick={() => handleSetActive("#experience")}
                  >
                    <span className="text-xs w-full font-bold uppercase tracking-widest text-slate-600 group-hover:text-slate-400 group-focus-visible:text-slate-200">
                      Experience & Education
                    </span>
                    <div
                      className={`aspect-square h-1 w-0 bg-blue-500 transform transition-all duration-300 ${
                        activeSection === "#experience"
                          ? "opacity-100 scale-100 w-24"
                          : "opacity-0 scale-0"
                      }`}
                    ></div>
                  </a>
                </li>
                <li>
                  <a
                    className={`group flex gap-3 items-center py-3 ${
                      activeSection === "#projects" ? "active" : ""
                    }`}
                    href="#projects"
                    onClick={() => handleSetActive("#projects")}
                  >
                    <span className="text-xs w-full font-bold uppercase tracking-widest text-slate-600 group-hover:text-slate-400 group-focus-visible:text-slate-200">
                      Projects
                    </span>
                    <div
                      className={`aspect-square h-1 w-0 bg-blue-500 transform transition-all duration-300 ${
                        activeSection === "#projects"
                          ? "opacity-100 scale-100 w-24"
                          : "opacity-0 scale-0"
                      }`}
                    ></div>
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <div className="flex flex-col gap-2">
            <SocialMedia />
            <span className="text-xs text-gray-500">
              Inspired by{" "}
              <a
                href="https://brittanychiang.com/"
                target="_blank"
                className="font-bold"
              >
                Britanny Chiang
              </a>
            </span>
          </div>
        </header>
        <main className="pt-24 lg:w-2/3 lg:py-24 scroll-smooth snap-y">
          <section
            id="about"
            ref={aboutRef}
            className="about-section py-10 transition-all duration-300 text-lg"
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
              I created and built software like a{" "}
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
              more and expand my knowledge. I enjoy learning deep algorithms and
              data structures, and I love reading documentation to stay updated
              and improve my skills.
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
            ref={experienceRef}
            className="about-section flex flex-col py-10 my-0 lg:my-10"
          >
            <h2 className="text-start font-bold text-lg">Experience</h2>
            <div className="flex flex-col gap-5">
              <Card
                className="hover:bg-muted cursor-pointer py-2"
                onClick={() =>
                  window.open("https://kloudtechsea.com", "_blank")
                }
              >
                <CardContent className="grid grid-cols-6 gap-2 py-3">
                  <div className="w-full col-span-2 text-lg">
                    2024 — Present
                  </div>
                  <div className="w-full col-span-4 flex flex-col gap-2">
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
                    <div className="flex flex-col">
                      <p>
                        Built an web application of the company, as well as the
                        applications for the company&apos;s clients. Responsible
                        for maintaining the web server and database. Deployed
                        the whole app in a virtual private server.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge>Typescript</Badge>
                      <Badge>React</Badge>
                      <Badge>Express</Badge>
                      <Badge>TailwindCss</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card
                className="hover:bg-muted cursor-pointer py-2"
                onClick={() =>
                  window.open("https://kloudtechsea.com", "_blank")
                }
              >
                <CardContent className="grid grid-cols-6 gap-1 py-3">
                  <div className="w-full col-span-2 text-lg">2023 — 2024</div>
                  <div className="w-full col-span-4 flex flex-col gap-2">
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
                    <div className="flex flex-col">
                      <p>
                        Created and assisted with the design, development, and
                        support of the company&apos;s existing web application
                        Assisted. in improving the cybersecurity while also
                        maintaining and optimizing the company&apos;s website.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge>Php</Badge>
                      <Badge>Javascript</Badge>
                      <Badge>C++</Badge>
                      <Badge>MySql</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <ol className="relative border-s border-gray-200 dark:border-gray-700 mt-5">
              <h2 className="text-start font-bold text-lg">Education</h2>

              <li className="mb-10 ms-4">
                <div className="absolute w-3 h-3 bg-gray-500 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                  September 2024
                </time>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Bataan Peninsula State University
                </h3>
                <div className="flex flex-col">
                  <span className="text-base font-normal text-gray-500 dark:text-gray-400 mr-2">
                    Bachelor of Science in Computer Science, Major in Software
                    Development
                  </span>
                  <Badge className="m-0 max-w-24">Cum Laude</Badge>
                </div>
              </li>
              <li className="mb-10 ms-4">
                <div className="absolute w-3 h-3 bg-gray-500 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">
                  March 2020
                </time>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Microcity College of Business and Technology
                </h3>
                <div className="flex flex-col">
                  <span className="text-base font-normal text-gray-500 dark:text-gray-400 mr-2">
                    Science, Technology, Engineering, and Mathematics
                  </span>
                  <Badge className="m-0 max-w-24">With Honors</Badge>
                </div>
              </li>
            </ol>
          </section>
          <section
            id="projects"
            ref={projectsRef}
            className="about-section flex flex-col  py-10 my-0 lg:my-10"
          >
            <h2 className="text-start font-bold text-lg">Projects</h2>
            <div className="flex flex-col gap-5">
              <Card
                className="hover:bg-muted cursor-pointer border-none shadow-none"
                onClick={() =>
                  window.open(
                    "https://github.com/dadeyyy/CultureConnectResearch.git",
                    "_blank"
                  )
                }
              >
                <CardContent className="grid grid-cols-6 gap-2 py-3">
                  <div className="w-full col-span-2 text-sm ">
                    <img src="/cultureconnect.svg" className="w-full" />
                  </div>
                  <div className="w-full col-span-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">CultureConnect</span>
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
                    <div className="flex flex-col">
                      <p>
                        Built a social media platform that addresses issues like
                        fostering connections between diverse cultures, tailored
                        content delivery, spam prevention, hate speech
                        censorship, and promoting real-time cultural events.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge>Typescript</Badge>
                      <Badge>React</Badge>
                      <Badge>Express</Badge>
                      <Badge>Node</Badge>
                      <Badge>PostgreSQL</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card
                className="hover:bg-muted cursor-pointer border-none shadow-none"
                onClick={() =>
                  window.open(
                    "https://github.com/rekasa7000/knowtproject",
                    "_blank"
                  )
                }
              >
                <CardContent className="grid grid-cols-6 gap-2 py-3">
                  <div className="w-full col-span-2  text-sm">
                    <img src="/knowt.png" className="w-full" />
                  </div>
                  <div className="w-full col-span-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">Knowt</span>
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
                    <div className="flex flex-col">
                      <p>
                        An article summarization tool leveraging machine
                        learning and sentiment analysis to automate article
                        summarization from URLs. it provides a
                        mobile-responsive, user-friendly interface for efficient
                        content processing.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge>Python</Badge>
                      <Badge>Flask</Badge>
                      <Badge>Firebase</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card
                className="hover:bg-muted cursor-pointer border-none shadow-none"
                onClick={() =>
                  window.open("https://github.com/rekasa7000/databox", "_blank")
                }
              >
                <CardContent className="grid grid-cols-6 gap-2 py-3">
                  <div className="w-full col-span-2  text-sm">
                    <img src="/databox.png" className="w-full" />
                  </div>
                  <div className="w-full col-span-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">Databox</span>
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
                    <div className="flex flex-col">
                      <p>
                        A digital scheduler and progress tracker aimed at
                        improving time management and organization for students
                        and teachers in online learning.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge>C#</Badge>
                      <Badge>.NET</Badge>
                      <Badge>XAMPP</Badge>
                      <Badge>MySql</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
