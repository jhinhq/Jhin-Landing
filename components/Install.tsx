"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GITHUB_URL, INSTALL_CMD } from "@/lib/site";

gsap.registerPlugin(ScrollTrigger);

const OUTPUT = [
  { t: "✓ Checking Docker", d: 400 },
  { t: "✓ Pulling images — postgres, nats, temporal, jhin", d: 900 },
  { t: "✓ Generating master key → /run/secrets/jhin_master_key", d: 700 },
  { t: "✓ Running migrations", d: 500 },
  { t: "✓ Starting 10 services", d: 600 },
  { t: "", d: 300 },
  { t: "★ Jhin is running → http://localhost:3000", d: 200 },
];

export default function Install() {
  const root = useRef<HTMLElement>(null);
  const [typed, setTyped] = useState("");
  const [lines, setLines] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const started = useRef(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-install-reveal]", {
        scrollTrigger: { trigger: root.current, start: "top 70%" },
        y: 34,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
      });

      ScrollTrigger.create({
        trigger: "[data-terminal]",
        start: "top 75%",
        once: true,
        onEnter: () => {
          if (started.current) return;
          started.current = true;
          if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setTyped(INSTALL_CMD);
            setLines(OUTPUT.map((o) => o.t));
            setDone(true);
            return;
          }
          let i = 0;
          const type = () => {
            i++;
            setTyped(INSTALL_CMD.slice(0, i));
            if (i < INSTALL_CMD.length) {
              setTimeout(type, 26 + Math.random() * 40);
            } else {
              let delay = 500;
              OUTPUT.forEach((o, idx) => {
                delay += o.d;
                setTimeout(() => {
                  setLines((prev) => [...prev, o.t]);
                  if (idx === OUTPUT.length - 1) setDone(true);
                }, delay);
              });
            }
          };
          setTimeout(type, 400);
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_CMD);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  return (
    <section id="install" ref={root} className="relative overflow-hidden py-28">
      <div className="aurora" style={{ opacity: 0.5 }} />
      <div className="relative mx-auto max-w-4xl px-5 text-center">
        <p data-install-reveal className="eyebrow justify-center">
          Self-hosted in minutes
        </p>
        <h2
          data-install-reveal
          className="font-display mt-4 text-balance text-3xl font-bold tracking-tight sm:text-5xl"
        >
          One command. Your hardware.
          <br />
          <span className="gradient-text">Your agents.</span>
        </h2>
        <p
          data-install-reveal
          className="mx-auto mt-5 max-w-xl text-muted sm:text-lg"
        >
          Everything ships as Docker Compose — Postgres, NATS, Temporal, and
          the whole control plane. No cloud dependency, no telemetry, MIT
          licensed.
        </p>

        <div data-install-reveal data-terminal className="terminal mx-auto mt-12 text-left">
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
            <span className="terminal-dot" style={{ background: "#ff8a8a" }} />
            <span className="terminal-dot" style={{ background: "#ffd58a" }} />
            <span className="terminal-dot" style={{ background: "#9ef0b0" }} />
            <span className="ml-3 text-xs opacity-50">you@yourserver — ~</span>
            <button
              onClick={copy}
              className="ml-auto rounded-md border border-white/15 px-2.5 py-1 text-[11px] opacity-80 transition-opacity hover:opacity-100 cursor-pointer"
            >
              {copied ? "copied ✓" : "copy"}
            </button>
          </div>
          <div className="min-h-[240px] px-5 py-4 text-[13px] leading-7 sm:text-sm">
            <div>
              <span style={{ color: "#a594f9" }}>$ </span>
              <span>{typed}</span>
              {!done && <span className="term-caret ml-0.5" />}
            </div>
            {lines.map((l, i) => (
              <div
                key={i}
                style={{
                  color: l.startsWith("★") ? "#cdc1ff" : "#8f86b8",
                  fontWeight: l.startsWith("★") ? 600 : 400,
                }}
              >
                {l || " "}
              </div>
            ))}
            {done && (
              <div>
                <span style={{ color: "#a594f9" }}>$ </span>
                <span className="term-caret ml-0.5" />
              </div>
            )}
          </div>
        </div>

        <p data-install-reveal className="mt-6 text-xs text-muted">
          Placeholder command — the installer is coming together in the repo.
          Prefer it manual? <code className="font-mono">git clone</code> +{" "}
          <code className="font-mono">docker compose up</code> works too.
        </p>

        <div
          data-install-reveal
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="btn-primary">
            Read the docs on GitHub
          </a>
          <a
            href={`${GITHUB_URL}/releases`}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost"
          >
            Releases
          </a>
        </div>
      </div>
    </section>
  );
}
