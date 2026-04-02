"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTypewriter } from "@/hooks/use-typewriter";
import { BlinkingCursor } from "@/components/blinking-cursor";

// ── Filesystem ────────────────────────────────────────────────────────────────

type FSFile = { type: "file"; content: string[] };
type FSDir = { type: "dir"; children: Record<string, FSNode> };
type FSNode = FSFile | FSDir;

const FILESYSTEM: FSDir = {
  type: "dir",
  children: {
    "about.md": {
      type: "file",
      content: [
        "# Regee Casaña",
        "",
        "Software Engineer · Full-stack Developer · Software Architect",
        "",
        "Based in the Philippines. Building web products that people",
        "actually enjoy using. Obsessed with clean code and good UX.",
        "",
        "Contact: regeecasana57@gmail.com",
      ],
    },
    "skills.json": {
      type: "file",
      content: [
        "{",
        '  "languages":   ["TypeScript", "JavaScript", "Python", "Go", "C#"],',
        '  "frontend":    ["React", "Next.js", "Tailwind CSS", "Framer Motion"],',
        '  "backend":     ["Node.js", "Express", "NestJS", "FastAPI"],',
        '  "databases":   ["PostgreSQL", "MongoDB", "Redis", "Supabase"],',
        '  "devops":      ["Docker", "Vercel", "GitHub Actions", "AWS"],',
        '  "currently":   "leveling up on systems design"',
        "}",
      ],
    },
    "contact.txt": {
      type: "file",
      content: [
        "email     regeecasana57@gmail.com",
        "github    github.com/rekasa7000",
        "linkedin  linkedin.com/in/regeecasana",
        "",
        'run "sudo hire regee" if you like what you see.',
      ],
    },
    "fun-facts.txt": {
      type: "file",
      content: [
        "1. I once fixed a prod bug at 3am and felt nothing.",
        "2. My commit messages are better than most people's essays.",
        "3. I type 90+ wpm. Yes, I counted.",
        "4. I named a variable 'potato' once. It shipped.",
        "5. This portfolio has more easter eggs than you've found.",
      ],
    },
    projects: {
      type: "dir",
      children: {
        "rekasa7000.md": {
          type: "file",
          content: [
            "# rekasa7000 — Personal Portfolio",
            "",
            "The one you're looking at right now.",
            "",
            "Stack: Next.js 16 · React 19 · TypeScript · Tailwind v4",
            "       Framer Motion 12 · Supabase Realtime",
            "",
            "Features:",
            "  - Interactive terminal with fake filesystem (meta, right?)",
            "  - Visitor spy scan on first load",
            "  - Live multiplayer cursors",
            "  - Dev mode, matcha mode easter eggs",
            "  - Artifacts: piano, matrix rain, snake",
          ],
        },
        "README.md": {
          type: "file",
          content: [
            "projects/",
            "",
            "  rekasa7000.md   — this portfolio",
            "",
            "More projects visible in the Selected Works section above.",
            'Scroll up, or type "cd .." then look around.',
          ],
        },
      },
    },
    artifacts: {
      type: "dir",
      children: {
        "piano.exe": {
          type: "file",
          content: ["Binary. Run with: open piano"],
        },
        "matrix.exe": {
          type: "file",
          content: ["Binary. Run with: open matrix"],
        },
        "snake.exe": {
          type: "file",
          content: ["Binary. Run with: open snake"],
        },
      },
    },
    ".secrets": {
      type: "dir",
      children: {
        "README.md": {
          type: "file",
          content: [
            "you found the hidden directory. nice.",
            "",
            "try:  rekasa7000",
            "      matcha",
            "      strawberry",
            "      sudo hire regee",
          ],
        },
      },
    },
  },
};

function resolvePath(cwd: string[], parts: string[]): string[] | null {
  let cur = [...cwd];
  for (const part of parts) {
    if (part === "." || part === "") continue;
    if (part === "..") {
      if (cur.length > 0) cur.pop();
    } else {
      cur.push(part);
    }
  }
  return cur;
}

function getNode(path: string[]): FSNode | null {
  let node: FSNode = FILESYSTEM;
  for (const seg of path) {
    if (node.type !== "dir") return null;
    const child: FSNode | undefined = node.children[seg];
    if (!child) return null;
    node = child;
  }
  return node;
}

function cwdStr(cwd: string[]): string {
  return cwd.length === 0 ? "/" : "/" + cwd.join("/");
}

// ── Command processor ─────────────────────────────────────────────────────────

const ARTIFACTS = ["piano", "matrix", "snake"] as const;
type Artifact = (typeof ARTIFACTS)[number];
type HistoryEntry = { type: "cmd" | "out"; text: string };

const TERMINAL_LINES = [
  "$ whoami",
  "> Regee Casaña",
  "$ cat role.txt",
  "> Software Engineer; Full-stack Developer; Software Architect",
];

