"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Flower, type FlowerKind } from "./garden";
import {
  ArrowUpRight,
  BookOpen,
  Compass,
  Gem,
  GitBranch,
  GraduationCap,
  Handshake,
  Lightbulb,
  MessagesSquare,
  Minimize2,
  Rocket,
  Scale,
  Sprout,
  UserRound,
  Users,
  Wrench,
} from "lucide-react";

const rise = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
};

export function BlockHeading({ tag, title, note }: { tag: string; title: string; note?: string }) {
  return (
    <motion.div {...rise} transition={{ duration: 0.45 }} className="mb-10">
      <div className="section-rule mb-5">
        <span className="session-tag">{tag}</span>
        <span className="rule-line" aria-hidden="true" />
        {note && <span className="meta-label">{note}</span>}
      </div>
      <h2 className="font-display text-3xl md:text-5xl">{title}</h2>
    </motion.div>
  );
}

/* ── Conference lanyard badge with the owner's avatar ── */

export function SpeakerBadge() {
  return (
    <div className="badge-rig" aria-label="Name badge for Regee Casaña">
      <div className="badge-strap" aria-hidden="true" />
      <div className="badge-swing">
        <div className="badge-clip" aria-hidden="true" />
        <div className="badge-card">
          <div className="flex items-center justify-between px-4 py-2.5 badge-head">
            <span>Gardener</span>
            <span>Plot No. 1</span>
          </div>
          <div className="p-4">
            <div className="badge-photo">
              <Image src="/regee.png" alt="Cartoon portrait of Regee Casaña" width={500} height={500} priority />
            </div>
            <div className="font-display text-xl mt-4 mb-1.5" style={{ lineHeight: 1.05 }}>
              Regee Casaña
            </div>
            <div className="meta-label" style={{ color: "var(--accent)" }}>
              Software Engineer
            </div>
            <div className="flex items-end justify-between mt-4 gap-3">
              <div className="meta-label" style={{ fontSize: "0.5625rem", lineHeight: 1.7 }}>
                Base · Philippines
                <br />
                Track · Web × IoT × AI
              </div>
              <div className="badge-code" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Origin story in three stages ── */

const STAGES = [
  {
    icon: Lightbulb,
    stage: "Stage 1",
    title: "Curiosity",
    text: "It started with wanting to know how things work.",
  },
  {
    icon: GraduationCap,
    stage: "Stage 2",
    title: "Training",
    text: "Computer Science at BPSU, graduating Cum Laude.",
  },
  {
    icon: Wrench,
    stage: "Stage 3",
    title: "Craft",
    text: "Understand the problem, design it well, deliver real value.",
  },
];

export function OriginStages() {
  return (
    <div className="grid md:grid-cols-3 gap-6 stage-row">
      {STAGES.map((s, i) => (
        <motion.div key={s.title} {...rise} transition={{ duration: 0.45, delay: i * 0.15 }} className="stage-card p-6">
          <div className="flex items-center justify-between mb-8">
            <span className="stage-icon">
              <s.icon className="w-5 h-5" aria-hidden="true" />
            </span>
            <span className="meta-label">{s.stage}</span>
          </div>
          <h3 className="font-display text-2xl mb-3">{s.title}</h3>
          <p className="text-[15px] leading-snug" style={{ color: "var(--text-secondary)" }}>
            {s.text}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Principles as a switchboard ── */

const PRINCIPLES = [
  { icon: Minimize2, on: "Simplicity", off: "Complexity" },
  { icon: UserRound, on: "Users first", off: "Features first" },
  { icon: BookOpen, on: "Always learning", off: "Standing still" },
  { icon: Handshake, on: "Together", off: "Solo" },
  { icon: Gem, on: "Quality", off: "Quantity" },
];

export function PrincipleSwitches() {
  // Every switch starts on the principle side; visitors can flip them, and they spring back.
  const [flipped, setFlipped] = useState<number | null>(null);

  const flip = (i: number) => {
    setFlipped(i);
    window.setTimeout(() => setFlipped((cur) => (cur === i ? null : cur)), 900);
  };

  return (
    <div className="switchboard">
      {PRINCIPLES.map((p, i) => {
        const off = flipped === i;
        return (
          <motion.button
            key={p.on}
            {...rise}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="switch-row"
            onClick={() => flip(i)}
            aria-label={`${p.on} over ${p.off.toLowerCase()}`}
          >
            <span className="flex items-center gap-3 min-w-0">
              <p.icon className="w-4 h-4 shrink-0" style={{ color: "var(--accent)" }} aria-hidden="true" />
              <span className="font-display text-[15px] sm:text-xl" style={{ opacity: off ? 0.35 : 1 }}>
                {p.on}
              </span>
            </span>
            <span className="toggle" data-off={off} aria-hidden="true">
              <span className="toggle-knob" />
            </span>
            <span className="meta-label text-right hidden sm:block" style={{ opacity: off ? 1 : 0.55 }}>
              {off ? "Nope" : p.off}
            </span>
          </motion.button>
        );
      })}
      <p className="meta-label px-5 py-4" style={{ color: "var(--accent)" }}>
        Try flipping one. They don&apos;t stay off.
      </p>
    </div>
  );
}

/* ── Current focus as potted plants ── */

const POTS: { title: string; note: string; kind: FlowerKind; color: string; h: number }[] = [
  { title: "Real-time data", note: "Processing & visualization", kind: "daisy", color: "var(--petal)", h: 62 },
  { title: "IoT systems", note: "Architecture & integration", kind: "tulip", color: "var(--accent)", h: 54 },
  { title: "Team leadership", note: "Leading & mentoring", kind: "sunflower", color: "", h: 74 },
  { title: "AI / ML", note: "Practical applications", kind: "lavender", color: "var(--lilac)", h: 58 },
  { title: "Modern web", note: "Frameworks & tooling", kind: "sprout", color: "", h: 34 },
];

export function FocusChannels() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {POTS.map((c, i) => (
        <motion.div
          key={c.title}
          {...rise}
          transition={{ duration: 0.4, delay: i * 0.07 }}
          className={`pot-card ${i === POTS.length - 1 ? "col-span-2 lg:col-span-1" : ""}`}
        >
          <svg viewBox="0 0 120 130" className="w-full h-36" aria-hidden="true">
            <Flower
              x={60}
              y={96}
              h={c.h}
              kind={c.kind}
              color={c.color}
              delay={i * 0.12}
              scale={c.kind === "sprout" ? 1.3 : 1}
            />
            <path
              d="M34 92 h52 l-7 32 h-38z"
              fill="var(--accent)"
              stroke="var(--text-primary)"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <rect
              x="30"
              y="86"
              width="60"
              height="10"
              rx="3"
              fill="var(--accent)"
              stroke="var(--text-primary)"
              strokeWidth="1.5"
            />
          </svg>
          <div className="px-4 pb-4">
            <div className="font-display text-lg mb-1" style={{ lineHeight: 1.1 }}>
              {c.title}
            </div>
            <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {c.note}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Beyond code ── */

const BEYOND = [
  { icon: GitBranch, title: "Open source", text: "Contributing back." },
  { icon: MessagesSquare, title: "Community", text: "Sharing what I learn." },
  { icon: Scale, title: "Balance", text: "Time to reflect and grow." },
];

export function BeyondCode() {
  return (
    <div className="grid lg:grid-cols-12 gap-6">
      <div className="lg:col-span-5 grid gap-4">
        {BEYOND.map((b, i) => (
          <motion.div
            key={b.title}
            {...rise}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="stage-card p-5 flex items-center gap-4"
          >
            <span className="stage-icon">
              <b.icon className="w-5 h-5" aria-hidden="true" />
            </span>
            <div>
              <div className="font-display text-lg mb-1">{b.title}</div>
              <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {b.text}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.figure
        {...rise}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="lg:col-span-7 farm-card p-7 md:p-10"
      >
        <Sprout className="w-8 h-8 mb-6" style={{ color: "var(--accent)" }} aria-hidden="true" />
        <blockquote className="font-display text-xl md:text-[1.7rem]" style={{ lineHeight: 1.2 }}>
          One day I&apos;ll trade my keyboard for a watering can.
        </blockquote>
        <figcaption className="mt-5 text-[15px] leading-snug" style={{ color: "var(--text-secondary)" }}>
          A small farm, a rocking chair, a cat, a dog, the smell of flowers, and a horizon that asks nothing of me.
        </figcaption>
        <Link href="/artifacts/farm" className="btn-ghost mt-8">
          Play Little Farm <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </motion.figure>
    </div>
  );
}

/* ── Future vision as a route between three planets ── */

const DESTINATIONS = [
  {
    icon: Compass,
    title: "Software architect",
    text: "Bridge technical excellence and business value.",
    color: "var(--accent)",
  },
  { icon: Users, title: "Mentor", text: "Help the next generation of developers.", color: "var(--accent-2)" },
  { icon: Rocket, title: "Founder", text: "A company that solves real-world problems.", color: "var(--accent-3)" },
];

export function Destinations() {
  return (
    <div className="route">
      <motion.div
        className="route-line"
        initial={{ scaleX: 0, scaleY: 0 }}
        whileInView={{ scaleX: 1, scaleY: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
        aria-hidden="true"
      />
      {DESTINATIONS.map((d, i) => (
        <motion.div
          key={d.title}
          className="route-stop"
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45, delay: 0.3 + i * 0.4 }}
        >
          <span
            className="planet"
            style={{ background: `radial-gradient(circle at 30% 28%, #fff8ec55, transparent 45%), ${d.color}` }}
          >
            <d.icon className="w-6 h-6" aria-hidden="true" />
          </span>
          <div>
            <div className="meta-label mb-2">Destination {i + 1}</div>
            <h3 className="font-display text-xl mb-2">{d.title}</h3>
            <p className="text-sm leading-snug" style={{ color: "var(--text-secondary)" }}>
              {d.text}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
