"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  IconUser,
  IconCompass,
  IconBolt,
  IconSearch,
  IconWrench,
  IconMegaphone,
  IconPen,
  IconTrend,
  IconChat,
  IconLifebuoy,
  IconDatabase,
  IconBook,
  IconFlask,
} from "./icons";

gsap.registerPlugin(ScrollTrigger);

type Agent = {
  id: string;
  name: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  human?: boolean;
  blurb: string;
  can: string[];
  cant: string[];
  model: string;
};

const AGENTS: Record<string, Agent> = {
  you: {
    id: "you",
    name: "You",
    title: "Founder · Human",
    icon: IconUser,
    human: true,
    blurb:
      "Set direction, message any agent, and approve the risky stuff. Every action lands in your audit trail.",
    can: ["Approve / reject", "Pause & cancel runs", "Inject instructions", "See every token spent"],
    cant: ["Be replaced 🙂"],
    model: "—",
  },
  cto: {
    id: "cto",
    name: "CTO Agent",
    title: "Engineering lead",
    icon: IconCompass,
    blurb:
      "Receives objectives, breaks them down, and delegates to the team. Gets concise completion summaries back — not walls of context.",
    can: ["Read Linear & GitHub", "Delegate tasks", "Review artifacts", "Request approvals"],
    cant: ["Run CLI", "Merge to main"],
    model: "your choice — any provider",
  },
  swe: {
    id: "swe",
    name: "Senior SWE",
    title: "Ships the code",
    icon: IconBolt,
    blurb:
      "Picks up tickets the moment they hit Todo. Clones the repo in an ephemeral sandbox, implements, tests, and opens a PR.",
    can: ["Repo read", "Branch agent/*", "Sandboxed CLI", "Open pull requests"],
    cant: ["Merge protected branches", "Touch prod secrets"],
    model: "your choice — any provider",
  },
  qa: {
    id: "qa",
    name: "QA Engineer",
    title: "Trusts nothing",
    icon: IconSearch,
    blurb:
      "Checks out the PR in its own sandbox, runs the test suite, pokes the preview deploy, and reports pass or fail to the manager.",
    can: ["Checkout PRs", "Run tests", "Read preview deploys", "Report pass / fail"],
    cant: ["Modify source", "Approve itself"],
    model: "your choice — any provider",
  },
  devops: {
    id: "devops",
    name: "DevOps",
    title: "Keeps it running",
    icon: IconWrench,
    blurb:
      "Watches deployments and reruns failed pipelines. Anything destructive waits for a human thumbs-up.",
    can: ["Read deployments", "Redeploy", "Read logs"],
    cant: ["Promote to prod without approval"],
    model: "your choice — any provider",
  },
  mkt: {
    id: "mkt",
    name: "Marketing Director",
    title: "Runs the other org",
    icon: IconMegaphone,
    blurb:
      "Same platform, different team. Coordinates content agents on schedules — nightly SEO reports, weekly posts — and reviews everything before it ships.",
    can: ["Delegate to writers", "Scheduled triggers", "Review drafts"],
    cant: ["Publish without approval"],
    model: "your choice — any provider",
  },
  blog: {
    id: "blog",
    name: "Blogger",
    title: "Writes the words",
    icon: IconPen,
    blurb:
      "Drafts posts from briefs the director hands down. Reads the style guide from workspace knowledge, cites sources, and submits drafts for review.",
    can: ["Draft posts", "Research topics", "Read style guide"],
    cant: ["Publish directly"],
    model: "your choice — any provider",
  },
  seo: {
    id: "seo",
    name: "SEO Specialist",
    title: "Watches the rankings",
    icon: IconTrend,
    blurb:
      "Runs on a nightly schedule: crawls reports, tracks keywords, and proposes meta/content changes as tasks for the team.",
    can: ["Crawl & audit", "Keyword research", "Propose changes"],
    cant: ["Deploy changes"],
    model: "your choice — any provider",
  },
  social: {
    id: "social",
    name: "Social Media",
    title: "Feeds the feeds",
    icon: IconChat,
    blurb:
      "Turns shipped work into threads and posts, queues them for approval, and reads the analytics back into team memory.",
    can: ["Draft threads", "Queue posts", "Read analytics"],
    cant: ["Post without approval"],
    model: "your choice — any provider",
  },
  support: {
    id: "support",
    name: "Support Lead",
    title: "Owns the inbox",
    icon: IconLifebuoy,
    blurb:
      "Triages everything inbound, delegates common tickets, and files real bugs straight into Engineering's Linear board — closing the loop between customers and code.",
    can: ["Read tickets", "Delegate triage", "File Linear issues"],
    cant: ["Issue refunds without approval"],
    model: "your choice — any provider",
  },
  triage: {
    id: "triage",
    name: "Triage Agent",
    title: "First responder",
    icon: IconChat,
    blurb:
      "Classifies incoming tickets, drafts replies for the common cases from workspace knowledge, and escalates anything unusual up to the lead.",
    can: ["Classify tickets", "Draft replies", "Search docs"],
    cant: ["Send replies unreviewed"],
    model: "your choice — any provider",
  },
  docs: {
    id: "docs",
    name: "Docs Agent",
    title: "Keeps docs honest",
    icon: IconBook,
    blurb:
      "Watches merged PRs and updates documentation to match what actually shipped. Opens its own doc PRs for review like everyone else.",
    can: ["Read merged PRs", "Draft doc updates", "Open doc PRs"],
    cant: ["Publish directly"],
    model: "your choice — any provider",
  },
  data: {
    id: "data",
    name: "Data Lead",
    title: "Counts everything",
    icon: IconDatabase,
    blurb:
      "Coordinates analytics and research. Runs the weekly metrics review and hands findings to the other departments as tasks.",
    can: ["Read-only SQL", "Delegate analyses", "Schedule reports"],
    cant: ["Write to the database"],
    model: "your choice — any provider",
  },
  analyst: {
    id: "analyst",
    name: "Analyst Agent",
    title: "Lives in SQL",
    icon: IconTrend,
    blurb:
      "Runs read-only queries against an allowlisted schema — statement timeouts, row limits, no DDL — and turns them into weekly digests.",
    can: ["Read-only SQL", "Build dashboards", "Weekly digests"],
    cant: ["Touch prod data", "Run DDL"],
    model: "your choice — any provider",
  },
  research: {
    id: "research",
    name: "Research Agent",
    title: "Reads the internet",
    icon: IconFlask,
    blurb:
      "Scans competitors, changelogs, and papers on a schedule, then files cited briefs into team memory for the rest of the org to use.",
    can: ["Web research", "Cited briefs", "Write team memory"],
    cant: ["Exceed monthly budget cap"],
    model: "your choice — any provider",
  },
};

