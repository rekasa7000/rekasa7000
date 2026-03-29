import { useEffect, useState } from "react";

type Phase = "typing" | "pausing" | "done";

interface TypewriterState {
  displayedLines: string[];
  currentLine: string;
  phase: Phase;
}

export function useTypewriter(lines: string[], speed = 45, pauseMs = 600) {
  const [state, setState] = useState<TypewriterState>({
    displayedLines: [],
    currentLine: "",
    phase: "typing",
  });

  useEffect(() => {
    let lineIndex = 0;
    let charIndex = 0;
    let timeout: ReturnType<typeof setTimeout>;

    const type = () => {
      if (lineIndex >= lines.length) {
        setState((s) => ({ ...s, phase: "done" }));
        return;
      }

      const target = lines[lineIndex];

      if (charIndex <= target.length) {
        setState((s) => ({ ...s, currentLine: target.slice(0, charIndex), phase: "typing" }));
        charIndex++;
        timeout = setTimeout(type, speed);
      } else {
        setState((s) => ({
          displayedLines: [...s.displayedLines, target],
          currentLine: "",
          phase: "pausing",
        }));
        lineIndex++;
        charIndex = 0;
        timeout = setTimeout(type, pauseMs);
      }
    };

    timeout = setTimeout(type, 300);
    return () => clearTimeout(timeout);
  }, []);

  return state;
}
