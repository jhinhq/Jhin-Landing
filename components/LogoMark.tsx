"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

// Isometric cube geometry matching the original logo's proportions
const HW = 15.1; // half width of the top diamond
const DH = 8.8; // half height of the top diamond
const DF = 17.6; // full height of the top diamond
const SH = 18.7; // side face height

function faces(cx: number, y: number) {
  return {
    top: `${cx},${y} ${cx + HW},${y + DH} ${cx},${y + DF} ${cx - HW},${y + DH}`,
    left: `${cx - HW},${y + DH} ${cx},${y + DF} ${cx},${y + DF + SH} ${
      cx - HW
    },${y + DH + SH}`,
    right: `${cx + HW},${y + DH} ${cx},${y + DF} ${cx},${y + DF + SH} ${
      cx + HW
    },${y + DH + SH}`,
  };
}

// Render order: back column bottom→top, foot cube in front.
const CUBES = [
  { cx: 58.6, y: 46.3, top: "#ece2fa", right: "#a594f9", left: "#7371fc", sx: 7, sy: 10, r: 12 },
  { cx: 58.6, y: 27.6, top: "#f0e8fb", right: "#cdc1ff", left: "#7d71f8", sx: 10, sy: 0, r: -14 },
  { cx: 58.6, y: 8.9, top: "#f5efff", right: "#e5d9f2", left: "#8a7bf5", sx: 6, sy: -9, r: 16 },
  { cx: 43, y: 55.4, top: "#f0e9fd", right: "#b7a8fc", left: "#7371fc", sx: -10, sy: 8, r: -16 },
];

// Reassembly order: top cube, middle, bottom, then the foot clicks in last.
const ORDER = [2, 1, 0, 3];

export default function LogoMark({ className = "" }: { className?: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const trigger = svg.closest("a") ?? svg;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const play = () => {
      if (reduced) return;
      if (tlRef.current?.isActive()) return;
      const cubes = Array.from(
        svg.querySelectorAll<SVGGElement>("[data-cube]")
      );
      const tl = gsap.timeline();
      tlRef.current = tl;

      // scatter — the J breaks into its cubes
      cubes.forEach((el, i) => {
        const c = CUBES[i];
        tl.to(
          el,
          {
            x: c.sx,
            y: c.sy,
            rotation: c.r,
            transformOrigin: "50% 50%",
            duration: 0.3,
            ease: "power3.out",
          },
          0
        );
      });

      // reassemble — cubes click back into place one by one
      ORDER.forEach((idx, k) => {
        tl.to(
          cubes[idx],
          {
            x: 0,
            y: 0,
            rotation: 0,
            duration: 0.55,
            ease: "back.out(2.4)",
          },
          0.34 + k * 0.08
        );
      });
    };

    trigger.addEventListener("mouseenter", play);
    return () => {
      trigger.removeEventListener("mouseenter", play);
      tlRef.current?.kill();
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="25.5 6 50.5 87.5"
      className={className}
      style={{ overflow: "visible" }}
      role="img"
      aria-label="Jhin logo"
    >
      {CUBES.map((c, i) => {
        const f = faces(c.cx, c.y);
        return (
          <g key={i} data-cube>
            <polygon points={f.top} fill={c.top} />
            <polygon points={f.left} fill={c.left} />
            <polygon points={f.right} fill={c.right} />
            <polygon
              points={f.top}
              fill="none"
              stroke="rgba(90,88,232,0.28)"
              strokeWidth="0.6"
              strokeLinejoin="round"
            />
          </g>
        );
      })}
    </svg>
  );
}
