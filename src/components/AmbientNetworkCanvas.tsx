import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

interface NetworkNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  accent: "blue" | "lime";
  phase: number;
}

interface SignalPulse {
  fromIdx: number;
  toIdx: number;
  progress: number;
  speed: number;
  accent: "blue" | "lime";
}

export const AmbientNetworkCanvas: React.FC<{ className?: string }> = ({
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === "undefined") return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let width = 0;
    let height = 0;
    let isDark = document.documentElement.classList.contains("dark");
    let pointer = { x: -9999, y: -9999, active: false };

    const nodes: NetworkNode[] = [];
    const pulses: SignalPulse[] = [];

    const initScene = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      width = rect ? rect.width : window.innerWidth;
      height = rect ? rect.height : 640;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const nodeCount = width < 640 ? 18 : width < 1024 ? 26 : 36;
      nodes.length = 0;
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.34,
          vy: (Math.random() - 0.5) * 0.28,
          radius: i % 5 === 0 ? 2.6 : 1.7,
          accent: i % 4 === 0 ? "lime" : "blue",
          phase: Math.random() * Math.PI * 2,
        });
      }

      pulses.length = 0;
      for (let i = 0; i < 6; i++) {
        pulses.push({
          fromIdx: i % nodeCount,
          toIdx: (i * 3 + 1) % nodeCount,
          progress: Math.random(),
          speed: 0.0045 + Math.random() * 0.004,
          accent: i % 2 === 0 ? "lime" : "blue",
        });
      }
    };

    initScene();

    const themeObserver = new MutationObserver(() => {
      isDark = document.documentElement.classList.contains("dark");
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const handleResize = () => {
      initScene();
    };
    window.addEventListener("resize", handleResize);

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
      ) {
        pointer = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
          active: true,
        };
      } else {
        pointer.active = false;
      }
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    const maxLinkDistance = 165;

    const drawFrame = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      // Move nodes smoothly when motion is enabled
      if (!prefersReduced) {
        for (const node of nodes) {
          node.x += node.vx;
          node.y += node.vy;

          if (node.x < 0 || node.x > width) node.vx *= -1;
          if (node.y < 0 || node.y > height) node.vy *= -1;

          // Gentle subtle drift toward/around pointer
          if (pointer.active) {
            const dx = pointer.x - node.x;
            const dy = pointer.y - node.y;
            const distSq = dx * dx + dy * dy;
            if (distSq > 900 && distSq < 36000) {
              node.x += dx * 0.0018;
              node.y += dy * 0.0018;
            }
          }
        }
      }

      // Draw subtle connecting fiber lines
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.hypot(dx, dy);
          if (dist < maxLinkDistance) {
            const strength = 1 - dist / maxLinkDistance;
            const alpha = isDark ? strength * 0.2 : strength * 0.14;
            ctx.strokeStyle =
              a.accent === "lime" && b.accent === "lime"
                ? `rgba(132, 204, 22, ${alpha})`
                : isDark
                ? `rgba(96, 165, 250, ${alpha})`
                : `rgba(30, 64, 175, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Draw subtle traveling signal packets along nearby nodes
      if (!prefersReduced && nodes.length > 2) {
        for (const pulse of pulses) {
          pulse.progress += pulse.speed;
          if (pulse.progress >= 1) {
            pulse.progress = 0;
            pulse.fromIdx = pulse.toIdx;
            // Pick a nearby destination node if available
            let nextIdx = (pulse.fromIdx + 1) % nodes.length;
            let bestDist = Infinity;
            for (let k = 0; k < nodes.length; k++) {
              if (k === pulse.fromIdx) continue;
              const d = Math.hypot(
                nodes[k].x - nodes[pulse.fromIdx].x,
                nodes[k].y - nodes[pulse.fromIdx].y
              );
              if (d < maxLinkDistance && d > 24 && d < bestDist && Math.random() > 0.35) {
                bestDist = d;
                nextIdx = k;
              }
            }
            pulse.toIdx = nextIdx;
          }

          const from = nodes[pulse.fromIdx];
          const to = nodes[pulse.toIdx];
          const dist = Math.hypot(to.x - from.x, to.y - from.y);
          if (dist < maxLinkDistance * 1.25) {
            const px = from.x + (to.x - from.x) * pulse.progress;
            const py = from.y + (to.y - from.y) * pulse.progress;
            ctx.fillStyle =
              pulse.accent === "lime"
                ? isDark
                  ? "rgba(163, 230, 53, 0.72)"
                  : "rgba(101, 163, 13, 0.6)"
                : isDark
                ? "rgba(96, 165, 250, 0.72)"
                : "rgba(37, 99, 235, 0.62)";
            ctx.beginPath();
            ctx.arc(px, py, 2.1, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Draw nodes with gentle breathing glow
      for (const node of nodes) {
        const pulseScale = prefersReduced
          ? 1
          : 0.85 + 0.25 * Math.sin(time * 0.002 + node.phase);
        const r = node.radius * pulseScale;

        ctx.fillStyle =
          node.accent === "lime"
            ? isDark
              ? "rgba(163, 230, 53, 0.45)"
              : "rgba(101, 163, 13, 0.35)"
            : isDark
            ? "rgba(96, 165, 250, 0.45)"
            : "rgba(30, 64, 175, 0.34)";
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (!prefersReduced) {
        animId = window.requestAnimationFrame(drawFrame);
      }
    };

    animId = window.requestAnimationFrame(drawFrame);

    return () => {
      window.cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      themeObserver.disconnect();
    };
  }, [prefersReduced]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 w-full h-full ${className}`}
    />
  );
};
