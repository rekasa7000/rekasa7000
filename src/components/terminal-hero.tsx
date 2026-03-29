"use client";

import { useTypewriter } from "@/hooks/use-typewriter";
import { BlinkingCursor } from "@/components/blinking-cursor";

const TERMINAL_LINES = [
  "$ whoami",
  "> Regee Casaña  レジー・カサーニャ",
  "$ cat role.txt",
  "> Software Engineer · Full-stack Developer · Technical Architect",
  "$ ls projects/",
  "> kloudtrack  logcha  jobowl  databox  hananai  knowt",
];

export function TerminalHero() {
  const { displayedLines, currentLine, phase } = useTypewriter(TERMINAL_LINES, 40, 500);

  return (
    <div
      className="w-full rounded-md overflow-hidden border font-mono text-sm md:text-base"
      style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-primary)" }}
    >
      {/* Title bar */}
      <div
        className="flex items-center gap-2 px-4 py-3 border-b"
        style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-secondary)" }}
      >
        <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
        <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
        <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
        <span className="ml-4 text-xs" style={{ color: "var(--text-secondary)" }}>
          ~/portfolio — bash
        </span>
      </div>

      {/* Terminal body */}
      <div className="px-5 py-4 space-y-1 min-h-[160px] md:min-h-[200px]">
        {displayedLines.map((line, i) => (
          <div key={i} className={line.startsWith("$") ? "neon-accent" : ""} style={line.startsWith(">") ? { color: "var(--text-primary)" } : {}}>
            {line}
          </div>
        ))}
        {phase !== "done" && (
          <div className={currentLine.startsWith("$") ? "neon-accent" : ""}>
            {currentLine}
            <BlinkingCursor className="ml-0.5" />
          </div>
        )}
        {phase === "done" && (
          <div className="neon-accent">
            $ <BlinkingCursor className="ml-0.5" />
          </div>
        )}
      </div>
    </div>
  );
}