function processCommand(
  cmd: string,
  cwd: string[],
  setCwd: (cwd: string[]) => void,
): { output: string[]; navigate?: string; clear?: boolean } {
  const raw = cmd.trim();
  const t = raw.toLowerCase();
  const [verb, ...args] = raw.trim().split(/\s+/);
  const verbL = verb.toLowerCase();

  if (!t) return { output: [] };

  // ── help ──
  if (t === "help")
    return {
      output: [
        "navigation:",
        "  ls [path]         → list directory",
        "  cat <file>        → read a file",
        "  cd <dir>          → change directory",
        "  pwd               → print working directory",
        "  clear             → clear terminal",
        "",
        "modes:",
        "  rekasa7000        → ???",
        "  matcha            → zen mode",
        "  strawberry        → sweet mode",
        "  galaxy            → 3d space explorer",
        "  exit              → leave current mode",
        "",
        "artifacts:",
        "  list artifacts    → show interactive demos",
        "  open <name>       → launch a demo",
        "",
        "other:",
        "  whoami            → who am I",
        "  sudo hire regee   → make a good decision",
        "  man regee         → the manual",
      ],
    };

  // ── whoami ──
  if (t === "whoami")
    return { output: ["Regee Casaña — Software Engineer · Full-stack Developer · Software Architect"] };

  // ── pwd ──
  if (t === "pwd") return { output: [cwdStr(cwd)] };

  // ── ls ──
  if (verbL === "ls") {
    const targetPath = args[0] ? resolvePath(cwd, args[0].split("/")) : cwd;
    if (!targetPath) return { output: ["ls: invalid path"] };
    const node = getNode(targetPath);
    if (!node) return { output: [`ls: ${args[0] ?? "/"}: no such directory`] };
    if (node.type === "file") return { output: [args[0] ?? cwdStr(cwd)] };
    const entries = Object.keys(node.children).map((name) => {
      const child: FSNode = node.children[name];
      return child.type === "dir" ? `${name}/` : name;
    });
    return { output: entries.length ? entries : ["(empty)"] };
  }

  // ── cd ──
  if (verbL === "cd") {
    const target = args[0] ?? "";
    if (!target || target === "~") {
      setCwd([]);
      return { output: [] };
    }
    const newPath = resolvePath(cwd, target.split("/"));
    if (!newPath) return { output: [`cd: ${target}: invalid path`] };
    const node = getNode(newPath);
    if (!node) return { output: [`cd: ${target}: no such directory`] };
    if (node.type === "file") return { output: [`cd: ${target}: not a directory`] };
    setCwd(newPath);
    return { output: [] };
  }

  // ── cat ──
  if (verbL === "cat") {
    if (!args[0]) return { output: ["usage: cat <file>"] };
    const filePath = resolvePath(cwd, args[0].split("/"));
    if (!filePath) return { output: [`cat: ${args[0]}: no such file`] };
    const node = getNode(filePath);
    if (!node) return { output: [`cat: ${args[0]}: no such file`] };
    if (node.type === "dir") return { output: [`cat: ${args[0]}: is a directory`] };
    return { output: node.content };
  }

  // ── clear ──
  if (t === "clear") return { output: [], clear: true };

  // ── exit ──
  if (t === "exit") {
    setTimeout(() => window.dispatchEvent(new CustomEvent("exit-mode")), 200);
    return { output: ["exiting mode...", "returned to normal."] };
  }

  // ── easter eggs ──
  if (t === "rekasa7000") {
    setTimeout(() => window.dispatchEvent(new CustomEvent("rekasa-easter-egg")), 400);
    return {
      output: [
        "████████████████████████████████",
        "█                              █",
        "█   ACCESS GRANTED             █",
        "█   USER: rekasa7000           █",
        "█   CLEARANCE: DEVELOPER       █",
        "█                              █",
        "████████████████████████████████",
        "initializing developer mode...",
      ],
    };
  }

  if (t === "matcha") {
    setTimeout(() => window.dispatchEvent(new CustomEvent("matcha-mode")), 400);
    return {
      output: [
        "░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░",
        "░  抹茶モード                 ░",
        "░  matcha mode activated      ░",
        "░  一期一会                   ░",
        "░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░",
        "this moment, only once.",
      ],
    };
  }

  if (t === "galaxy") {
    setTimeout(() => window.dispatchEvent(new CustomEvent("galaxy-mode")), 300);
    return {
      output: [
        "  ★ . · ✦  . · ★ . · ✦  . · ★",
        "       initiating galaxy mode       ",
        "  ✦ . · ★ . · ✦  . · ★ . · ✦  .",
        "",
        "  planets = work experience",
        "  asteroids = skills & languages",
        "",
        "  drag to explore · click planets",
      ],
    };
  }

  if (t === "strawberry") {
    setTimeout(() => window.dispatchEvent(new CustomEvent("strawberry-mode")), 400);
    return {
      output: [
        "🍓🍓🍓🍓🍓🍓🍓🍓🍓🍓🍓🍓🍓🍓🍓🍓",
        "🍓                            🍓",
        "🍓   いちごモード              🍓",
        "🍓   strawberry mode          🍓",
        "🍓   あまい — so sweet        🍓",
        "🍓                            🍓",
        "🍓🍓🍓🍓🍓🍓🍓🍓🍓🍓🍓🍓🍓🍓🍓🍓",
      ],
    };
  }

  // ── sudo hire regee ──
  if (t === "sudo hire regee" || t === "sudo hire") {
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("hire-confetti"));
      window.open("mailto:regeecasana57@gmail.com?subject=Let's Work Together", "_blank");
    }, 600);
    return {
      output: [
        "[sudo] password for recruiter: ••••••••",
        "",
        "✓ identity verified",
        "✓ portfolio reviewed",
        "✓ decision: excellent",
        "",
        "launching email client...",
        "welcome to the team. you made the right call.",
      ],
    };
  }

  // ── man regee ──
  if (t === "man regee") {
    return {
      output: [
        "REGEE(1)              User Commands              REGEE(1)",
        "",
        "NAME",
        "       regee — software engineer, full-stack developer",
        "",
        "SYNOPSIS",
        "       regee [--hire] [--project <idea>] [--coffee]",
        "",
        "DESCRIPTION",
        "       Regee is a software engineer based in the Philippines.",
        "       Ships clean code, obsesses over UX, and types 90+ wpm.",
        "",
        "OPTIONS",
        "       --hire        open email client and make a good decision",
        "       --project     describe your idea, get a proposal",
        "       --coffee      always yes",
        "",
        "BUGS",
        "       None known. Any bugs are features.",
        "",
        "SEE ALSO",
        "       sudo hire regee, cat about.md, cat contact.txt",
      ],
    };
  }

  // ── artifacts ──
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

  const openMatch = t.match(/^open\s+(\w+)$/);
  const artifact = openMatch ? openMatch[1] : ARTIFACTS.includes(t as Artifact) ? t : null;
  if (artifact) {
    if (ARTIFACTS.includes(artifact as Artifact))
      return { output: [`launching ${artifact}...`], navigate: `/artifacts/${artifact}` };
    return { output: [`"${artifact}" not found — try "list artifacts"`] };
  }

  return { output: [`command not found: "${raw}" — try "help"`] };
}

