export function StaticConstellation() {
  return (
    <div className="w-full max-w-lg mx-auto aspect-square flex flex-col items-center justify-center p-4">
      {/* Static Constellation Canvas */}
      <svg 
        viewBox="0 0 400 400" 
        className="w-full h-full text-text-primary"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background static halos */}
        <circle cx="200" cy="200" r="140" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="200" cy="200" r="80" stroke="var(--color-border)" strokeWidth="1" strokeDasharray="2 2" />

        {/* Connective Paths (Static Lines) */}
        {/* Center to Analyst */}
        <line x1="200" y1="200" x2="100" y2="120" stroke="var(--color-accent-analyst)" strokeWidth="1.5" strokeOpacity="0.4" />
        {/* Center to Engineer */}
        <line x1="200" y1="200" x2="300" y2="150" stroke="var(--color-accent-engineer)" strokeWidth="1.5" strokeOpacity="0.4" />
        {/* Center to Scientist */}
        <line x1="200" y1="200" x2="200" y2="310" stroke="var(--color-accent-scientist)" strokeWidth="1.5" strokeOpacity="0.4" />

        {/* Analyst branch dependencies */}
        <line x1="100" y1="120" x2="60" y2="60" stroke="var(--color-border)" strokeWidth="1" />
        <line x1="100" y1="120" x2="140" y2="60" stroke="var(--color-border)" strokeWidth="1" />

        {/* Engineer branch dependencies */}
        <line x1="300" y1="150" x2="350" y2="90" stroke="var(--color-border)" strokeWidth="1" />
        <line x1="300" y1="150" x2="330" y2="220" stroke="var(--color-border)" strokeWidth="1" />

        {/* Scientist branch dependencies */}
        <line x1="200" y1="310" x2="120" y2="340" stroke="var(--color-border)" strokeWidth="1" />
        <line x1="200" y1="310" x2="280" y2="340" stroke="var(--color-border)" strokeWidth="1" />

        {/* Nodes & Halos */}
        {/* Center Core Node: Aniket */}
        <circle cx="200" cy="200" r="14" fill="var(--color-bg-surface)" stroke="var(--color-accent-terracotta)" strokeWidth="3" />
        <circle cx="200" cy="200" r="6" fill="var(--color-accent-terracotta)" />

        {/* Analyst Node */}
        <circle cx="100" cy="120" r="10" fill="var(--color-bg-surface)" stroke="var(--color-accent-analyst)" strokeWidth="2" />
        <circle cx="100" cy="120" r="4" fill="var(--color-accent-analyst)" />

        {/* Engineer Node */}
        <circle cx="300" cy="150" r="10" fill="var(--color-bg-surface)" stroke="var(--color-accent-engineer)" strokeWidth="2" />
        <circle cx="300" cy="150" r="4" fill="var(--color-accent-engineer)" />

        {/* Scientist Node */}
        <circle cx="200" cy="310" r="10" fill="var(--color-bg-surface)" stroke="var(--color-accent-scientist)" strokeWidth="2" />
        <circle cx="200" cy="310" r="4" fill="var(--color-accent-scientist)" />

        {/* Leaf Nodes */}
        {/* Tableau */}
        <circle cx="60" cy="60" r="5" fill="var(--color-bg-surface)" stroke="var(--color-text-muted)" strokeWidth="1.5" />
        {/* SQL */}
        <circle cx="140" cy="60" r="5" fill="var(--color-bg-surface)" stroke="var(--color-text-muted)" strokeWidth="1.5" />
        {/* dbt */}
        <circle cx="350" cy="90" r="5" fill="var(--color-bg-surface)" stroke="var(--color-text-muted)" strokeWidth="1.5" />
        {/* Snowflake */}
        <circle cx="330" cy="220" r="5" fill="var(--color-bg-surface)" stroke="var(--color-text-muted)" strokeWidth="1.5" />
        {/* PyTorch */}
        <circle cx="120" cy="340" r="5" fill="var(--color-bg-surface)" stroke="var(--color-text-muted)" strokeWidth="1.5" />
        {/* MLflow */}
        <circle cx="280" cy="340" r="5" fill="var(--color-bg-surface)" stroke="var(--color-text-muted)" strokeWidth="1.5" />

        {/* Non-overlapping Labels */}
        {/* Center label */}
        <text x="200" y="176" textAnchor="middle" className="font-mono text-[10px] font-bold fill-text-primary uppercase tracking-widest">
          Aniket
        </text>

        {/* Analyst labels */}
        <text x="100" y="142" textAnchor="middle" className="font-mono text-[9px] font-bold fill-accent-analyst uppercase tracking-wider">
          Analyst
        </text>
        <text x="60" y="48" textAnchor="middle" className="font-sans text-[9px] fill-text-secondary">
          Tableau
        </text>
        <text x="140" y="48" textAnchor="middle" className="font-sans text-[9px] fill-text-secondary">
          SQL
        </text>

        {/* Engineer labels */}
        <text x="300" y="136" textAnchor="middle" className="font-mono text-[9px] font-bold fill-accent-engineer uppercase tracking-wider">
          Engineer
        </text>
        <text x="350" y="78" textAnchor="middle" className="font-sans text-[9px] fill-text-secondary">
          dbt
        </text>
        <text x="348" y="232" textAnchor="start" className="font-sans text-[9px] fill-text-secondary">
          Snowflake
        </text>

        {/* Scientist labels */}
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
export default StaticConstellation;
