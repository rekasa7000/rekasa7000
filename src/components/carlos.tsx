import Image from "next/image";

/** Carlos, the site mascot. Draft artwork generated from a description of the real cat. */
const POSES = {
  sitting: {
    w: 531,
    h: 720,
    alt: "Carlos the cat sitting in black sunglasses",
  },
  gardener: { w: 605, h: 720, alt: "Carlos the cat watering an orange flower" },
  oops: {
    w: 619,
    h: 720,
    alt: "Carlos the cat beside a flower pot he knocked over",
  },
  astronaut: {
    w: 602,
    h: 720,
    alt: "Carlos the cat floating in a space suit, holding a flower",
  },
  desk: { w: 687, h: 720, alt: "Carlos the cat typing on a laptop" },
} as const;

export type CarlosPose = keyof typeof POSES;

export function Carlos({
  pose,
  size = 120,
  className = "",
  float = false,
}: {
  pose: CarlosPose;
  size?: number;
  className?: string;
  float?: boolean;
}) {
  const p = POSES[pose];
  return (
    <Image
      src={`/images/carlos/${pose}.webp`}
      alt={p.alt}
      width={p.w}
      height={p.h}
      sizes={`${size}px`}
      className={`carlos ${float ? "carlos-float" : ""} ${className}`}
      style={{ width: size, height: "auto" }}
    />
  );
}

/** Carlos with a speech bubble. */
export function CarlosNote({
  pose,
  children,
  size = 112,
  className = "",
}: {
  pose: CarlosPose;
  children: React.ReactNode;
  size?: number;
  className?: string;
}) {
  return (
    <div className={`carlos-note ${className}`}>
      <Carlos pose={pose} size={size} />
      <p className="carlos-bubble">
        <span className="meta-label carlos-name">Carlos says</span>
        {children}
      </p>
    </div>
  );
}
