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

// --- Anamorphic reveal -----------------------------------------------------
// Every cube sits somewhere along the sight-line its voxel occupies when the
// J is viewed head-on — so from the resting side angle the field looks like
// random chaos. Scrolling swings the camera to the front while each cube
// glides along its own sight-line to its exact voxel: the chaos was the
// organization all along, seen from the wrong angle.
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

// the reveal camera — where the scroll ends and the J lines up
const CAM_END = new THREE.Vector3(0, 1.2, 13);
// the resting camera orbit: azimuth (rad), radius, height
const ORBIT_START = { theta: -1.1, radius: 16, height: 2.6 };
const STAGGER = 0.3; // per-cube offset within the convergence

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
  target: THREE.Vector3; // the voxel this cube resolves to
  dir: THREE.Vector3; // its sight-line from the reveal camera
  depth: number; // resting offset along that sight-line
  restSize: number; // world size at rest (subtends one voxel from CAM_END)
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
    camera.position.set(
      Math.sin(ORBIT_START.theta) * ORBIT_START.radius,
      ORBIT_START.height,
      Math.cos(ORBIT_START.theta) * ORBIT_START.radius
    );
    camera.lookAt(0, 0, 0);

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
    const rng = (min: number, max: number) => min + Math.random() * (max - min);

    // a throwaway camera at the resting angle, used to keep the resting
    // scatter out of the headline's screen space
    const restCam = camera.clone();
    restCam.updateMatrixWorld();
    const inHeadlineZone = (p: THREE.Vector3) => {
      const ndc = p.clone().project(restCam);
      return (
        Math.pow(ndc.x / 0.62, 2) + Math.pow((ndc.y - 0.05) / 0.5, 2) < 1
      );
    };

    // --- cubes: one per voxel sight-line -----------------------------------
    const cubeGeo = new THREE.BoxGeometry(1, 1, 1);
    const cubes: CubeData[] = [];
    const positions: THREE.Vector3[] = [];

    for (let i = 0; i < COUNT; i++) {
      const target = targets[i];
      const rayDir = target.clone().sub(CAM_END).normalize();

      // scatter along the sight-line, in a group in front of the J or one
      // behind it — the empty middle keeps the resting view's center clear
      let depth = 0;
      const pos = new THREE.Vector3();
      for (let tries = 0; tries < 40; tries++) {
        depth = Math.random() < 0.45 ? -rng(1.5, 7) : rng(2, 9);
        pos.copy(target).addScaledVector(rayDir, depth);
        if (!inHeadlineZone(pos)) break;
      }

      // size so the cube subtends exactly one voxel from the reveal camera
      const restSize =
        (VOX * CAM_END.distanceTo(pos)) / CAM_END.distanceTo(target);

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
      const mesh = new THREE.Mesh(cubeGeo, mat);
      mesh.position.copy(pos);
      mesh.scale.setScalar(restSize);
      mesh.rotation.set(ISO.x, ISO.y, 0);

      group.add(mesh);
      positions.push(mesh.position);
      cubes.push({
        mesh,
        target,
        dir: rayDir,
        depth,
        restSize,
        order: rng(0, 1),
        speed: rng(0.15, 0.4),
        phase: rng(0, Math.PI * 2),
        spin: rng(-0.06, 0.06),
      });
    }

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

    // scroll-driven reveal progress (0 oblique chaos → 1 aligned J)
    let targetA = reduced ? 1 : 0;
    let a = reduced ? 1 : 0;
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
      a += (targetA - a) * 0.09;

      // camera swings from the oblique resting angle to the reveal angle
      const swing = smooth(clamp01(a / 0.85));
      const theta = ORBIT_START.theta * (1 - swing);
      const radius =
        ORBIT_START.radius + (CAM_END.z - ORBIT_START.radius) * swing;
      const height =
        ORBIT_START.height + (CAM_END.y - ORBIT_START.height) * swing;
      const px = target.x * 0.7;
      const py = -target.y * 0.5;
      camera.position.x +=
        (Math.sin(theta) * radius + px - camera.position.x) * 0.06;
      camera.position.y += (height + py - camera.position.y) * 0.06;
      camera.position.z += (Math.cos(theta) * radius - camera.position.z) * 0.06;
      camera.lookAt(0, 0, 0);

      for (const c of cubes) {
        // each cube slides home along its own sight-line — motion that is
        // invisible from the reveal angle; the shape simply sharpens
        const e = smooth(
          clamp01(((a - 0.5) / 0.45) * (1 + STAGGER) - c.order * STAGGER)
        );
        const depth = c.depth * (1 - e);
        const bob = Math.sin(t * c.speed + c.phase) * 0.2 * (1 - e);
        c.mesh.position
          .copy(c.target)
          .addScaledVector(c.dir, depth);
        c.mesh.position.y += bob;
        c.mesh.rotation.y = ISO.y + t * c.spin * (1 - clamp01(a * 2));
        c.mesh.scale.setScalar(c.restSize + (VOX - c.restSize) * e);
      }

      lineMat.opacity = lineBase * (1 - clamp01(a * 2));
      lines.visible = a < 0.5;

      // a soft breathing glow once the J locks in
      const locked = smooth(clamp01((a - 0.88) / 0.12));
      for (const c of cubes) {
        (c.mesh.material as THREE.MeshStandardMaterial).emissiveIntensity =
          0.12 + locked * (0.2 + 0.08 * Math.sin(t * 1.4 + c.phase));
      }

      group.rotation.y = Math.sin(t * 0.05) * 0.08 * (1 - swing * 0.7);
      renderer.render(scene, camera);
      if (running && !reduced) raf = requestAnimationFrame(render);
    };

    if (reduced) {
      camera.position.copy(CAM_END); // a=1: render() holds the reveal angle
      render(); // single static frame: the aligned J
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
      cubeGeo.dispose();
      cubes.forEach((c) => {
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
