"use client";

import { GardenPlanet } from "@/components/showcase/garden";
import { CarbonTree, FirstSprout, LanguageGarden, RainField } from "@/components/showcase/plot-scenes";
import { buildPlanet } from "./planet";
import { buildCarbon, buildLanguages, buildRain, buildSprout } from "./scenes";
import { ThreeStage, type Builder } from "./stage";

/** Hero: the homestead planet in 3D. Drag sideways to spin it. Falls back to the drawn version without WebGL. */
export function Planet3D({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <ThreeStage
        build={buildPlanet}
        draggable
        className="relative w-full aspect-square"
        label="A small planet with a farmhouse, a barn, a windmill, tidy fields and tall flowers. Drag to spin it."
        fallback={<GardenPlanet className="w-full h-full" />}
      />
      <p className="meta-label text-center -mt-2">Drag to spin the planet</p>
    </div>
  );
}

function Scene3D({ build, label, fallback }: { build: Builder; label: string; fallback: React.ReactNode }) {
  return (
    <div className="plot-scene">
      <ThreeStage
        build={build}
        className="absolute inset-0"
        label={label}
        fallback={<div className="absolute inset-0">{fallback}</div>}
      />
      <span className="plot-caption">{label}</span>
    </div>
  );
}

export const Languages3D = () => (
  <Scene3D build={buildLanguages} label="One help desk, 20+ languages in bloom" fallback={<LanguageGarden />} />
);
export const Carbon3D = () => (
  <Scene3D build={buildCarbon} label="A tree that keeps count of carbon" fallback={<CarbonTree />} />
);
export const Rain3D = () => (
  <Scene3D build={buildRain} label="25 stations watching the weather" fallback={<RainField />} />
);
export const Sprout3D = () => (
  <Scene3D build={buildSprout} label="Where it started: the first sprout" fallback={<FirstSprout />} />
);
