import { Link } from "react-router-dom";

interface HeroSectionProps {
  hero: {
    name?: string;
    bio?: string;
  };
}

export default function HeroSection({ hero }: HeroSectionProps) {
  return (
    <section className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-12">
      {/* Left Side Content Block */}
      <div className="lg:col-span-7 space-y-8 text-left">
        {/* Typographic Title Scale */}
        <div className="space-y-4">
          <h1 className="text-h2 md:text-h1 font-bold text-text-primary tracking-tight leading-none">
            Hello, I'm <span className="text-accent-ai">{hero.name || "Alex Mercer"}</span>
          </h1>
          
          {/* Structured Identity Line */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs tracking-wider uppercase font-mono border-l-2 border-border pl-4">
            <span className="text-accent-ai font-semibold">AI Engineer</span>
            <span className="text-text-muted">•</span>
            <span className="text-accent-analytics font-medium">Data Analyst</span>
            <span className="text-text-muted">•</span>
            <span className="text-accent-finance font-light">Financial Advisor</span>
          </div>
        </div>

        <p className="text-body text-text-secondary leading-relaxed max-w-xl">
          {hero.bio || "Quantitative developer modeling deep learning and full-stack systems."}
        </p>

        {/* Primary/Secondary Button Scale */}
        <div className="flex flex-wrap gap-4 pt-2">
          <Link
            to="/about"
            className="bg-accent-ai hover:bg-accent-ai-hover text-white text-xs font-mono font-medium uppercase tracking-wider px-6 py-3 rounded-lg transition-colors duration-150"
          >
            Analyze Profile
          </Link>
          <Link
            to="/contact"
            className="border border-border bg-bg-surface hover:bg-bg-elevated text-text-primary text-xs font-mono font-medium uppercase tracking-wider px-6 py-3 rounded-lg transition-colors duration-150"
          >
            Request Briefing
          </Link>
        </div>
      </div>

      {/* Right Side Signature Visual Element (AI, Data, Finance overlay) */}
      <div className="lg:col-span-5 relative flex items-center justify-center min-h-[300px] lg:min-h-[400px]">
        <div className="absolute inset-0 bg-bg-elevated border border-border rounded-2xl overflow-hidden shadow-none flex items-center justify-center p-6 select-none">
          {/* Subtle Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
          
          {/* Overlapping Signature Motif Diagram */}
          <svg viewBox="0 0 400 400" className="w-full h-full max-w-[320px] relative z-10">
            {/* Coordinates Grid (Analytics domain) */}
            <g className="text-text-muted opacity-30">
              <line x1="40" y1="360" x2="360" y2="360" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="40" y1="40" x2="40" y2="360" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
              <text x="350" y="380" className="text-[10px] font-mono fill-current">X_VAL</text>
              <text x="15" y="50" className="text-[10px] font-mono fill-current">Y_VAL</text>
            </g>

            {/* AI Neural Circle Paths */}
            <g className="text-accent-ai opacity-60">
              <circle cx="200" cy="200" r="110" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 8" />
              <circle cx="200" cy="200" r="80" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" />
              
              {/* Node Intersections */}
              <circle cx="200" cy="90" r="5" fill="currentColor" />
              <circle cx="200" cy="310" r="5" fill="currentColor" />
              <circle cx="90" cy="200" r="5" fill="currentColor" />
              <circle cx="310" cy="200" r="5" fill="currentColor" />
              <path d="M 200,90 L 90,200 L 200,310 L 310,200 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </g>

            {/* Data Bar Graphs (Analytics domain in Green) */}
            <g className="text-accent-analytics opacity-60">
              <rect x="70" y="270" width="16" height="90" fill="currentColor" rx="2" />
              <rect x="110" y="220" width="16" height="140" fill="currentColor" rx="2" />
              <rect x="150" y="290" width="16" height="70" fill="currentColor" rx="2" />
              <rect x="230" y="240" width="16" height="120" fill="currentColor" rx="2" />
              <rect x="270" y="190" width="16" height="170" fill="currentColor" rx="2" />
              <rect x="310" y="260" width="16" height="100" fill="currentColor" rx="2" />
            </g>

            {/* Upward Finance Spline (Advisory domain in Amber with Blue connector dots) */}
            <g className="text-accent-finance">
              <path 
                d="M 40,320 Q 120,280 200,190 T 360,70" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="3.5" 
                strokeLinecap="round"
              />
              {/* Active Sweeping Node & Connectors in Blue */}
              <circle cx="360" cy="70" r="5" fill="var(--accent-ai)" />
              <circle cx="200" cy="190" r="4" fill="var(--accent-ai)" />
              <circle cx="120" cy="280" r="4" fill="var(--accent-ai)" />
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
