"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { CASE_STUDIES } from "@/lib/case-studies";
import { academicProjects } from "@/lib/career-data";

const FALLBACK_TINTS = ["var(--leaf)", "var(--petal)", "var(--lilac)", "var(--accent-3)", "var(--accent-2)"];
const VISIBLE_COUNT = 3;

type WorkCard = {
  key: string;
  href?: string;
  external: boolean;
  tag: string;
  title: string;
  description: string;
  technologies: string[];
  coverImage?: string;
};

const caseStudyCards: WorkCard[] = CASE_STUDIES.filter((c) => c.showOnHome !== false).flatMap((c) => {
  const card: WorkCard = {
    key: c.slug,
    href: `/works/${c.slug}`,
    external: false,
    tag: "Case study",
    title: c.title,
    description: c.tagline,
    technologies: c.stack,
    coverImage: c.coverImage,
  };

  // The citizen-facing view of KloudTrack is a separate product surface worth its own card.
  if (c.slug !== "kloudtrack") return [card];
  return [
    card,
    {
      key: "kloudtrack-public",
      href: `/works/${c.slug}`,
      external: false,
      tag: "Public dashboard",
      title: "KloudTrack — Citizen Dashboard",
      description:
        "The public-facing view of KloudTrack: live weather and water-level readings for any barangay, in English and Filipino.",
      technologies: c.stack,
      coverImage: "/images/works/kloudtrack-public.png",
    },
  ];
});

const works: WorkCard[] = [
  ...caseStudyCards,
  ...academicProjects.map((p) => ({
    key: p.slug,
    href: p.githubUrl || undefined,
    external: true,
    tag: "Academic project",
    title: p.title,
    description: p.description,
    technologies: p.technologies,
    coverImage: p.coverImage,
  })),
];

/** Cover art: the real screenshot if one has been dropped in /public/images/works, else a tinted placeholder. */
function WorkCover({ work, index }: { work: WorkCard; index: number }) {
  const [broken, setBroken] = useState(!work.coverImage);

  if (broken) {
    return (
      <div
        className="w-full aspect-5/3 flex items-end p-5"
        style={{ background: `linear-gradient(155deg, ${FALLBACK_TINTS[index % FALLBACK_TINTS.length]}, var(--shadow-hard))` }}
      >
        <span className="font-display text-2xl" style={{ color: "var(--bg-primary)", lineHeight: 1.1 }}>
          {work.title}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={work.coverImage!}
      alt={`${work.title} — product screenshot`}
      width={800}
      height={480}
      sizes="(min-width: 1024px) 420px, 100vw"
      className="w-full h-auto aspect-5/3 object-cover block"
      onError={() => setBroken(true)}
    />
  );
}

/** Selected Works: real screenshots in a clean grid, like a Figma / product-showcase gallery. Collapsed to the first 3 by default. */
export function WorkGrid() {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? works : works.slice(0, VISIBLE_COUNT);

  return (
    <div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-7 gap-y-10">
        {visible.map((work, i) => (
          <motion.a
            key={work.key}
            href={work.href}
            target={work.external ? "_blank" : undefined}
            rel={work.external ? "noopener noreferrer" : undefined}
            className="poster group block"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: "easeOut" }}
          >
            <div className="relative overflow-hidden">
              <div className="transition-transform duration-500 ease-out group-hover:scale-[1.04]">
                <WorkCover work={work} index={i} />
              </div>
              <span className="session-tag absolute top-3 left-3">{work.tag}</span>
              <span className="poster-arrow" aria-hidden="true">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </div>
            <div className="p-5">
              <h3 className="font-display text-xl mb-2.5" style={{ lineHeight: 1.15 }}>
                {work.title}
              </h3>
              <p className="text-sm leading-snug mb-4 line-clamp-2" style={{ color: "var(--text-secondary)" }}>
                {work.description}
              </p>
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                {work.technologies.slice(0, 4).map((t) => (
                  <span key={t} className="meta-label" style={{ letterSpacing: "0.06em" }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </motion.a>
        ))}
      </div>

      {works.length > VISIBLE_COUNT && (
        <div className="mt-10 flex justify-center">
          <button type="button" onClick={() => setExpanded((v) => !v)} className="btn-ghost">
            {expanded ? "Show less" : `Show all works (${works.length})`}
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
          </button>
        </div>
      )}
    </div>
  );
}
