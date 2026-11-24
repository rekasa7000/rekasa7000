import Image from "next/image";

type Scene = {
  src: string;
  /** shown as the caption pill */
  label: string;
  alt: string;
  /** where the slow pan starts, as a horizontal position in the picture (0–100) */
  from: number;
  to: number;
  effect?: "rain" | "glow";
};

const SCENES = {
  oneix: {
    src: "/images/scenes/oneix.webp",
    label: "A robot greets you, a person picks up the story",
    alt: "A greenhouse where a friendly robot gardener greets a visitor and hands a glowing flower to a human gardener holding the visitor's notes, while Carlos the cat watches from a stool",
    from: 20,
    to: 92,
    effect: "glow",
  },
  rain: {
    src: "/images/scenes/rain.webp",
    label: "25 stations watching the weather",
    alt: "A farm in the rain with three weather stations sending signals up to a satellite, and Carlos the cat keeping dry under a big leaf",
    from: 12,
    to: 92,
    effect: "rain",
  },
  water: {
    src: "/images/scenes/water.webp",
    label: "41 subbasins, mapped along one river",
    alt: "A river through terraced farmland with water gauges on its banks and droplets rising into a large measuring jar, with Carlos the cat dipping a paw in the water",
    from: 8,
    to: 92,
    effect: "glow",
  },
  music: {
    src: "/images/scenes/music.webp",
    label: "Tap the card, hear the music",
    alt: "A flower field where the flowers are speakers and gramophones, with sound waves flowing to a small lit stage, and Carlos the cat wearing headphones",
    from: 10,
    to: 92,
    effect: "glow",
  },
  carbon: {
    src: "/images/scenes/carbon.webp",
    label: "Smoke in, leaves out",
    alt: "A workshop on a hillside of young trees where chimney smoke turns into green leaves, a gauge pointing to green, and Carlos the cat asleep on the roof",
    from: 14,
    to: 88,
    effect: "glow",
  },
  sprout: {
    src: "/images/scenes/sprout.webp",
    label: "Where it started: the first sprout",
    alt: "A tiny sprout in a pot under a warm lamp on a shed workbench, beside a small circuit board, with Carlos the cat peering over the bench",
    from: 28,
    to: 70,
    effect: "glow",
  },
} satisfies Record<string, Scene>;

/** A painted scene in the plot frame. It pans slowly so the whole picture gets seen in a narrow frame. */
function SceneArt({ scene }: { scene: Scene }) {
  return (
    <div
      className="plot-scene scene-art"
      style={
        {
          "--pan-from": `${scene.from}%`,
          "--pan-to": `${scene.to}%`,
        } as React.CSSProperties
      }
    >
      <Image
        src={scene.src}
        alt={scene.alt}
        fill
        sizes="(min-width: 768px) 1200px, 720px"
        className="scene-art-img"
      />
      {scene.effect === "rain" && (
        <span className="scene-rain" aria-hidden="true" />
      )}
      {scene.effect === "glow" && (
        <span className="scene-glow" aria-hidden="true" />
      )}
      <span className="plot-caption">{scene.label}</span>
    </div>
  );
}

export const OneixArt = () => <SceneArt scene={SCENES.oneix} />;
export const RainArt = () => <SceneArt scene={SCENES.rain} />;
export const WaterArt = () => <SceneArt scene={SCENES.water} />;
export const MusicArt = () => <SceneArt scene={SCENES.music} />;
export const CarbonArt = () => <SceneArt scene={SCENES.carbon} />;
export const SproutArt = () => <SceneArt scene={SCENES.sprout} />;
