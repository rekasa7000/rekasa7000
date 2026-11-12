"use client";

/**
 * Hero instrument: a striped retro sun with two orbit rings and a satellite.
 * Pure SVG + CSS animation; motion stops under prefers-reduced-motion.
 */
export function OrbitDiagram({ className = "" }: { className?: string }) {
  const stripes = [0.58, 0.67, 0.75, 0.82, 0.88];

  return (
    <svg viewBox="0 0 400 400" className={className} role="img" aria-label="Orbital diagram">
      <defs>
        <linearGradient id="sun-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent-3)" />
          <stop offset="100%" stopColor="var(--accent)" />
        </linearGradient>
        <mask id="sun-stripes">
          <rect width="400" height="400" fill="#fff" />
          {stripes.map((y, i) => (
            <rect key={y} x="0" y={110 + 180 * y} width="400" height={2 + i * 1.6} fill="#000" />
          ))}
        </mask>
      </defs>

      {/* Coordinate frame */}
      <g stroke="var(--text-tertiary)" strokeWidth="1" opacity="0.5">
        <line x1="200" y1="8" x2="200" y2="392" strokeDasharray="2 6" />
        <line x1="8" y1="200" x2="392" y2="200" strokeDasharray="2 6" />
      </g>
      <circle cx="200" cy="200" r="188" fill="none" stroke="var(--text-tertiary)" strokeOpacity="0.35" />
      {Array.from({ length: 72 }).map((_, i) => {
        const a = (i * 5 * Math.PI) / 180;
        const long = i % 6 === 0;
        const r1 = 188;
        const r2 = long ? 176 : 182;
        return (
          <line
            key={i}
            x1={(200 + r1 * Math.cos(a)).toFixed(2)}
            y1={(200 + r1 * Math.sin(a)).toFixed(2)}
            x2={(200 + r2 * Math.cos(a)).toFixed(2)}
            y2={(200 + r2 * Math.sin(a)).toFixed(2)}
            stroke="var(--text-tertiary)"
            strokeOpacity={long ? 0.8 : 0.4}
          />
        );
      })}

      {/* Outer slow ring with a small moon */}
      <g className="orbit-spin slow">
        <ellipse
          cx="200"
          cy="200"
          rx="160"
          ry="160"
          fill="none"
          stroke="var(--text-primary)"
          strokeOpacity="0.25"
          strokeDasharray="1 7"
          strokeLinecap="round"
          strokeWidth="2"
        />
        <circle cx="360" cy="200" r="6" fill="var(--accent-2)" />
      </g>

      {/* Tilted ring: back arc behind the sun, front arc over it */}
      <g transform="rotate(-22 200 200)" fill="none" stroke="var(--text-primary)" strokeWidth="2">
        <path d="M50 200 A150 38 0 0 1 350 200" strokeOpacity="0.45" />
      </g>

      {/* Sun */}
      <circle cx="200" cy="200" r="90" fill="url(#sun-fill)" mask="url(#sun-stripes)" />

      <g transform="rotate(-22 200 200)" fill="none" stroke="var(--text-primary)" strokeWidth="2">
        <path d="M50 200 A150 38 0 0 0 350 200" />
      </g>

      {/* Satellite on a circular track */}
      <g className="orbit-spin" style={{ animationDuration: "14s" }}>
        <circle cx="200" cy="58" r="7" fill="var(--text-primary)" />
        <circle cx="200" cy="58" r="13" fill="none" stroke="var(--text-primary)" strokeOpacity="0.4" />
      </g>

      {/* Labels */}
      <g fontFamily="var(--font-space-mono), monospace" fontSize="10" letterSpacing="1.4" fill="var(--text-tertiary)">
        <text x="210" y="24">
          000°
        </text>
        <text x="350" y="194">
          090°
        </text>
        <text x="210" y="384">
          180°
        </text>
        <text x="20" y="194">
          270°
        </text>
      </g>
    </svg>
  );
}
