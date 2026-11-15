import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Header } from "@/components/header";
import { FadeInSection } from "@/components/motion-wrappers";
import { BlockHeading } from "@/components/showcase/about-me-visuals";
import { Carbon3D, Languages3D, Rain3D } from "@/components/three/garden-3d";
import { CASE_STUDIES } from "@/lib/case-studies";

export function generateStaticParams() {
  return CASE_STUDIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const study = CASE_STUDIES.find((c) => c.slug === slug);
  return study ? { title: `${study.title} — case study · Regee Casaña`, description: study.tagline } : {};
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = CASE_STUDIES.find((c) => c.slug === slug);
  if (!study) notFound();

  const rule = { borderColor: "var(--border-color)" };
  const Scene = { rain: Rain3D, languages: Languages3D, carbon: Carbon3D }[study.scene];

  return (
    <div
      className="min-h-screen relative"
      style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      <Header activePage="other" />

      <main className="max-w-5xl mx-auto px-6 relative z-10">
        <section className="pt-12 pb-16 md:pt-16 md:pb-20">
          <Link
            href="/#works"
            className="meta-label inline-flex items-center gap-2 mb-10 link-underline"
            style={{ color: "var(--text-secondary)" }}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> All works
          </Link>
          <div className="grid md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-6">
              <span className="session-tag mb-6">Case study</span>
              <h1 className="font-display text-5xl md:text-7xl mt-6 mb-6">{study.title}</h1>
              <p className="text-lg md:text-xl mb-8" style={{ color: "var(--text-secondary)" }}>
                {study.tagline}
              </p>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
                {study.facts.map((f) => (
                  <div key={f.label}>
                    <dt className="meta-label mb-1">{f.label}</dt>
                    <dd className="font-medium text-[15px]">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="md:col-span-6 h-[320px] md:h-[440px]">
              <Scene />
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 border-t" style={rule}>
          <BlockHeading tag="01" title="The need" />
          <div className="grid md:grid-cols-2 gap-6">
            {study.need.map((n) => (
              <FadeInSection key={n}>
                <p className="font-display text-xl md:text-2xl" style={{ lineHeight: 1.25 }}>
                  {n}
                </p>
              </FadeInSection>
            ))}
          </div>
        </section>

        <section className="py-16 md:py-20 border-t" style={rule}>
          <BlockHeading tag="02" title="How a reading travels" note="Station to screen" />
          <ol className="flow">
            {study.flow.map((s, i) => (
              <FadeInSection key={s.step} delay={i * 0.08}>
                <li className="flow-step">
                  <span className="flow-num">{s.step}</span>
                  <h3 className="font-display text-xl mb-2">{s.title}</h3>
                  <p className="text-sm leading-snug" style={{ color: "var(--text-secondary)" }}>
                    {s.detail}
                  </p>
                </li>
              </FadeInSection>
            ))}
          </ol>
        </section>

        <section className="py-16 md:py-20 border-t" style={rule}>
          <BlockHeading tag="03" title="What it achieved" note="Results" />
          <div className={`grid grid-cols-2 md:grid-cols-3 stat-grid`}>
            {study.results.map((r) => (
              <div key={r.label} className="stat-cell p-5 md:p-8">
                <div className="font-display text-3xl sm:text-4xl md:text-5xl mb-3" style={{ color: "var(--accent)" }}>
                  {r.value}
                </div>
                <div className="font-medium text-sm md:text-base leading-snug">{r.label}</div>
                <div className="meta-label mt-1.5" style={{ letterSpacing: "0.06em" }}>
                  {r.note}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-16 md:py-20 border-t" style={rule}>
          <BlockHeading tag="04" title="My part" note="Role" />
          <div className="grid md:grid-cols-3 gap-6">
            {study.role.map((r, i) => (
              <FadeInSection key={r.title} delay={i * 0.1}>
                <div className="stage-card p-6 h-full">
                  <h3 className="font-display text-xl mb-3">{r.title}</h3>
                  <p className="text-[15px] leading-snug" style={{ color: "var(--text-secondary)" }}>
                    {r.text}
                  </p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </section>

        <section className="py-16 md:py-20 border-t" style={rule}>
          <BlockHeading tag="05" title="Built with" note="Stack" />
          <div className="flex flex-wrap gap-2 mb-12">
            {study.stack.map((t) => (
              <span key={t} className="chip" style={{ cursor: "default" }}>
                {t}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-4">
            {study.github && (
              <a href={study.github} target="_blank" rel="noopener noreferrer" className="btn-ink">
                View on GitHub <ArrowUpRight className="w-4 h-4" />
              </a>
            )}
            <Link href="/#contact" className="btn-ghost">
              Talk to me about it
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t mt-12" style={rule}>
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="meta-label">© {new Date().getFullYear()} Regee Casaña · Grown with care</div>
        </div>
      </footer>
    </div>
  );
}
