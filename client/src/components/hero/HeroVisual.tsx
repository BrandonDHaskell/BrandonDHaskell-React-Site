import React, { useEffect, useState } from "react";

type Anchor = "start" | "middle" | "end";

interface Stage {
  id: string;
  label: string;
  angle: number;
  anchor: Anchor;
}

interface Edge {
  id: string;
  verb: string;
  fromAngle: number;
  description: string;
}

const CENTER = 260;
const R = 140;
const LABEL_RADIUS = R + 38;
const VERB_RADIUS = R - 40;
const MONO = "'JetBrains Mono', monospace";

// Convert a clockwise angle (0 = top / 12 o'clock) to an x/y point.
const polar = (deg: number, radius: number) => {
  const rad = (deg * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.sin(rad),
    y: CENTER - radius * Math.cos(rad),
  };
};

// Five stages, evenly spaced around the ring, Operations at the top, clockwise.
const STAGES: Stage[] = [
  { id: "operations", label: "Operations", angle: 0, anchor: "middle" },
  { id: "automation", label: "Automation", angle: 72, anchor: "start" },
  { id: "systems", label: "Systems", angle: 144, anchor: "start" },
  { id: "monitoring", label: "Monitoring", angle: 216, anchor: "end" },
  { id: "reporting", label: "Reporting", angle: 288, anchor: "end" },
];

// Each transition is the arc leaving its stage, labeled with the action it performs.
const EDGES: Edge[] = [
  {
    id: "codify",
    verb: "Codify",
    fromAngle: 0,
    description:
      "Runbooks, toil, and provisioning are codified into software, so the same step runs the same way every time and human error drops out.",
  },
  {
    id: "deploy",
    verb: "Deploy",
    fromAngle: 72,
    description:
      "Infrastructure, configuration, and releases are executed automatically into a resilient system.",
  },
  {
    id: "observe",
    verb: "Observe",
    fromAngle: 144,
    description:
      "The running system emits telemetry (logs, metrics, and traces) that makes its health visible.",
  },
  {
    id: "measure",
    verb: "Measure",
    fromAngle: 216,
    description:
      "Telemetry is aggregated into dashboards and alerts that test performance against SLOs.",
  },
  {
    id: "self-heal",
    verb: "Self-heal",
    fromAngle: 288,
    description:
      "A breached threshold triggers automated remediation or feeds the next sprint to harden the system, which closes the loop.",
  },
];

// Full circle, used as the faint continuous ring and as the pulse motion path.
const ringTop = polar(0, R);
const ringBottom = polar(180, R);
const RING_PATH = `M ${ringTop.x} ${ringTop.y} A ${R} ${R} 0 1 1 ${ringBottom.x} ${ringBottom.y} A ${R} ${R} 0 1 1 ${ringTop.x} ${ringTop.y}`;

// One visible connector arc, inset from both stages, between consecutive dots.
const arcPath = (fromAngle: number) => {
  const start = polar(fromAngle + 9, R);
  const end = polar(fromAngle + 59, R);
  return `M ${start.x} ${start.y} A ${R} ${R} 0 0 1 ${end.x} ${end.y}`;
};

// Arrowhead drawn explicitly (no markers) so it renders in every browser.
// Sits on the ring at the arc midpoint, rotated to point clockwise along the tangent.
const ARROW_HEAD = "M6.5 0 L-4.5 -4.5 L-4.5 4.5 Z";

