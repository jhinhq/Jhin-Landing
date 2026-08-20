"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroScene from "./HeroScene";

gsap.registerPlugin(ScrollTrigger);
import CopyCmd from "./CopyCmd";
import { GITHUB_URL } from "@/lib/site";

const stack = [
  "Temporal",
  "NATS JetStream",
  "LangGraph",
  "PostgreSQL",
  "FastAPI",
  "Next.js",
  "Docker Compose",
  "OpenTelemetry",
];

export default function Hero() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const ctx = gsap.context(() => {}, root);
    // Defer tween creation past StrictMode's synchronous mount → cleanup →
    // remount, which can otherwise leave the entrance `from` state (opacity 0)
    // frozen on the copy.
    const timer = setTimeout(() => {
      ctx.add(() => {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .fromTo(
            "[data-hero-item]",
            { y: 42, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, stagger: 0.12, delay: 0.15 }
          )
          .fromTo(
            "[data-hero-marquee]",
            { opacity: 0 },
            { opacity: 1, duration: 1 },
            "-=0.4"
          );

        // as the cubes assemble on scroll, the copy hands the stage over
        if (!reduced) {
          gsap.to("[data-hero-content]", {
            opacity: 0,
            y: -80,
            scale: 0.97,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: () => "+=" + window.innerHeight * 0.55,
              scrub: true,
            },
          });
        }
      });
    }, 0);
    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="top"
      ref={root}
      className="relative h-[100svh] motion-safe:h-[200svh]"
    >
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden">
        <div className="aurora" />
        <div className="dotgrid" />
        <HeroScene />

        <div
          data-hero-content
          className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-5 pb-16 pt-36 text-center"
        >
        <div data-hero-item className="eyebrow glass rounded-full px-4 py-2">
          <span className="status-dot" />
          Open source · Self-hosted · One command
        </div>

        <h1
          data-hero-item
          className="font-display mt-7 max-w-4xl text-5xl font-bold leading-[1.04] tracking-tight sm:text-6xl md:text-7xl"
        >
          Run a company of{" "}
          <span className="gradient-text">AI&nbsp;agents.</span>
        </h1>

        <p
          data-hero-item
          className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-muted sm:text-xl"
        >
          Jhin is a self-hosted platform for building hierarchical teams of
          autonomous AI agents — with durable workflows, event triggers, scoped
          permissions, and human approvals built in.
        </p>

        <div
          data-hero-item
          className="mt-9 flex flex-col items-center gap-4 sm:flex-row"
        >
          <CopyCmd className="max-w-[92vw]" />
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="btn-primary"
          >
            Star on GitHub
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17 17 7M8 7h9v9" />
            </svg>
          </a>
        </div>

        <div data-hero-marquee className="mt-20 w-full max-w-3xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            Built on boringly reliable infrastructure
          </p>
          <div className="marquee">
            {[0, 1].map((n) => (
              <div key={n} className="marquee-track" aria-hidden={n === 1}>
                {stack.map((s) => (
                  <span
                    key={s}
                    className="font-display whitespace-nowrap text-lg font-semibold text-ink-2 opacity-70"
                  >
                    {s}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[var(--bg)]" />
      </div>
    </section>
  );
}
