"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  IconHourglass,
  IconBolt,
  IconHandshake,
  IconLock,
  IconChip,
  IconChart,
} from "./icons";

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  {
    icon: IconHourglass,
    title: "Durable by design",
    body: "Temporal owns every workflow. A ticket can run for minutes or weeks and survive restarts, outages, deploys, and slow humans.",
    tag: "Temporal",
  },
  {
    icon: IconBolt,
    title: "Event-driven",
    body: "Webhooks, schedules, and internal events flow through NATS JetStream. A Linear issue hitting Todo can kick off an entire engineering pipeline.",
    tag: "NATS JetStream",
  },
  {
    icon: IconHandshake,
    title: "Humans in the loop",
    body: "Risky actions wait in an approvals inbox. Pause, cancel, retry, reassign, or inject instructions into any running task.",
    tag: "Approvals",
  },
  {
    icon: IconLock,
    title: "Least privilege",
    body: "Deny-by-default capabilities per agent. Credentials are envelope-encrypted and resolved at execution time — models never see a token.",
    tag: "Security",
  },
  {
    icon: IconChip,
    title: "Any model, per agent",
    body: "OpenAI, Anthropic, OpenRouter, Ollama, or any compatible endpoint. Give your CTO a frontier model and your blogger something cheap.",
    tag: "Providers",
  },
  {
    icon: IconChart,
    title: "Total visibility",
    body: "Run timelines, sanitized tool calls, audit trails, and token-level cost tracking. Always know what ran, why, and what it spent.",
    tag: "Observability",
  },
];

export default function Features() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-feature]", {
        scrollTrigger: { trigger: root.current, start: "top 70%" },
        y: 34,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
      });
    }, root);
    return () => ctx.revert();
  }, []);

  // subtle pointer-follow glow
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  return (
    <section id="features" ref={root} className="relative bg-bg-2/60 py-28">
      <div className="mx-auto max-w-6xl px-5">
        <p className="eyebrow">Everything an org needs</p>
        <h2 className="font-display mt-4 max-w-2xl text-balance text-3xl font-bold tracking-tight sm:text-5xl">
          Autonomy you can actually{" "}
          <span className="gradient-text">trust in production.</span>
        </h2>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              data-feature
              onPointerMove={onMove}
              className="card group relative overflow-hidden p-6"
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background:
                    "radial-gradient(340px circle at var(--mx, 50%) var(--my, 50%), var(--glow), transparent 65%)",
                }}
              />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-xl text-accent-ink"
                    style={{
                      background:
                        "color-mix(in srgb, var(--accent) 12%, transparent)",
                    }}
                  >
                    <f.icon className="h-5 w-5" />
                  </span>
                  <span className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted">
                    {f.tag}
                  </span>
                </div>
                <h3 className="font-display mt-4 text-lg font-bold">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {f.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
