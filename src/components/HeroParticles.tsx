import React, { useEffect, useMemo, useState } from "react";
import Particles, { ParticlesProvider } from "@tsparticles/react";
import type { Engine, ISourceOptions } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { useReducedMotion } from "motion/react";

// Stable module-level registrar required by ParticlesProvider
const registerSlimEngine = async (engine: Engine): Promise<void> => {
  await loadSlim(engine);
};

const HeroParticlesCanvas: React.FC = () => {
  const prefersReduced = useReducedMotion();
  const [isDark, setIsDark] = useState<boolean>(() =>
    typeof document !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : false
  );

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const syncTheme = () => setIsDark(root.classList.contains("dark"));
    syncTheme();

    const observer = new MutationObserver(syncTheme);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const options: ISourceOptions = useMemo(
    () => ({
      fullScreen: { enable: false },
      fpsLimit: 60,
      detectRetina: true,
      background: {
        color: { value: "transparent" },
      },
      interactivity: {
        detectsOn: "parent",
        events: {
          onHover: {
            enable: !prefersReduced,
            mode: "grab",
            parallax: {
              enable: !prefersReduced,
              force: 22,
              smooth: 14,
            },
          },
          onClick: {
            enable: false,
          },
          resize: {
            enable: true,
          },
        },
        modes: {
          grab: {
            distance: 185,
            links: {
              opacity: isDark ? 0.58 : 0.4,
              color: isDark ? "#A3E635" : "#2563EB",
            },
          },
        },
      },
      particles: {
        number: {
          value: 44,
          density: {
            enable: true,
            width: 1200,
            height: 700,
          },
        },
        color: {
          value: isDark
            ? ["#60A5FA", "#A3E635", "#38BDF8"]
            : ["#1D4ED8", "#4D7C0F", "#0284C7"],
        },
        shape: {
          type: "circle",
        },
        opacity: {
          value: { min: isDark ? 0.25 : 0.22, max: isDark ? 0.65 : 0.52 },
          animation: {
            enable: !prefersReduced,
            speed: 0.85,
            sync: false,
          },
        },
        size: {
          value: { min: 1.4, max: 3.1 },
        },
        links: {
          enable: true,
          distance: 155,
          color: isDark ? "#60A5FA" : "#1E40AF",
          opacity: isDark ? 0.24 : 0.16,
          width: 1,
          triangles: {
            enable: true,
            color: isDark ? "#3B82F6" : "#1E40AF",
            opacity: isDark ? 0.035 : 0.022,
          },
        },
        move: {
          enable: !prefersReduced,
          speed: 0.75,
          direction: "none",
          random: false,
          straight: false,
          outModes: {
            default: "bounce",
          },
        },
      },
    }),
    [isDark, prefersReduced]
  );

  return (
    <Particles
      id="hero-digital-particles"
      className="pointer-events-none absolute inset-0 w-full h-full text-transparent select-none"
      options={options}
    />
  );
};

export const HeroParticles: React.FC = () => {
  return (
    <ParticlesProvider init={registerSlimEngine}>
      <HeroParticlesCanvas />
    </ParticlesProvider>
  );
};
