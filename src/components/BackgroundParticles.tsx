"use client";

import React, { useCallback } from "react";
import Particles from "react-tsparticles";
import type { Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";

export default function BackgroundParticles() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <Particles
        id="ishaform-bg"
        init={particlesInit}
        options={{
          fullScreen: false,
          background: { color: "transparent" },
          detectRetina: true,
          fpsLimit: 60,
          interactivity: {
            events: {
              onHover: { enable: true, mode: "repulse" },
              resize: true,
            },
            modes: {
              repulse: { distance: 120, duration: 0.4 },
            },
          },
          particles: {
            number: { value: 70, density: { enable: true, area: 800 } },
            color: { value: ["#8b5cf6", "#a78bfa", "#ec4899", "#22d3ee"] },
            links: { enable: true, color: "#a78bfa", distance: 150, opacity: 0.3, width: 1 },
            move: {
              enable: true,
              speed: 0.6,
              direction: "none",
              outModes: { default: "out" },
            },
            opacity: { value: 0.5 },
            size: { value: { min: 1, max: 3 } },
          },
        }}
      />
    </div>
  );
}
