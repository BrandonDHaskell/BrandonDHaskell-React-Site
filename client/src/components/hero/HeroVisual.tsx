import React from "react";

interface Node {
  id: string;
  cx: number;
  cy: number;
  label: string;
  size: "lg" | "md" | "sm";
}

interface Edge {
  from: string;
  to: string;
  pulse: boolean;
}

const NODES: Node[] = [
  // Operations lane
  { id: "ops", cx: 80, cy: 62, label: "ops", size: "md" },
  { id: "automation", cx: 200, cy: 42, label: "automation", size: "lg" },
  { id: "infra", cx: 322, cy: 66, label: "infra", size: "md" },

  // Software lane
  { id: "client", cx: 56, cy: 178, label: "client", size: "sm" },
  { id: "api", cx: 155, cy: 165, label: "api", size: "sm" },
  { id: "backend", cx: 240, cy: 200, label: "backend", size: "lg" },
  { id: "data", cx: 338, cy: 170, label: "data", size: "md" },

  // Devices lane
  { id: "sensor", cx: 68, cy: 294, label: "sensor", size: "sm" },
  { id: "controller", cx: 195, cy: 300, label: "controller", size: "lg" },
  { id: "actuator", cx: 340, cy: 286, label: "actuator", size: "md" },
];

const EDGES: Edge[] = [
  // Operations Lane: The CI/CD & IaC Pipeline
  { from: "ops", to: "automation", pulse: true },
  { from: "automation", to: "infra", pulse: true },

  // Software Lane: The Standard Request Flow
  { from: "client", to: "api", pulse: false },
  { from: "api", to: "backend", pulse: true },
  { from: "backend", to: "data", pulse: true },

  // Devices Lane: Local Control Loop (Edge)
  { from: "sensor", to: "controller", pulse: true },
  { from: "controller", to: "actuator", pulse: true },

  // The "Bridges": Connecting the Layers
  { from: "automation", to: "backend", pulse: true },
  { from: "automation", to: "data", pulse: true },
  { from: "infra", to: "api", pulse: false },
  { from: "infra", to: "backend", pulse: false },
  { from: "infra", to: "data", pulse: false },
  { from: "controller", to: "api", pulse: true },
  ];

const nodeMap = new Map(NODES.map((node) => [node.id, node]));

const sizeRadius = (size: Node["size"]): number => {
  switch (size) {
    case "lg":
      return 8;
    case "md":
      return 5.5;
    case "sm":
      return 4;
    default:
      return 5.5;
  }
};

