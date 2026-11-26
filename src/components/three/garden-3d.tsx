"use client";

import Link from "next/link";
import { Rocket } from "lucide-react";
import { GardenPlanet } from "@/components/showcase/garden";
import { CarbonTree, FirstSprout, LanguageGarden, RainField } from "@/components/showcase/plot-scenes";
import { buildPlanet } from "./planet";
import { buildCarbon, buildLanguages, buildMusic, buildRain, buildSprout, buildWater } from "./scenes";
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
      <p className="meta-label planet-hint">Drag to spin the planet</p>
      <Link href="/farm" className="planet-land">
        <Rocket className="w-3.5 h-3.5" /> Land on the farm
      </Link>
    </div>
  );
}

function Scene3D({ build, label, fallback }: { build: Builder; label: string; fallback?: React.ReactNode }) {
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
export const Water3D = () => <Scene3D build={buildWater} label="41 subbasins, mapped along one river" />;
export const Music3D = () => <Scene3D build={buildMusic} label="Tap the card, hear the music" />;
