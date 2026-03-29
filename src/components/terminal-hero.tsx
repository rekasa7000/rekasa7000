"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTypewriter } from "@/hooks/use-typewriter";
import { BlinkingCursor } from "@/components/blinking-cursor";

const ARTIFACTS = ["piano", "matrix", "snake"] as const;
type Artifact = (typeof ARTIFACTS)[number];
type HistoryEntry = { type: "cmd" | "out"; text: string };

const TERMINAL_LINES = [
  "$ whoami",
  "> Regee Casaña",
  "$ cat role.txt",
  "> Software Engineer; Full-stack Developer; Software Architect",
];

function processCommand(cmd: string): { output: string[]; navigate?: string; clear?: boolean } {
  const t = cmd.trim().toLowerCase();
  if (!t) return { output: [] };

  if (t === "help")
    return {
      output: [
        "available commands:",
        "  whoami            → who am I",
        "  list artifacts    → browse interactive demos",
        "  open [name]       → launch a demo",
        "  clear             → clear terminal",
      ],
    };

  if (t === "whoami") return { output: ["Regee Casaña — Software Engineer; Full-stack Developer; Software Architect"] };

  if (t === "list artifacts" || t === "artifacts" || t === "ls artifacts")
    return {
      output: [
        "artifacts/",
        "  piano   → play piano with your keyboard",
        "  matrix  → matrix digital rain",
        "  snake   → classic snake game",
        'type "open [name]" to launch',
      ],
    };

  if (t === "clear") return { output: [], clear: true };

  const openMatch = t.match(/^open\s+(\w+)$/);
  const artifact = openMatch ? openMatch[1] : ARTIFACTS.includes(t as Artifact) ? t : null;

  if (artifact) {
    if (ARTIFACTS.includes(artifact as Artifact))
      return { output: [`launching ${artifact}...`], navigate: `/artifacts/${artifact}` };
    return { output: [`"${artifact}" not found — try "list artifacts"`] };
  }

  return { output: [`command not found: "${t}" — try "help"`] };
}

export function TerminalHero() {
  const { displayedLines, currentLine, phase } = useTypewriter(TERMINAL_LINES, 40, 500);
  const router = useRouter();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const handleSubmit = useCallback(() => {
    const cmd = input.trim();
    if (!cmd) {
      setInput("");
      return;
    }
    const { output, navigate, clear } = processCommand(cmd);
    if (clear) {
      setHistory([]);
      setInput("");
      return;
    }
    setHistory((h) => [
      ...h,
      { type: "cmd", text: `$ ${cmd}` },
      ...output.map((line) => ({ type: "out" as const, text: `> ${line}` })),
    ]);
    setInput("");
    if (navigate) setTimeout(() => router.push(navigate), 400);
  }, [input, router]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [history, displayedLines]);

  return (
    <div
      className="w-full rounded-md overflow-hidden border font-mono text-sm md:text-base cursor-text"
      style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-primary)" }}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Title bar */}
      <div
        className="flex items-center gap-2 px-4 py-3 border-b select-none"
        style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-secondary)" }}
      >
        <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
        <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
        <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
        <span className="ml-4 text-xs" style={{ color: "var(--text-secondary)" }}>
          ~/portfolio — bash
        </span>
        {phase === "done" && (
          <span className="ml-auto text-xs opacity-50" style={{ color: "var(--text-secondary)" }}>
            interactive · try &quot;help&quot;
          </span>
        )}
      </div>

      {/* Terminal body */}
      <div ref={bodyRef} className="px-5 py-4 space-y-1 min-h-40 md:min-h-50 max-h-80 overflow-y-auto">
        {displayedLines.map((line, i) => (
          <div
            key={`tw-${i}`}
            className={line.startsWith("$") ? "neon-accent" : ""}
            style={line.startsWith(">") ? { color: "var(--text-primary)" } : {}}
          >
            {line}
          </div>
        ))}
        {phase !== "done" && (
          <div className={currentLine.startsWith("$") ? "neon-accent" : ""}>
            {currentLine}
            <BlinkingCursor className="ml-0.5" />
          </div>
        )}

        {phase === "done" &&
          history.map((entry, i) => (
            <div
              key={`h-${i}`}
              className={entry.type === "cmd" ? "neon-accent" : ""}
              style={entry.type === "out" ? { color: "var(--text-secondary)" } : {}}
            >
              {entry.text}
            </div>
          ))}

        {phase === "done" && (
          <div className="neon-accent flex items-center">
            <span>$ </span>
            <span className="ml-2">{input}</span>
            <BlinkingCursor className="ml-px" />
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
              className="sr-only"
              autoFocus
              autoComplete="off"
              spellCheck={false}
              aria-label="terminal input"
            />
          </div>
        )}
      </div>
    </div>
  );
}