const HeroVisual: React.FC = () => {
  return (
    <div
      className="
        relative w-full min-h-[300px] lg:min-h-[420px] rounded-2xl lg:rounded-3xl overflow-hidden
        [--hero-bg:theme(colors.white)]
        [--hero-border:theme(colors.slate.200)]
        [--hero-grid:theme(colors.slate.400)]
        [--hero-lane-label:theme(colors.slate.500)]
        [--hero-node-label:theme(colors.slate.600)]
        [--hero-node-core:theme(colors.white)]
        [--hero-node-stroke:theme(colors.sky.600)]
        [--hero-node-dot:theme(colors.sky.500)]
        [--hero-edge:theme(colors.sky.600)]
        [--hero-pulse:theme(colors.sky.500)]
        [--hero-glow:rgba(14,165,233,0.10)]
        [--hero-shadow:rgba(14,165,233,0.08)]
        dark:[--hero-bg:theme(colors.slate.950)]
        dark:[--hero-border:theme(colors.slate.800)]
        dark:[--hero-grid:theme(colors.slate.500)]
        dark:[--hero-lane-label:theme(colors.slate.500)]
        dark:[--hero-node-label:theme(colors.slate.400)]
        dark:[--hero-node-core:theme(colors.slate.900)]
        dark:[--hero-node-stroke:theme(colors.sky.400)]
        dark:[--hero-node-dot:theme(colors.sky.300)]
        dark:[--hero-edge:theme(colors.sky.400)]
        dark:[--hero-pulse:theme(colors.sky.300)]
        dark:[--hero-glow:rgba(14,165,233,0.08)]
        dark:[--hero-shadow:rgba(14,165,233,0.10)]
      "
      style={{
        backgroundColor: "var(--hero-bg)",
        border: "1px solid var(--hero-border)",
        boxShadow: "0 24px 64px -24px var(--hero-shadow)",
      }}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 rounded-[inherit] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, var(--hero-glow) 0%, transparent 70%)",
        }}
      />

      <svg
        className="absolute inset-0 h-full w-full opacity-[0.06]"
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

      <svg
        viewBox="0 0 400 360"
        className="relative h-full w-full p-6"
        xmlns="http://www.w3.org/2000/svg"
      >
        {[
          { y: 22, text: "OPERATIONS" },
          { y: 140, text: "SOFTWARE" },
          { y: 260, text: "DEVICES" },
        ].map(({ y, text }) => (
          <text
            key={text}
            x="6"
            y={y}
            fill="var(--hero-lane-label)"
            fontFamily="'JetBrains Mono', monospace"
            fontSize="9"
            letterSpacing="0.15em"
          >
            {text}
          </text>
        ))}

        {/* Edge lines: visually consistent for every edge */}
        {EDGES.map((edge, index) => {
          const from = nodeMap.get(edge.from);
          const to = nodeMap.get(edge.to);

          if (!from || !to) {
            return null;
          }

          return (
            <line
              key={`${edge.from}-${edge.to}`}
              x1={from.cx}
              y1={from.cy}
              x2={to.cx}
              y2={to.cy}
              stroke="var(--hero-edge)"
              strokeOpacity="0.22"
              strokeWidth="1"
            >
              <animate
                attributeName="opacity"
                values="0.15;0.50;0.15"
                dur={`${3 + (index % 4) * 0.7}s`}
                begin={`${(index * 0.4) % 3}s`}
                repeatCount="indefinite"
              />
            </line>
          );
        })}

        {/* Traveling pulses only for selected edges */}
        {EDGES.filter((edge) => edge.pulse).map((edge, index) => {
          const from = nodeMap.get(edge.from);
          const to = nodeMap.get(edge.to);

          if (!from || !to) {
            return null;
          }

          const durationSeconds = 4.5 + index * 0.55;

          return (
            <circle
              key={`pulse-${edge.from}-${edge.to}`}
              r="2"
              fill="var(--hero-pulse)"
              fillOpacity="0.6"
            >
              <animate
                attributeName="cx"
                values={`${from.cx};${to.cx};${from.cx}`}
                dur={`${durationSeconds}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                values={`${from.cy};${to.cy};${from.cy}`}
                dur={`${durationSeconds}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0;0.8;0"
                dur={`${durationSeconds}s`}
                repeatCount="indefinite"
              />
            </circle>
          );
        })}

        {/* Nodes */}
        {NODES.map((node) => {
          const radius = sizeRadius(node.size);

          return (
            <g key={node.id}>
              <circle
                cx={node.cx}
                cy={node.cy}
                r={radius + 4}
                fill="var(--hero-edge)"
                fillOpacity="0.08"
              >
                <animate
                  attributeName="r"
                  values={`${radius + 3};${radius + 6};${radius + 3}`}
                  dur="4s"
                  repeatCount="indefinite"
                />
              </circle>

              <circle
                cx={node.cx}
                cy={node.cy}
                r={radius}
                fill="var(--hero-node-core)"
                stroke="var(--hero-node-stroke)"
                strokeOpacity="0.6"
                strokeWidth="1.5"
              />

              <circle
                cx={node.cx}
                cy={node.cy}
                r={radius * 0.35}
                fill="var(--hero-node-dot)"
              >
                <animate
                  attributeName="opacity"
                  values="0.5;1;0.5"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </circle>

              <text
                x={node.cx}
                y={node.cy + radius + 12}
                textAnchor="middle"
                fill="var(--hero-node-label)"
                fontFamily="'JetBrains Mono', monospace"
                fontSize="8"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          animate {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default HeroVisual;