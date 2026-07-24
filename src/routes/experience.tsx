import { createFileRoute } from '@tanstack/react-router'
import { portfolioData } from '../lib/portfolio-data'
import { Briefcase, Calendar, ChevronRight } from 'lucide-react'

export const Route = createFileRoute('/experience')({ component: ExperiencePage })

function ExperiencePage() {
  const { experience } = portfolioData;

  return (
    <div className="space-y-12 page-transition">
      {/* Header */}
      <section className="space-y-4">
        <div className="space-y-1 border-b border-border/40 pb-4">
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">Professional Journey</h1>
          <span className="text-xs font-mono text-text-muted block">// VERIFYING_EXPERIENCE_HISTORY</span>
        </div>
        <p className="text-text-secondary text-sm max-w-2xl leading-relaxed">
          Chronological index of positions and research assistant roles held across analytics, engineering, and science.
        </p>
      </section>

      {/* Timeline */}
      <div className="relative border-l border-border pl-6 ml-4 space-y-12 py-4">
        {experience.map((exp, idx) => {
          const isScientist = exp.track === "scientist";
          const isEngineer = exp.track === "engineer";
          const accentColor = isScientist 
            ? "bg-accent-scientist text-white" 
            : isEngineer 
            ? "bg-accent-engineer text-white" 
            : "bg-accent-analyst text-white";
          const trackLabel = isScientist ? "Scientist Track" : isEngineer ? "Engineer Track" : "Analyst Track";

          return (
            <div key={idx} className="relative stagger-item">
              {/* Timeline marker */}
              <div className={`absolute -left-[35px] top-1.5 w-4 h-4 rounded-full border-4 border-bg-base ${accentColor.split(" ")[0]}`} />

              <div className="glass-panel rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 space-y-4 border border-border/60">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest block">// {trackLabel}</span>
                    <h3 className="text-lg font-bold text-text-primary">{exp.role}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                      <Briefcase size={13} /> {exp.company}
                    </div>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/60 bg-bg-elevated/40 text-text-secondary text-[10px] font-mono self-start">
                    <Calendar size={11} /> {exp.period}
                  </div>
                </div>

                <ul className="space-y-2.5 pt-2">
                  {exp.description.map((desc, dIdx) => (
                    <li key={dIdx} className="flex gap-2 text-xs text-text-secondary leading-relaxed">
                      <ChevronRight size={14} className="text-text-muted shrink-0 mt-0.5" />
                      <span>{desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
