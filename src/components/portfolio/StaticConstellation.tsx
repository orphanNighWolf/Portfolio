export function StaticConstellation() {
  return (
    <div className="w-full max-w-lg mx-auto aspect-square flex flex-col items-center justify-center p-4">
      {/* Static Constellation Canvas SVG fallback */}
      <svg 
        viewBox="0 0 400 400" 
        className="w-full h-full text-text-primary"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background static halos */}
        <circle cx="200" cy="200" r="140" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="6 6" />
        <circle cx="200" cy="200" r="80" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="3 3" />

        {/* Connective Paths (Static Lines in ink/20) */}
        <g stroke="rgba(23, 23, 23, 0.15)" strokeWidth="1.2">
          {/* Core to branches */}
          <line x1="200" y1="200" x2="100" y2="120" />
          <line x1="200" y1="200" x2="300" y2="150" />
          <line x1="200" y1="200" x2="200" y2="310" />

          {/* Branch dependencies */}
          <line x1="100" y1="120" x2="60" y2="60" />
          <line x1="100" y1="120" x2="140" y2="60" />
          <line x1="300" y1="150" x2="350" y2="90" />
          <line x1="300" y1="150" x2="330" y2="220" />
          <line x1="200" y1="310" x2="120" y2="340" />
          <line x1="200" y1="310" x2="280" y2="340" />
        </g>

        {/* Static Halos around Signal Nodes (Terracotta, opacity 0.15) */}
        <circle cx="60" cy="60" r="10" stroke="rgba(194, 89, 63, 0.15)" strokeWidth="4" />
        <circle cx="140" cy="60" r="10" stroke="rgba(194, 89, 63, 0.15)" strokeWidth="4" />
        <circle cx="350" cy="90" r="10" stroke="rgba(194, 89, 63, 0.15)" strokeWidth="4" />
        <circle cx="330" cy="220" r="10" stroke="rgba(194, 89, 63, 0.15)" strokeWidth="4" />
        <circle cx="120" cy="340" r="10" stroke="rgba(194, 89, 63, 0.15)" strokeWidth="4" />
        <circle cx="280" cy="340" r="10" stroke="rgba(194, 89, 63, 0.15)" strokeWidth="4" />

        {/* Core center node */}
        <circle cx="200" cy="200" r="14" fill="var(--color-bg-surface)" stroke="var(--color-accent-terracotta)" strokeWidth="3" />
        <circle cx="200" cy="200" r="6" fill="var(--color-accent-terracotta)" />

        {/* Branch main nodes */}
        <circle cx="100" cy="120" r="8" fill="var(--color-bg-surface)" stroke="rgba(23, 23, 23, 0.4)" strokeWidth="2" />
        <circle cx="300" cy="150" r="8" fill="var(--color-bg-surface)" stroke="rgba(23, 23, 23, 0.4)" strokeWidth="2" />
        <circle cx="200" cy="310" r="8" fill="var(--color-bg-surface)" stroke="rgba(23, 23, 23, 0.4)" strokeWidth="2" />

        {/* Signal Nodes (Core terracotta) */}
        <circle cx="60" cy="60" r="5" fill="var(--color-accent-terracotta)" />
        <circle cx="140" cy="60" r="5" fill="var(--color-accent-terracotta)" />
        <circle cx="350" cy="90" r="5" fill="var(--color-accent-terracotta)" />
        <circle cx="330" cy="220" r="5" fill="var(--color-accent-terracotta)" />
        <circle cx="120" cy="340" r="5" fill="var(--color-accent-terracotta)" />
        <circle cx="280" cy="340" r="5" fill="var(--color-accent-terracotta)" />

        {/* Non-overlapping Labels in IBM Plex Mono */}
        {/* Core label */}
        <text x="200" y="176" textAnchor="middle" className="font-mono text-[10px] font-bold fill-text-primary uppercase tracking-widest">
          Aniket
        </text>

        {/* Branch titles */}
        <text x="100" y="142" textAnchor="middle" className="font-mono text-[9px] font-bold fill-text-secondary uppercase tracking-wider">
          Analyst
        </text>
        <text x="300" y="136" textAnchor="middle" className="font-mono text-[9px] font-bold fill-text-secondary uppercase tracking-wider">
          Engineer
        </text>
        <text x="200" y="294" textAnchor="middle" className="font-mono text-[9px] font-bold fill-text-secondary uppercase tracking-wider">
          Scientist
        </text>

        {/* Signals labels (IBM Plex Mono) */}
        <text x="60" y="44" textAnchor="middle" className="font-mono-alt text-[9px] font-medium fill-text-primary">
          Tableau
        </text>
        <text x="140" y="44" textAnchor="middle" className="font-mono-alt text-[9px] font-medium fill-text-primary">
          SQL
        </text>
        <text x="350" y="74" textAnchor="middle" className="font-mono-alt text-[9px] font-medium fill-text-primary">
          dbt
        </text>
        <text x="345" y="224" textAnchor="start" className="font-mono-alt text-[9px] font-medium fill-text-primary">
          Snowflake
        </text>
        <text x="120" y="360" textAnchor="middle" className="font-mono-alt text-[9px] font-medium fill-text-primary">
          PyTorch
        </text>
        <text x="280" y="360" textAnchor="middle" className="font-mono-alt text-[9px] font-medium fill-text-primary">
          MLflow
        </text>
      </svg>
    </div>
  );
}
export default StaticConstellation;
