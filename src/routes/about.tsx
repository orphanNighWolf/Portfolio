import { createFileRoute } from '@tanstack/react-router'
import { portfolioData } from '../lib/portfolio-data'
import { Briefcase, Calendar, ChevronRight, GraduationCap } from 'lucide-react'

export const Route = createFileRoute('/about')({ component: AboutPage })

function AboutPage() {
  const { profile, experience, journey } = portfolioData;

  return (
    <div className="space-y-16 page-transition">
      {/* Bio Header */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-8 space-y-4">
          <div className="space-y-1 border-b border-border/40 pb-4">
            <h1 className="text-3xl font-bold tracking-tight text-text-primary">About Me</h1>
            <span className="text-xs font-mono text-text-muted block">// ACCESSING_PROFILE_METRICS</span>
          </div>
          <p className="text-lg font-medium text-accent-terracotta">{profile.subtitle}</p>
          <p className="text-text-secondary text-sm leading-relaxed max-w-2xl">{profile.bio}</p>
          <p className="text-text-muted text-xs leading-relaxed max-w-2xl">
            Currently pursuing research assistant projects mapping downstream biological configurations in deep learning networks. Focused on compiling high-integrity data streams and robust schemas.
          </p>
        </div>
        <div className="md:col-span-4 bg-bg-elevated/40 border border-border/60 rounded-2xl p-6 space-y-4">
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-text-primary border-b border-border/40 pb-2">
            // info_records
          </h3>
          <div className="space-y-2.5 text-xs">
            <div>
              <span className="text-text-muted block font-mono">LOCATION</span>
              <span className="text-text-primary font-medium">Remote / India</span>
            </div>
            <div>
              <span className="text-text-muted block font-mono">ROLE</span>
              <span className="text-text-primary font-medium">CS Graduate / Data Track</span>
            </div>
            <div>
              <span className="text-text-muted block font-mono">CONTACT</span>
              <span className="text-text-primary font-medium">{profile.email}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section className="space-y-8">
        <div className="space-y-1 border-b border-border/40 pb-4">
          <h2 className="text-xl font-bold tracking-tight text-text-primary">Professional Experience</h2>
          <span className="text-xs font-mono text-text-muted block">// VERIFYING_EXPERIENCE_HISTORY</span>
        </div>

        <div className="relative border-l border-border pl-6 ml-4 space-y-8 py-2">
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
              <div key={idx} className="relative">
                {/* Timeline marker */}
                <div className={`absolute -left-[35px] top-1.5 w-4 h-4 rounded-full border-4 border-bg-base ${accentColor.split(" ")[0]}`} />

                <div className="p-6 rounded-2xl border border-border/60 bg-bg-surface space-y-4 shadow-sm hover:shadow-md transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest block">// {trackLabel}</span>
                      <h3 className="text-md font-bold text-text-primary">{exp.role}</h3>
                      <span className="text-xs text-text-secondary font-medium">{exp.company}</span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/60 bg-bg-elevated/40 text-text-secondary text-[10px] font-mono self-start">
                      <Calendar size={11} /> {exp.period}
                    </div>
                  </div>

                  <ul className="space-y-2">
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
      </section>

      {/* Education Summary */}
      <section className="space-y-8">
        <div className="space-y-1 border-b border-border/40 pb-4">
          <h2 className="text-xl font-bold tracking-tight text-text-primary">Academic Foundation</h2>
          <span className="text-xs font-mono text-text-muted block">// QUERYING_ACADEMIC_CREDENTIALS</span>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {journey.filter(j => j.type === "academic").map((acad, idx) => (
            <div key={idx} className="p-6 rounded-2xl border border-border/60 bg-bg-surface flex flex-col sm:flex-row justify-between gap-4">
              <div className="flex gap-4 items-start">
                <div className="p-3 rounded-xl bg-accent-scientist/5 text-accent-scientist">
                  <GraduationCap size={20} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-md font-bold text-text-primary">{acad.title}</h3>
                  <p className="text-xs text-text-secondary font-medium">{acad.subtitle}</p>
                  <p className="text-xs text-text-muted max-w-xl">{acad.description}</p>
                </div>
              </div>
              <div className="text-right sm:self-center">
                <span className="text-lg font-bold text-accent-scientist font-mono">{acad.year}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
export default AboutPage;
