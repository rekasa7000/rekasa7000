import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { WORK_ENTRIES, homeProjects, homeSkills } from "@/lib/career-data";

export const metadata: Metadata = {
  title: "Résumé — Regee Casaña",
  description: "Résumé of Regee Casaña, software engineer based in the Philippines.",
};

const PDF = "/Regee-Casana-Resume.pdf";
const roles = [...WORK_ENTRIES].reverse();

/** A print-first résumé generated from the same career data as the rest of the site. */
export default function ResumePage() {
  return (
    <div className="resume-page">
      <div className="resume-bar">
        <Link href="/" className="btn-ghost">
          <ArrowLeft className="w-4 h-4" /> Back to the garden
        </Link>
        <a href={PDF} download className="btn-ink">
          <Download className="w-4 h-4" /> Download PDF
        </a>
      </div>

      <article className="resume">
        <header className="resume-head">
          <div>
            <h1>Regee Casaña</h1>
            <p className="resume-role">Software Engineer · Full-stack Developer · Technical Architect</p>
          </div>
          <ul className="resume-contact">
            <li>Philippines (UTC+8)</li>
            <li>
              <a href="mailto:regeecasana57@gmail.com">regeecasana57@gmail.com</a>
            </li>
            <li>
              <a href="https://linkedin.com/in/rekasa">linkedin.com/in/rekasa</a>
            </li>
            <li>
              <a href="https://github.com/rekasa7000">github.com/rekasa7000</a>
            </li>
          </ul>
        </header>

        <section>
          <h2>Summary</h2>
          <p>
            Software engineer building web products that people actually enjoy using, with an obsession for clean code
            and good UX. Experience spans real-time IoT platforms, enterprise integrations and full-stack web
            applications, including leading a team of engineers through two major platform versions.
          </p>
        </section>

        <section>
          <h2>Experience</h2>
          {roles.map((r) => (
            <div key={r.id} className="resume-item">
              <div className="resume-item-head">
                <h3>{r.title}</h3>
                <span>{r.period}</span>
              </div>
              <p className="resume-org">{r.sub ?? r.name}</p>
              <ul>
                {r.homeBullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section>
          <h2>Education</h2>
          <div className="resume-item">
            <div className="resume-item-head">
              <h3>BS Computer Science, Cum Laude</h3>
              <span>2020 – 2024</span>
            </div>
            <p className="resume-org">Bataan Peninsula State University · GPA 3.63 · Dean&apos;s List 2020–2024</p>
            <ul>
              <li>
                Major in Software Development. Thesis: CultureConnect, a social platform with collaborative filtering.
              </li>
            </ul>
          </div>
          <div className="resume-item">
            <div className="resume-item-head">
              <h3>Science, Technology, Engineering and Mathematics (STEM)</h3>
              <span>2018 – 2020</span>
            </div>
            <p className="resume-org">Microcity College of Business and Technology · Graduated with Honor</p>
          </div>
        </section>

        <section>
          <h2>Selected projects</h2>
          <ul className="resume-projects">
            {homeProjects.map((p) => (
              <li key={p.title}>
                <strong>{p.title}</strong> ({p.year}). {p.description}{" "}
                <span className="resume-tech">{p.technologies.join(" · ")}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Skills</h2>
          <dl className="resume-skills">
            {homeSkills.map((s) => (
              <div key={s.category}>
                <dt>{s.category}</dt>
                <dd>{s.items.join(", ")}</dd>
              </div>
            ))}
          </dl>
        </section>
      </article>
    </div>
  );
}
