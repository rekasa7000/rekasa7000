import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { RESUME, type ResumeBlock } from "@/lib/resume-data";

export const metadata: Metadata = {
  title: "Résumé — Regee Casaña",
  description: "Résumé of Regee Casaña, software engineer and technical lead based in the Philippines.",
};

const PDF = "/Regee-Casana-Resume.pdf";

function Block({ block }: { block: ResumeBlock }) {
  return (
    <div className="resume-item">
      <div className="resume-item-head">
        <h3>{block.org}</h3>
        <span>{block.place}</span>
      </div>
      {block.roles.map((r) => (
        <div key={r.title} className="resume-item-head resume-role-line">
          <em>{r.title}</em>
          {r.period && <span>{r.period}</span>}
        </div>
      ))}
      <ul>
        {block.bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
    </div>
  );
}

/** A print-first résumé that mirrors the owner's own document, fed by the site's career data. */
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
          <h1>{RESUME.name}</h1>
          <ul className="resume-contact">
            <li>{RESUME.location}</li>
            <li>
              <a href={`mailto:${RESUME.email}`}>{RESUME.email}</a>
            </li>
            {RESUME.links.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </header>

        <section>
          <h2>Summary</h2>
          <p>{RESUME.summary}</p>
        </section>

        <section>
          <h2>Work experience</h2>
          {RESUME.work.map((b) => (
            <Block key={b.org} block={b} />
          ))}
          <p className="resume-subhead">{RESUME.freelanceHeading}</p>
          {RESUME.freelance.map((b) => (
            <Block key={b.org} block={b} />
          ))}
        </section>

        <section>
          <h2>Education</h2>
          <div className="resume-item">
            <div className="resume-item-head">
              <h3>{RESUME.education.school}</h3>
              <span>{RESUME.education.place}</span>
            </div>
            <div className="resume-item-head resume-role-line">
              <em>{RESUME.education.degree}</em>
              <span>{RESUME.education.date}</span>
            </div>
          </div>
        </section>

        <section>
          <h2>Skills</h2>
          <ul>
            {RESUME.skills.map((s) => (
              <li key={s.category}>
                <strong>{s.category}:</strong> {s.items}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Certifications</h2>
          <ul>
            {RESUME.certifications.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </section>
      </article>
    </div>
  );
}
