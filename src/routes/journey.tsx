import { createFileRoute } from '@tanstack/react-router'
import { portfolioData } from '../lib/portfolio-data'
import { GraduationCap, Briefcase, Zap } from 'lucide-react'

export const Route = createFileRoute('/journey')({ component: JourneyPage })

function JourneyPage() {
  const { journey } = portfolioData;

  const getIcon = (type: "academic" | "career" | "project") => {
    switch (type) {
      case "academic":
        return <GraduationCap size={16} className="text-accent-scientist" />;
      case "career":
        return <Briefcase size={16} className="text-accent-engineer" />;
      default:
        return <Zap size={16} className="text-accent-analyst" />;
    }
  };

  return (
    <div className="space-y-12 page-transition">
      {/* Header */}
      <section className="space-y-4">
        <div className="space-y-1 border-b border-border/40 pb-4">
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">Journey Milestones</h1>
          <span className="text-xs font-mono text-text-muted block">// TRACKING_ACADEMIC_AND_CAREER_MILESTONES</span>
        </div>
        <p className="text-text-secondary text-sm max-w-2xl leading-relaxed">
          Historical overview of key academic achievements, career jumps, and milestone project deployments.
        </p>
      </section>

      {/* Grid of milestones */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {journey.map((item, idx) => (
          <div
            key={idx}
            className="p-6 rounded-2xl border border-border/60 bg-bg-surface flex flex-col justify-between hover:border-border transition-all duration-300 stagger-item"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-accent-engineer font-mono">{item.year}</span>
                <div className="p-2 rounded-lg bg-bg-elevated">
                  {getIcon(item.type)}
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-md font-bold text-text-primary">{item.title}</h3>
                <span className="text-xs font-mono text-text-muted">{item.subtitle}</span>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed">{item.description}</p>
            </div>
            <div className="pt-4 mt-4 border-t border-border/20 flex items-center justify-between text-[10px] font-mono text-text-muted uppercase">
              <span>status: achieved</span>
              <span>type: {item.type}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
