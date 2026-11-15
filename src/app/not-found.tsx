import Link from "next/link";

/** 404: a wilted flower and a way home. */
export default function NotFound() {
  return (
    <main
      className="min-h-screen grid place-items-center px-6 relative z-10"
      style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      <div className="text-center max-w-md">
        <svg viewBox="0 0 160 170" className="w-40 mx-auto mb-8" role="img" aria-label="A wilted flower in a pot">
          <path
            d="M80 118 C80 86 92 70 108 62 C120 56 124 66 118 76"
            fill="none"
            stroke="var(--leaf-deep)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path d="M84 98 C96 92 106 96 108 104 C98 108 88 106 84 98Z" fill="var(--leaf-2)" />
          <g transform="translate(118 80) rotate(150)">
            {[0, 60, 120, 180, 240, 300].map((a) => (
              <ellipse key={a} cx="0" cy="-13" rx="6" ry="11" fill="var(--petal)" transform={`rotate(${a})`} />
            ))}
            <circle r="7" fill="var(--accent-3)" />
          </g>
          <ellipse cx="128" cy="138" rx="6" ry="3.4" fill="var(--petal)" transform="rotate(20 128 138)" />
          <ellipse cx="34" cy="146" rx="6" ry="3.4" fill="var(--petal)" transform="rotate(-30 34 146)" />
          <path
            d="M52 120 h56 l-7 34 a5 5 0 0 1 -5 4 h-32 a5 5 0 0 1 -5 -4z"
            fill="var(--accent)"
            stroke="var(--text-primary)"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <rect
            x="46"
            y="110"
            width="68"
            height="13"
            rx="4"
            fill="var(--accent)"
            stroke="var(--text-primary)"
            strokeWidth="2"
          />
        </svg>
        <p className="session-tag mb-6">Page not found</p>
        <h1 className="font-display text-4xl md:text-5xl mt-6 mb-5">Nothing grows here.</h1>
        <p className="text-base mb-9" style={{ color: "var(--text-secondary)" }}>
          This page was never planted, or it has been moved to another plot.
        </p>
        <Link href="/" className="btn-ink">
          Back to the garden
        </Link>
      </div>
    </main>
  );
}
