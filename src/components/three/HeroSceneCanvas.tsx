"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const HeroScene = dynamic(
  () => import("./HeroScene").then((mod) => mod.HeroScene),
  {
    ssr: false,
    loading: () => null,
  }
);

export function HeroSceneCanvas() {
  return (
    <Suspense fallback={null}>
      <div className="absolute inset-0 h-full w-full">
        <HeroScene />
      </div>
    </Suspense>
  );
}