const usePrefersReducedMotion = (): boolean => {
  const [reduced, setReduced] = useState<boolean>(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
};

const PULSE_DURATION = 7;
const PULSE_COUNT = 3;

const HeroVisual: React.FC = () => {
  const reducedMotion = usePrefersReducedMotion();
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = EDGES.find((edge) => edge.id === activeId) ?? null;

  return (
    <div
      className="
        relative flex flex-col w-full min-h-[400px] lg:min-h-[460px]
        rounded-2xl lg:rounded-3xl overflow-hidden
        [--hero-bg:theme(colors.white)]
        [--hero-border:theme(colors.slate.200)]
        [--hero-grid:theme(colors.slate.400)]
        [--hero-label:theme(colors.slate.600)]
        [--hero-verb:theme(colors.slate.500)]
        [--hero-verb-active:theme(colors.sky.600)]
        [--hero-node-core:theme(colors.white)]
        [--hero-node-stroke:theme(colors.sky.600)]
        [--hero-node-dot:theme(colors.sky.500)]
        [--hero-edge:theme(colors.sky.600)]
        [--hero-pulse:theme(colors.sky.500)]
        [--hero-glow:rgba(14,165,233,0.10)]
        [--hero-shadow:rgba(14,165,233,0.08)]
        [--hero-readout-bg:theme(colors.slate.50)]
        [--hero-readout-border:theme(colors.slate.200)]
        [--hero-readout-text:theme(colors.slate.600)]
        dark:[--hero-bg:theme(colors.slate.950)]
        dark:[--hero-border:theme(colors.slate.800)]
        dark:[--hero-grid:theme(colors.slate.500)]
        dark:[--hero-label:theme(colors.slate.300)]
        dark:[--hero-verb:theme(colors.slate.500)]
        dark:[--hero-verb-active:theme(colors.sky.300)]
        dark:[--hero-node-core:theme(colors.slate.900)]
        dark:[--hero-node-stroke:theme(colors.sky.400)]
        dark:[--hero-node-dot:theme(colors.sky.300)]
        dark:[--hero-edge:theme(colors.sky.400)]
        dark:[--hero-pulse:theme(colors.sky.300)]
        dark:[--hero-glow:rgba(14,165,233,0.08)]
        dark:[--hero-shadow:rgba(14,165,233,0.10)]
        dark:[--hero-readout-bg:theme(colors.slate.900)]
        dark:[--hero-readout-border:theme(colors.slate.800)]
        dark:[--hero-readout-text:theme(colors.slate.400)]
      "
      style={{
        backgroundColor: "var(--hero-bg)",
        border: "1px solid var(--hero-border)",
        boxShadow: "0 24px 64px -24px var(--hero-shadow)",
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 rounded-[inherit] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, var(--hero-glow) 0%, transparent 68%)",
        }}
      />

      {/* Background grid */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.06] pointer-events-none"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="hero-grid"
            width="32"
            height="32"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 32 0 L 0 0 0 32"
              fill="none"
              stroke="var(--hero-grid)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" />
      </svg>

      {/* Reliability cycle */}
      <svg
        viewBox="0 0 520 520"
        preserveAspectRatio="xMidYMid meet"
        className="relative w-full flex-1 min-h-0 p-5"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>Operations reliability cycle</title>
        <desc>
          A continuous reliability cycle of five stages arranged in a ring:
          operations, automation, systems, monitoring, and reporting. Arrows run
          clockwise between the stages. Operations codifies toil into automation,
          automation deploys to systems, systems emit telemetry observed by
          monitoring, monitoring measures against service level objectives to
          produce reporting, and reporting feeds back to operations to self-heal
          and harden, continuously.
        </desc>

        <defs>
          <path id="hero-ring-path" d={RING_PATH} />
        </defs>

        {/* Faint continuous ring (keeps the cycle unbroken behind the stages) */}
        <use
          href="#hero-ring-path"
          fill="none"
          stroke="var(--hero-edge)"
          strokeOpacity="0.18"
          strokeWidth="1.4"
        />

        {/* Connector arcs, clockwise arrowheads, and verbs (each group is a hover target) */}
        {EDGES.map((edge) => {
          const isActive = edge.id === activeId;
          const d = arcPath(edge.fromAngle);
          const headPos = polar(edge.fromAngle + 34, R);
          const verbPos = polar(edge.fromAngle + 36, VERB_RADIUS);
          return (
            <g
              key={edge.id}
              onMouseEnter={() => setActiveId(edge.id)}
              onMouseLeave={() => setActiveId(null)}
            >
              <path
                d={d}
                fill="none"
                style={{
                  stroke: "var(--hero-edge)",
                  strokeWidth: isActive ? 2.4 : 1.6,
                  strokeOpacity: isActive ? 1 : 0.85,
                  transition:
                    "stroke-width 150ms ease, stroke-opacity 150ms ease",
                }}
              />
              <path d={d} fill="none" stroke="transparent" strokeWidth="24" />
              <path
                d={ARROW_HEAD}
                transform={`translate(${headPos.x} ${headPos.y}) rotate(${
                  edge.fromAngle + 34
                })`}
                style={{
                  fill: isActive
                    ? "var(--hero-verb-active)"
                    : "var(--hero-edge)",
                  transition: "fill 150ms ease",
                }}
              />
              <text
                x={verbPos.x}
                y={verbPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontFamily={MONO}
                fontSize="13"
                style={{
                  fill: isActive
                    ? "var(--hero-verb-active)"
                    : "var(--hero-verb)",
                  transition: "fill 150ms ease",
                }}
              >
                {edge.verb}
              </text>
            </g>
          );
        })}

        {/* Pulses circling the ring continuously, through the arrowheads (off under reduced motion) */}
        {!reducedMotion &&
          Array.from({ length: PULSE_COUNT }).map((_, index) => (
            <circle key={`pulse-${index}`} r="3" fill="var(--hero-pulse)">
              <animateMotion
                dur={`${PULSE_DURATION}s`}
                begin={`${(index * PULSE_DURATION) / PULSE_COUNT}s`}
                repeatCount="indefinite"
              >
                <mpath href="#hero-ring-path" />
              </animateMotion>
            </circle>
          ))}

        {/* Stage nodes */}
        {STAGES.map((stage) => {
          const pos = polar(stage.angle, R);
          const labelPos = polar(stage.angle, LABEL_RADIUS);
          return (
            <g key={stage.id}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r="20"
                fill="var(--hero-edge)"
                fillOpacity="0.10"
              />
              <circle
                cx={pos.x}
                cy={pos.y}
                r="13"
                fill="var(--hero-node-core)"
                stroke="var(--hero-node-stroke)"
                strokeWidth="1.6"
              />
              <circle cx={pos.x} cy={pos.y} r="4.5" fill="var(--hero-node-dot)" />
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor={stage.anchor}
                dominantBaseline="middle"
                fontFamily={MONO}
                fontSize="14"
                fill="var(--hero-label)"
              >
                {stage.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Hover readout: cycle name by default, the transition detail on hover */}
      <div className="relative w-full px-5 pb-5">
        <div
          className="rounded-xl px-4 py-3 min-h-[3.25rem] flex items-center text-sm leading-relaxed"
          style={{
            backgroundColor: "var(--hero-readout-bg)",
            border: "1px solid var(--hero-readout-border)",
            color: "var(--hero-readout-text)",
          }}
        >
          {active ? (
            <span>
              <span
                style={{
                  fontFamily: MONO,
                  fontWeight: 500,
                  color: "var(--hero-verb-active)",
                }}
              >
                {active.verb}
              </span>
              {"  "}
              {active.description}
            </span>
          ) : (
            <span
              style={{ fontFamily: MONO, letterSpacing: "0.04em", opacity: 0.85 }}
            >
              Operations reliability cycle
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroVisual;