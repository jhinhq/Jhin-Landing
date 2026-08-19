"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Pastel Skies, weighted toward the saturated end so blocks read colorful
const PALETTE = [
  "#7371fc", "#7371fc",
  "#a594f9", "#a594f9", "#a594f9",
  "#cdc1ff", "#cdc1ff",
  "#e5d9f2", "#f5efff",
];

// --- Assembly target: the Jhin tetris-J, voxelized -------------------------
// 4 cells (3-stack + foot), each subdivided into 2x2x2 sub-cubes = 32 voxels,
// laid out in the cube lattice and rotated to the logo's isometric view.
const CELLS: Array<[number, number]> = [
  [0, 0],
  [0, 1],
  [0, 2],
  [-1, 0],
];
const CELL = 1.2; // lattice pitch
const SUB = 0.6; // sub-cube pitch inside a cell
const VOX = 0.585; // final world size of each voxel (hairline gaps)
const ISO = new THREE.Euler(Math.PI / 5.1, Math.PI / 4, 0);

function buildTargets(): THREE.Vector3[] {
  const t: THREE.Vector3[] = [];
  for (const [gx, gy] of CELLS) {
    for (const sx of [-0.5, 0.5]) {
      for (const sy of [-0.5, 0.5]) {
        for (const sz of [-0.5, 0.5]) {
          t.push(
            new THREE.Vector3(
              gx * CELL + sx * SUB,
              gy * CELL + sy * SUB,
              sz * SUB
            ).applyEuler(ISO)
          );
        }
      }
    }
  }
  const c = t
    .reduce((v, p) => v.add(p), new THREE.Vector3())
    .multiplyScalar(1 / t.length);
  t.forEach((p) => p.sub(c).add(new THREE.Vector3(0, 0.15, 0)));
  return t;
}

type CubeData = {
  mesh: THREE.Mesh;
  scatter: THREE.Vector3;
  target: THREE.Vector3;
  targetScale: number;
  order: number; // 0..1 stagger position
  speed: number;
  phase: number;
  spin: number;
};

const smooth = (x: number) => x * x * (3 - 2 * x);
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

export default function HeroScene() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 1.2, 13);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "low-power",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // lights
    const ambient = new THREE.AmbientLight(0xffffff, 1.05);
    const dir = new THREE.DirectionalLight(0xffffff, 1.6);
    dir.position.set(4, 8, 6);
    const fill = new THREE.DirectionalLight(0xcdc1ff, 0.6);
    fill.position.set(-6, -2, 4);
    scene.add(ambient, dir, fill);

    const group = new THREE.Group();
    scene.add(group);

    const targets = buildTargets();
    const COUNT = targets.length;

    const cubes: CubeData[] = [];
    const positions: THREE.Vector3[] = [];
    const rng = (min: number, max: number) => min + Math.random() * (max - min);

    for (let i = 0; i < COUNT; i++) {
      const size = rng(0.24, 0.62);

      // keep a clear zone behind the headline: reject positions inside the
      // text ellipse (unless they sit far back in z)
      let x = 0,
        y = 0,
        z = 0,
        tries = 0;
      do {
        x = rng(-9, 9);
        y = rng(-3.4, 3.8);
        z = rng(-4.5, 2);
        tries++;
      } while (
        tries < 40 &&
        Math.pow(x / 5.4, 2) + Math.pow((y - 0.3) / 3.4, 2) < 1 &&
        z > -2.5
      );

      const color = new THREE.Color(
        PALETTE[Math.floor(Math.random() * PALETTE.length)]
      );
      const mat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.5,
        metalness: 0.08,
        emissive: color,
        emissiveIntensity: 0.12,
      });
      const geo = new THREE.BoxGeometry(size, size, size);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      mesh.rotation.set(ISO.x, ISO.y, 0);

      group.add(mesh);
      positions.push(mesh.position);
      cubes.push({
        mesh,
        scatter: new THREE.Vector3(x, y, z),
        target: new THREE.Vector3(), // assigned below
        targetScale: VOX / size,
        order: 0,
        speed: rng(0.15, 0.4),
        phase: rng(0, Math.PI * 2),
        spin: rng(-0.06, 0.06),
      });
    }

    // pair cubes with voxel targets top-to-bottom to minimize path crossing
    const cubeIdx = cubes
      .map((c, i) => i)
      .sort((a, b) => cubes[b].scatter.y - cubes[a].scatter.y);
    const targIdx = targets
      .map((t, i) => i)
      .sort((a, b) => targets[b].y - targets[a].y);
    cubeIdx.forEach((ci, k) => {
      cubes[ci].target.copy(targets[targIdx[k]]);
      cubes[ci].order = k / (COUNT - 1);
    });

    // connective lines between near neighbours — the "org network"
    const linePositions: number[] = [];
    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        if (positions[i].distanceTo(positions[j]) < 3.4) {
          linePositions.push(
            positions[i].x, positions[i].y, positions[i].z,
            positions[j].x, positions[j].y, positions[j].z
          );
        }
      }
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(linePositions, 3)
    );
    const lineMat = new THREE.LineBasicMaterial({
      color: new THREE.Color("#7371fc"),
      transparent: true,
      opacity: 0.08,
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    group.add(lines);
    let lineBase = 0.08;

    // theme awareness
    const applyTheme = () => {
      const dark = document.documentElement.classList.contains("dark");
      lineMat.color.set(dark ? "#cdc1ff" : "#7371fc");
      lineBase = dark ? 0.07 : 0.08;
      ambient.intensity = dark ? 0.75 : 1.05;
      dir.intensity = dark ? 1.15 : 1.6;
    };
    applyTheme();
    const observer = new MutationObserver(applyTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // scroll-driven assembly progress (0 scattered → 1 assembled J)
    let targetA = 0;
    let a = 0;
    let st: ScrollTrigger | null = null;
    if (!reduced) {
      st = ScrollTrigger.create({
        trigger: container.closest("section") ?? container,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          targetA = self.progress;
        },
      });
    }

    // mouse parallax (softened)
    const target = { x: 0, y: 0 };
    const onPointer = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let raf = 0;
    let running = true;

    const render = () => {
      const t = clock.getElapsedTime();
      if (!reduced) {
        a += (targetA - a) * 0.09;

        for (const c of cubes) {
          // per-cube staggered progress
          const ai = smooth(clamp01(a * 1.45 - c.order * 0.45));
          const inv = 1 - ai;

          const bob = Math.sin(t * c.speed + c.phase) * 0.2 * inv;
          c.mesh.position.set(
            c.scatter.x + (c.target.x - c.scatter.x) * ai,
            c.scatter.y + (c.target.y - c.scatter.y) * ai + bob,
            c.scatter.z + (c.target.z - c.scatter.z) * ai
          );
          c.mesh.rotation.y = ISO.y + t * c.spin * inv;
          const s = 1 + (c.targetScale - 1) * ai;
          c.mesh.scale.setScalar(s);
        }

        lineMat.opacity = lineBase * (1 - clamp01(a * 2));
        lines.visible = a < 0.5;

        group.rotation.y = Math.sin(t * 0.05) * 0.08;
        camera.position.x += (target.x * 0.7 - camera.position.x) * 0.04;
        camera.position.y += (1.2 - target.y * 0.5 - camera.position.y) * 0.04;
        camera.lookAt(0, 0, 0);
      }
      renderer.render(scene, camera);
      if (running && !reduced) raf = requestAnimationFrame(render);
    };

    if (reduced) {
      render(); // single static frame
    } else {
      raf = requestAnimationFrame(render);
    }

    // pause when offscreen
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        if (!reduced) raf = requestAnimationFrame(render);
      } else if (!entry.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(container);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      observer.disconnect();
      st?.kill();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      cubes.forEach((c) => {
        c.mesh.geometry.dispose();
        (c.mesh.material as THREE.Material).dispose();
      });
      container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="absolute inset-0 opacity-[0.62] dark:opacity-55"
    />
  );
}
