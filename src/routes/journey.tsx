import { createFileRoute } from '@tanstack/react-router'
import { portfolioData } from '../lib/portfolio-data'
import { GraduationCap, Briefcase, Zap } from 'lucide-react'

import SectionGuard from '../components/SectionGuard'

export const Route = createFileRoute('/journey')({
  component: JourneyPage,
  head: () => ({
    meta: [
      { title: "Journey | Aniket Saini" },
      { name: "description", content: "Chronological milestone log of key career jumps, academic degrees, and deployments." },
      { property: "og:title", content: "Journey | Aniket Saini" },
      { property: "og:description", content: "Chronological milestone log of key career jumps, academic degrees, and deployments." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" }
    ]
  })
})

function JourneyPage() {
  const { journey } = portfolioData;

  const getIcon = (type: "academic" | "career" | "project") => {
    switch (type) {
      case "academic":
        return <GraduationCap size={14} className="text-accent-scientist" />;
      case "career":
        return <Briefcase size={14} className="text-accent-engineer" />;
      default:
        return <Zap size={14} className="text-accent-analyst" />;
    }
  };

  return (
    <SectionGuard section="journey">
      <div className="max-w-3xl mx-auto space-y-12 page-transition">
      {/* Header */}
      <section className="space-y-4">
        <div className="space-y-1 border-b border-border/40 pb-4">
          <h1 className="text-3xl font-serif font-bold tracking-tight text-text-primary">Journey</h1>
          <span className="text-xs font-mono text-text-muted block uppercase tracking-wider">// TRACKING_ACADEMIC_AND_CAREER_MILESTONES</span>
        </div>
        <p className="text-text-secondary text-sm leading-relaxed">
          Chronological milestone logs mapping academic degrees, engineering advancements, and critical systems deployments.
        </p>
      </section>

      {/* Chronological Milestone log: left mono date, right serif title + description */}
      <div className="divide-y divide-border/60 border-t border-b border-border/60 stagger-container">
        {journey.map((item, idx) => (
          <div
            key={idx}
            className="grid grid-cols-1 md:grid-cols-12 gap-6 py-8 items-start hover:bg-bg-elevated/20 transition-colors stagger-item"
          >
            {/* Left Column: Monospace date & marker */}
            <div className="md:col-span-3 flex items-center md:flex-col md:items-start gap-3">
              <span className="text-lg font-bold text-accent-terracotta font-mono leading-none">
                {item.year}
              </span>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-border bg-bg-surface text-text-muted text-[8px] font-mono uppercase tracking-widest leading-none">
                {getIcon(item.type)} {item.type}
              </div>
            </div>

            {/* Right Column: Serif Title & Body content */}
            <div className="md:col-span-9 space-y-2">
              <div>
                <h3 className="text-lg font-serif font-bold text-text-primary leading-tight">
                  {item.title}
                </h3>
                <span className="text-xs font-mono text-text-muted uppercase tracking-wider block pt-0.5">
                  // {item.subtitle}
                </span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed max-w-xl">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      </div>
    </SectionGuard>
  );
}
export default JourneyPage;
