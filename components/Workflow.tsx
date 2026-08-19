"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    k: "01",
    title: "An issue moves to Todo",
    body: "A Linear webhook lands, its signature is verified, and the event is published to the bus. Duplicate deliveries are deduped — one ticket, one workflow.",
    chip: "linear.issue.updated",
  },
  {
    k: "02",
    title: "The trigger fires",
    body: "Your rule matches — team is Engineering, state changed to Todo — and a durable Temporal workflow starts, assigned to the Senior SWE agent.",
    chip: "trigger.matched",
  },
  {
    k: "03",
    title: "The agent gets to work",
    body: "The SWE reads the ticket, clones the repo into an ephemeral sandbox, implements the change, and runs the tests. No credentials ever touch the prompt.",
    chip: "sandbox.created",
  },
  {
    k: "04",
    title: "A pull request opens",
    body: "Branch agent/ENG-142, commits pushed, PR opened, Linear updated. QA is delegated as a child workflow and re-runs everything from scratch.",
    chip: "github.pr.opened",
  },
  {
    k: "05",
    title: "You approve the merge",
    body: "Tests pass, QA signs off, and the merge waits in your approvals inbox. One tap. Every step is on the timeline, every token accounted for.",
    chip: "approval.requested",
  },
];

export default function Workflow() {
  const root = useRef<HTMLElement>(null);
  const progress = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        progress.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: "[data-tl]",
            start: "top 70%",
            end: "bottom 55%",
            scrub: 0.6,
          },
        }
      );
      gsap.utils.toArray<HTMLElement>("[data-step]").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 78%" },
          x: -28,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="how" ref={root} className="relative mx-auto max-w-6xl px-5 py-28">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="eyebrow">From ticket to merged PR</p>
          <h2 className="font-display mt-4 text-balance text-3xl font-bold tracking-tight sm:text-5xl">
            Watch a ticket ship itself.
          </h2>
          <p className="mt-5 max-w-md text-muted sm:text-lg">
            The flagship workflow: an issue enters Todo and your engineering
            team of agents takes it from ticket to reviewed, tested,
            human-approved merge.
          </p>
          <div className="card mt-8 hidden p-4 font-mono text-xs leading-6 text-muted lg:block">
            <span className="text-accent-ink">jhin</span> run watch ENG-142
            <br />
            <span style={{ color: "var(--peri-soft)" }}>● running</span> · SWE
            Agent · step 3/5
            <br />
            tokens: 41,032 · cost: $0.87 · elapsed: 12m
          </div>
        </div>

        <div data-tl className="relative pl-14">
          <div className="tl-rail" />
          <div ref={progress} className="tl-progress" style={{ height: "100%" }} />
          <div className="flex flex-col gap-10">
            {STEPS.map((s) => (
              <div key={s.k} data-step className="relative">
                <div
                  className="absolute -left-14 top-1 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-[var(--surface-solid)] font-mono text-xs font-bold text-accent-ink"
                  style={{ boxShadow: "0 0 0 4px var(--bg)" }}
                >
                  {s.k}
                </div>
                <div className="card p-5 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-display text-lg font-bold">{s.title}</h3>
                    <span className="rounded-full bg-[var(--term-bg)] px-2.5 py-1 font-mono text-[10px] text-[var(--term-ink)]">
                      {s.chip}
                    </span>
                  </div>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted">
                    {s.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
