import { useState } from "react";

export function DataConstellation() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  return (
    <div className="w-full max-w-lg mx-auto aspect-square flex flex-col items-center justify-center p-4">
      {/* Floating Animated Interactive Constellation */}
      <svg 
        viewBox="0 0 400 400" 
        className="w-full h-full text-text-primary float-slow"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* CSS Animation Keyframes for inline breathing/rotation */}
        <style>
          {`
            @keyframes orbit {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes breathe {
              0%, 100% { r: 10px; opacity: 0.2; }
              50% { r: 24px; opacity: 0.5; }
            }
            @keyframes float-slow {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-8px) rotate(0.5deg); }
            }
            .float-slow {
              animation: float-slow 8s ease-in-out infinite;
              transform-origin: center;
            }
            .orbit-track {
              transform-origin: 200px 200px;
              animation: orbit 40s linear infinite;
            }
            .orbit-track-reverse {
              transform-origin: 200px 200px;
              animation: orbit 60s linear infinite reverse;
            }
            .halo-breath {
              transform-origin: center;
              animation: breathe 4s ease-in-out infinite;
            }
          `}
        </style>

        {/* Orbit Tracks */}
        <circle cx="200" cy="200" r="140" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="6 6" className="orbit-track" />
        <circle cx="200" cy="200" r="80" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="3 3" className="orbit-track-reverse" />

        {/* Dynamic Connective Paths */}
        <g strokeWidth="1.5" strokeOpacity="0.5">
          {/* Analyst paths */}
          <line x1="200" y1="200" x2="100" y2="120" stroke="var(--color-accent-analyst)" />
          <line x1="100" y1="120" x2="60" y2="60" stroke="var(--color-border)" strokeWidth="1" />
          <line x1="100" y1="120" x2="140" y2="60" stroke="var(--color-border)" strokeWidth="1" />

          {/* Engineer paths */}
          <line x1="200" y1="200" x2="300" y2="150" stroke="var(--color-accent-engineer)" />
          <line x1="300" y1="150" x2="350" y2="90" stroke="var(--color-border)" strokeWidth="1" />
          <line x1="300" y1="150" x2="330" y2="220" stroke="var(--color-border)" strokeWidth="1" />

          {/* Scientist paths */}
          <line x1="200" y1="200" x2="200" y2="310" stroke="var(--color-accent-scientist)" />
          <line x1="200" y1="310" x2="120" y2="340" stroke="var(--color-border)" strokeWidth="1" />
          <line x1="200" y1="310" x2="280" y2="340" stroke="var(--color-border)" strokeWidth="1" />
        </g>

        {/* Breathing Halos (Behind nodes) */}
        <circle cx="100" cy="120" r="18" fill="var(--color-accent-analyst)" className="halo-breath opacity-10" />
        <circle cx="300" cy="150" r="18" fill="var(--color-accent-engineer)" className="halo-breath opacity-10" style={{ animationDelay: "-1.5s" }} />
        <circle cx="200" cy="310" r="18" fill="var(--color-accent-scientist)" className="halo-breath opacity-10" style={{ animationDelay: "-3s" }} />

        {/* Center Node (Aniket Core) */}
        <g 
          className="cursor-pointer"
          onMouseEnter={() => setHoveredNode("aniket")}
          onMouseLeave={() => setHoveredNode(null)}
        >
          <circle cx="200" cy="200" r="16" fill="var(--color-bg-surface)" stroke="var(--color-accent-terracotta)" strokeWidth="3.5" />
          <circle cx="200" cy="200" r="8" fill="var(--color-accent-terracotta)" className={hoveredNode === "aniket" ? "scale-110 transition-transform" : ""} />
        </g>

        {/* Analyst Node */}
        <g 
          className="cursor-pointer"
          onMouseEnter={() => setHoveredNode("analyst")}
          onMouseLeave={() => setHoveredNode(null)}
        >
          <circle cx="100" cy="120" r="11" fill="var(--color-bg-surface)" stroke="var(--color-accent-analyst)" strokeWidth="2.5" />
          <circle cx="100" cy="120" r="5" fill="var(--color-accent-analyst)" />
        </g>

        {/* Engineer Node */}
        <g 
          className="cursor-pointer"
          onMouseEnter={() => setHoveredNode("engineer")}
          onMouseLeave={() => setHoveredNode(null)}
        >
          <circle cx="300" cy="150" r="11" fill="var(--color-bg-surface)" stroke="var(--color-accent-engineer)" strokeWidth="2.5" />
          <circle cx="300" cy="150" r="5" fill="var(--color-accent-engineer)" />
        </g>

        {/* Scientist Node */}
        <g 
          className="cursor-pointer"
          onMouseEnter={() => setHoveredNode("scientist")}
          onMouseLeave={() => setHoveredNode(null)}
        >
          <circle cx="200" cy="310" r="11" fill="var(--color-bg-surface)" stroke="var(--color-accent-scientist)" strokeWidth="2.5" />
          <circle cx="200" cy="310" r="5" fill="var(--color-accent-scientist)" />
        </g>

        {/* Leaf Nodes */}
        {/* Tableau */}
        <circle cx="60" cy="60" r="6" fill="var(--color-bg-surface)" stroke="var(--color-text-muted)" strokeWidth="1.5" className="hover:stroke-accent-analyst transition-colors duration-300 cursor-pointer" />
        {/* SQL */}
        <circle cx="140" cy="60" r="6" fill="var(--color-bg-surface)" stroke="var(--color-text-muted)" strokeWidth="1.5" className="hover:stroke-accent-analyst transition-colors duration-300 cursor-pointer" />
        {/* dbt */}
        <circle cx="350" cy="90" r="6" fill="var(--color-bg-surface)" stroke="var(--color-text-muted)" strokeWidth="1.5" className="hover:stroke-accent-engineer transition-colors duration-300 cursor-pointer" />
        {/* Snowflake */}
        <circle cx="330" cy="220" r="6" fill="var(--color-bg-surface)" stroke="var(--color-text-muted)" strokeWidth="1.5" className="hover:stroke-accent-engineer transition-colors duration-300 cursor-pointer" />
        {/* PyTorch */}
        <circle cx="120" cy="340" r="6" fill="var(--color-bg-surface)" stroke="var(--color-text-muted)" strokeWidth="1.5" className="hover:stroke-accent-scientist transition-colors duration-300 cursor-pointer" />
        {/* MLflow */}
        <circle cx="280" cy="340" r="6" fill="var(--color-bg-surface)" stroke="var(--color-text-muted)" strokeWidth="1.5" className="hover:stroke-accent-scientist transition-colors duration-300 cursor-pointer" />

        {/* Dynamic Non-overlapping Labels */}
        {/* Center label */}
        <text x="200" y="174" textAnchor="middle" className="font-mono text-[10px] font-bold fill-text-primary uppercase tracking-widest">
          Aniket
        </text>

        {/* Analyst branch */}
        <text x="100" y="142" textAnchor="middle" className="font-mono text-[9px] font-bold fill-accent-analyst uppercase tracking-wider">
          Analyst
        </text>
        <text x="60" y="48" textAnchor="middle" className="font-sans text-[9px] fill-text-secondary">
          Tableau
        </text>
        <text x="140" y="48" textAnchor="middle" className="font-sans text-[9px] fill-text-secondary">
          SQL
        </text>

        {/* Engineer branch */}
        <text x="300" y="136" textAnchor="middle" className="font-mono text-[9px] font-bold fill-accent-engineer uppercase tracking-wider">
          Engineer
        </text>
        <text x="350" y="78" textAnchor="middle" className="font-sans text-[9px] fill-text-secondary">
          dbt
        </text>
        <text x="348" y="232" textAnchor="start" className="font-sans text-[9px] fill-text-secondary">
          Snowflake
        </text>

        {/* Scientist branch */}
        <text x="200" y="294" textAnchor="middle" className="font-mono text-[9px] font-bold fill-accent-scientist uppercase tracking-wider">
          Scientist
        </text>
        <text x="120" y="356" textAnchor="middle" className="font-sans text-[9px] fill-text-secondary">
          PyTorch
        </text>
        <text x="280" y="356" textAnchor="middle" className="font-sans text-[9px] fill-text-secondary">
          MLflow
        </text>
      </svg>
    </div>
  );
}
export default DataConstellation;