const ENG = ["swe", "qa", "devops"];
const MKT = ["blog", "seo", "social"];
const SUP = ["triage", "docs"];
const DATA = ["analyst", "research"];

// Hoisted so React preserves DOM across re-renders (GSAP styles inline on
// these elements must survive stage/selection state changes).
type SelectProps = { selected: string; onSelect: (id: string) => void };

function NodeCard({
  id,
  small = false,
  big = false,
  selected,
  onSelect,
}: { id: string; small?: boolean; big?: boolean } & SelectProps) {
  const a = AGENTS[id];
  return (
    <button
      data-node
      data-active={selected === id}
      onClick={() => onSelect(id)}
      className={`node-card card flex items-center gap-2.5 text-left ${
        small ? "px-3 py-2.5" : big ? "px-5 py-3.5" : "px-4 py-3"
      }`}
    >
      <span
        className={`flex shrink-0 items-center justify-center rounded-lg text-accent-ink ${
          small ? "h-7 w-7" : big ? "h-10 w-10" : "h-8 w-8"
        }`}
        style={{
          background: "color-mix(in srgb, var(--accent) 12%, transparent)",
        }}
      >
        <a.icon className={small ? "h-3.5 w-3.5" : big ? "h-5 w-5" : "h-4 w-4"} />
      </span>
      <span className="min-w-0">
        <span
          className={`block whitespace-nowrap font-display font-semibold leading-tight ${
            small ? "text-[13px]" : big ? "text-base" : "text-sm"
          }`}
        >
          {a.name}
        </span>
        <span
          className={`block whitespace-nowrap text-muted ${
            big ? "text-xs" : "text-[11px]"
          }`}
        >
          {a.title}
        </span>
      </span>
      {!a.human && <span className="status-dot ml-1 shrink-0" aria-hidden />}
    </button>
  );
}