// ── Component ─────────────────────────────────────────────────────────────────

export function TerminalHero() {
  const { displayedLines, currentLine, phase } = useTypewriter(TERMINAL_LINES, 40, 500);
  const router = useRouter();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [input, setInput] = useState("");
  const [cwd, setCwd] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const handleSubmit = useCallback(() => {
    const cmd = input.trim();
    if (!cmd) {
      setInput("");
      return;
    }

    const prompt = `[${cwdStr(cwd)}]$ ${cmd}`;
    const { output, navigate, clear } = processCommand(cmd, cwd, setCwd);

    if (clear) {
      setHistory([]);
      setInput("");
      return;
    }

    setHistory((h) => [
      ...h,
      { type: "cmd", text: prompt },
      ...output.map((line) => ({ type: "out" as const, text: line ? `  ${line}` : "" })),
    ]);
    setInput("");
    if (navigate) setTimeout(() => router.push(navigate), 400);
  }, [input, cwd, router]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [history, displayedLines]);

  const prompt = `[${cwdStr(cwd)}]$`;

  return (
    <div
      className="w-full rounded-md overflow-hidden border font-mono text-sm md:text-base cursor-text"
      style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-primary)" }}
      onClick={() => inputRef.current?.focus({ preventScroll: true })}
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
            try &quot;help&quot; or &quot;ls&quot;
          </span>
        )}
      </div>

      {/* Body */}
      <div ref={bodyRef} className="px-5 py-4 space-y-0.5 min-h-40 md:min-h-50 max-h-80 overflow-y-auto">
        {/* Typewriter intro */}
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

        {/* Command history */}
        {phase === "done" &&
          history.map((entry, i) => (
            <div
              key={`h-${i}`}
              className={entry.type === "cmd" ? "neon-accent" : ""}
              style={entry.type === "out" ? { color: "var(--text-secondary)" } : {}}
            >
              {entry.text || "\u00a0"}
            </div>
          ))}

        {/* Prompt */}
        {phase === "done" && (
          <div className="neon-accent flex items-center">
            <span className="shrink-0">{prompt}&nbsp;</span>
            <span>{input}</span>
            <BlinkingCursor className="ml-px" />
          </div>
        )}
      </div>

      {/* Hidden input outside scroll container so browser doesn't scroll on focus */}
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
  );
}