function BranchLi({
  mgr,
  kids,
  selected,
  onSelect,
}: { mgr: string; kids: string[] } & SelectProps) {
  return (
    <li data-branch={mgr}>
      <NodeCard id={mgr} selected={selected} onSelect={onSelect} />
      <div className="stem" />
      <ul>
        {kids.map((id) => (
          <li key={id}>
            <NodeCard id={id} small selected={selected} onSelect={onSelect} />
          </li>
        ))}
      </ul>
    </li>
  );
}

// scroll-story: caption + the agent shown in the panel at each stage
const STAGES = [
  { caption: "Day one — it's just you.", focus: "you" },
  { caption: "Hire Engineering. Tickets start shipping themselves.", focus: "cto" },
  { caption: "Add Marketing. Content flows on a schedule.", focus: "mkt" },
  { caption: "Support closes the loop with customers.", focus: "support" },
  { caption: "Data keeps everyone honest. Your whole org, one command.", focus: "data" },
];

export default function OrgChart() {
  const root = useRef<HTMLElement>(null);
  const fitRef = useRef<HTMLDivElement>(null);
  const treeRef = useRef<HTMLUListElement>(null);
  const [fit, setFit] = useState({ scale: 1, height: 0 });
  const [selected, setSelected] = useState<string>("swe");
  const [stage, setStage] = useState(0);
  const stageRef = useRef(-1);
  const agent = AGENTS[selected];

  // scale the tree down so it always fits the viewport — no inner scrolling
  useEffect(() => {
    const measure = () => {
      const outer = fitRef.current;
      const tree = treeRef.current;
      if (!outer || !tree) return;
      // fill the available width; allow modest upscaling on large screens
      const scale = Math.min(1.4, outer.clientWidth / tree.offsetWidth);
      setFit({ scale, height: tree.offsetHeight * scale });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (fitRef.current) ro.observe(fitRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // scroll story: pin the section and assemble the org department by
  // department as the user scrolls (desktop); simple staggered reveal on mobile
  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const mm = gsap.matchMedia(root);

    mm.add("(min-width: 768px)", () => {
      if (reduced) {
        setStage(STAGES.length - 1);
        return;
      }
      const tree = treeRef.current!;
      const you = tree.querySelector(":scope > li > button");
      const branches = gsap.utils.toArray<HTMLElement>("[data-branch]", tree);

      gsap.set(branches, {
        autoAlpha: 0,
        y: -28,
        scale: 0.92,
        transformOrigin: "top center",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=1800",
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          onUpdate(self) {
            const s = Math.min(
              STAGES.length - 1,
              Math.floor(self.progress * (STAGES.length + 0.4))
            );
            if (s !== stageRef.current) {
              stageRef.current = s;
              setStage(s);
              setSelected(STAGES[s].focus);
            }
          },
        },
      });

      tl.from(you, { scale: 0.5, autoAlpha: 0, duration: 0.5, ease: "back.out(1.7)" })
        .to({}, { duration: 0.25 });

      branches.forEach((b) => {
        tl.to(b, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.5,
          ease: "power2.out",
        })
          .from(
            b.querySelectorAll("[data-node]"),
            {
              y: 16,
              autoAlpha: 0,
              stagger: 0.08,
              duration: 0.35,
              ease: "power2.out",
            },
            "<0.1"
          )
          .to({}, { duration: 0.3 });
      });
    });

    mm.add("(max-width: 767px)", () => {
      gsap.from("[data-mobile-org] [data-node]", {
        scrollTrigger: { trigger: root.current, start: "top 65%" },
        y: 26,
        opacity: 0,
        scale: 0.94,
        duration: 0.7,
        stagger: 0.05,
        ease: "back.out(1.6)",
      });
    });

    mm.add("all", () => {
      gsap.from("[data-org-panel]", {
        scrollTrigger: { trigger: root.current, start: "top 60%" },
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });
    });

    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      id="org"
      ref={root}
      className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-5 py-24 md:py-14"
    >
      <div className="text-center">
        <p className="eyebrow justify-center">The org chart is the product</p>
        <h2 className="font-display mt-4 text-balance text-3xl font-bold tracking-tight sm:text-5xl">
          Model an organization,
          <br className="hidden sm:block" /> not just a chat.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted sm:text-lg">
          Agents have roles, managers, budgets, and scoped permissions. Work
          flows down the hierarchy; summaries flow back up. Tap a node to see
          what it&apos;s allowed to do.
        </p>

        {/* scroll-story caption + progress (desktop) */}
        <div className="mt-6 hidden items-center justify-center gap-4 md:flex">
          <div className="flex items-center gap-1.5">
            {STAGES.map((_, i) => (
              <span
                key={i}
                className="h-1.5 rounded-full transition-all duration-500"
                style={{
                  width: i === stage ? 20 : 6,
                  background:
                    i <= stage ? "var(--accent)" : "var(--line-strong)",
                }}
              />
            ))}
          </div>
          <p
            key={stage}
            className="font-display text-sm font-semibold text-accent-ink"
            style={{ animation: "captionIn 0.5s ease both" }}
          >
            {STAGES[stage].caption}
          </p>
        </div>
      </div>

      {/* Desktop / tablet: full tree, auto-scaled to fill the viewport width */}
      <div
        ref={fitRef}
        className="mt-8 hidden md:block"
        style={{
          marginLeft: "calc(50% - 50vw + 2rem)",
          marginRight: "calc(50% - 50vw + 2rem)",
        }}
      >
        <div
          className="flex items-start justify-center"
          style={{ height: fit.height || undefined }}
        >
          <ul
            ref={treeRef}
            className="tree"
            style={{
              width: "max-content",
              transform: `scale(${fit.scale})`,
              transformOrigin: "top center",
            }}
          >
            <li>
              <NodeCard id="you" big selected={selected} onSelect={setSelected} />
              <div className="stem" />
              <ul>
                <BranchLi mgr="cto" kids={ENG} selected={selected} onSelect={setSelected} />
                <BranchLi mgr="mkt" kids={MKT} selected={selected} onSelect={setSelected} />
                <BranchLi mgr="support" kids={SUP} selected={selected} onSelect={setSelected} />
                <BranchLi mgr="data" kids={DATA} selected={selected} onSelect={setSelected} />
              </ul>
            </li>
          </ul>
        </div>
      </div>

      {/* Mobile: stacked branches — no scrolling, no scaling */}
      <div data-mobile-org className="mt-12 flex flex-col items-center gap-5 md:hidden">
        <NodeCard id="you" selected={selected} onSelect={setSelected} />
        <div className="grid w-full max-w-md gap-6 sm:max-w-2xl sm:grid-cols-2">
          {[
            { mgr: "cto", kids: ENG },
            { mgr: "mkt", kids: MKT },
            { mgr: "support", kids: SUP },
            { mgr: "data", kids: DATA },
          ].map(({ mgr, kids }) => (
            <div key={mgr} className="flex flex-col gap-2.5">
              <NodeCard id={mgr} selected={selected} onSelect={setSelected} />
              <div
                className="ml-5 flex flex-col items-start gap-2.5 border-l-2 pl-4"
                style={{ borderColor: "var(--line-strong)" }}
              >
                {kids.map((id) => (
                  <NodeCard
                    key={id}
                    id={id}
                    small
                    selected={selected}
                    onSelect={setSelected}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        data-org-panel
        className="card mx-auto mt-10 w-full max-w-3xl p-6 sm:p-8 md:mt-7 md:min-h-[264px]"
        aria-live="polite"
      >
        <div className="flex flex-wrap items-center gap-3">
          <span
            className="flex h-12 w-12 items-center justify-center rounded-xl text-accent-ink"
            style={{
              background: "color-mix(in srgb, var(--accent) 12%, transparent)",
            }}
          >
            <agent.icon className="h-6 w-6" />
          </span>
          <div>
            <h3 className="font-display text-xl font-bold">{agent.name}</h3>
            <p className="text-sm text-muted">{agent.title}</p>
          </div>
          <span className="ml-auto rounded-full border border-line px-3 py-1 font-mono text-xs text-muted">
            model: {agent.model}
          </span>
        </div>
        <p className="mt-4 leading-relaxed text-ink-2">{agent.blurb}</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">
              Granted
            </p>
            <div className="flex flex-wrap gap-2">
              {agent.can.map((c) => (
                <span
                  key={c}
                  className="rounded-full px-3 py-1 text-xs font-medium"
                  style={{
                    background: "color-mix(in srgb, var(--accent) 14%, transparent)",
                    color: "var(--accent-ink)",
                  }}
                >
                  ✓ {c}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted">
              Denied by default
            </p>
            <div className="flex flex-wrap gap-2">
              {agent.cant.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-line px-3 py-1 text-xs font-medium text-muted"
                >
                  ✕ {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
