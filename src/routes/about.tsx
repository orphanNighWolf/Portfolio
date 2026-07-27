import { createFileRoute } from '@tanstack/react-router'
import { portfolioData } from '../lib/portfolio-data'
import { Briefcase, Calendar, ChevronRight, GraduationCap, Award } from 'lucide-react'

import SectionGuard from '../components/SectionGuard'

export const Route = createFileRoute('/about')({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About | Aniket Saini" },
      { name: "description", content: "Professional background, history, education, and credentials of Aniket Saini." },
      { property: "og:title", content: "About | Aniket Saini" },
      { property: "og:description", content: "Professional background, history, education, and credentials of Aniket Saini." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" }
    ]
  })
})

function AboutPage() {
  const { profile, experience, journey, certificates } = portfolioData;

  return (
    <SectionGuard section="about">
      <div className="max-w-2xl mx-auto space-y-16 py-4 page-transition">
      {/* Editorial Profile Description */}
      <section className="space-y-6">
        <div className="space-y-1 border-b border-border/40 pb-4">
          <h1 className="text-3xl font-serif font-bold tracking-tight text-text-primary">About</h1>
          <span className="text-xs font-mono text-text-muted block uppercase tracking-wider">// ACCESSING_PROFILE_METRICS</span>
        </div>

        <p className="text-xl font-serif text-text-secondary leading-relaxed font-medium">
          {profile.subtitle}
        </p>

        <p className="text-sm text-text-secondary leading-relaxed">
          {profile.bio}
        </p>

        <p className="text-sm text-text-secondary leading-relaxed">
          Focusing on the alignment of data lifecycle layers. Experienced in constructing orchestrations with Apache Airflow, scaling analytical warehouse schemas inside Snowflake, and building reproducible downstream ML configurations using PyTorch and MLflow.
        </p>
      </section>

      {/* Roles & Timeline */}
      <section className="space-y-8">
        <div className="space-y-1 border-b border-border/40 pb-2">
          <h2 className="text-xl font-serif font-bold text-text-primary tracking-tight">Professional History</h2>
          <span className="text-xs font-mono text-text-muted block uppercase tracking-wider">// VERIFYING_EXPERIENCE_HISTORY</span>
        </div>

        <div className="space-y-6 stagger-container">
          {experience.map((exp, idx) => {
            const isScientist = exp.track === "scientist";
            const isEngineer = exp.track === "engineer";
            const labelColor = isScientist 
              ? "text-accent-scientist border-accent-scientist/20 bg-accent-scientist/5" 
              : isEngineer 
              ? "text-accent-engineer border-accent-engineer/20 bg-accent-engineer/5" 
              : "text-accent-analyst border-accent-analyst/20 bg-accent-analyst/5";
            const trackLabel = isScientist ? "Scientist Track" : isEngineer ? "Engineer Track" : "Analyst Track";

            return (
              <div 
                key={idx} 
                className="p-6 rounded-2xl border border-border bg-bg-surface space-y-4 shadow-[0_4px_20px_rgba(23,23,23,0.01)] hover:border-text-primary/10 transition-all duration-300 stagger-item"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div className="space-y-1">
                    <span className={`inline-block text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${labelColor}`}>
                      {trackLabel}
                    </span>
                    <h3 className="text-md font-bold text-text-primary pt-1">{exp.role}</h3>
                    <span className="text-xs text-text-secondary font-medium block">{exp.company}</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border bg-bg-elevated/40 text-text-secondary text-[9px] font-mono self-start">
                    <Calendar size={11} /> {exp.period}
                  </div>
                </div>

                <ul className="space-y-2 border-t border-border/40 pt-4">
                  {exp.description.map((desc, dIdx) => (
                    <li key={dIdx} className="flex gap-2 text-xs text-text-secondary leading-relaxed">
                      <ChevronRight size={14} className="text-text-muted shrink-0 mt-0.5" />
                      <span>{desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* Education Summary */}
      <section className="space-y-8">
        <div className="space-y-1 border-b border-border/40 pb-2">
          <h2 className="text-xl font-serif font-bold text-text-primary tracking-tight">Academic Foundation</h2>
          <span className="text-xs font-mono text-text-muted block uppercase tracking-wider">// QUERYING_ACADEMIC_CREDENTIALS</span>
        </div>

        <div className="space-y-6 stagger-container">
          {journey.filter(j => j.type === "academic").map((acad, idx) => (
            <div 
              key={idx} 
              className="p-6 rounded-2xl border border-border bg-bg-surface flex flex-col sm:flex-row justify-between gap-4 shadow-[0_4px_20px_rgba(23,23,23,0.01)] hover:border-text-primary/10 transition-all duration-300 stagger-item"
            >
              <div className="flex gap-4 items-start">
                <div className="p-2 rounded-xl bg-bg-elevated text-text-secondary border border-border">
                  <GraduationCap size={18} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-md font-bold text-text-primary">{acad.title}</h3>
                  <p className="text-xs text-text-secondary font-medium">{acad.subtitle}</p>
                  <p className="text-xs text-text-muted leading-relaxed pt-1">{acad.description}</p>
                </div>
              </div>
              <div className="text-right sm:self-center">
                <span className="text-md font-bold text-accent-terracotta font-mono">{acad.year}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Credentials List */}
      <section className="space-y-8">
        <div className="space-y-1 border-b border-border/40 pb-2">
          <h2 className="text-xl font-serif font-bold text-text-primary tracking-tight">Certificates & Credentials</h2>
          <span className="text-xs font-mono text-text-muted block uppercase tracking-wider">// SYSTEM_VERIFIED_DEGREES</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {certificates.map((cred, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-border bg-bg-surface flex items-center justify-between shadow-[0_4px_20px_rgba(23,23,23,0.01)]">
              <div className="flex items-center gap-3">
                <Award size={16} className="text-accent-terracotta shrink-0" />
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-text-primary block leading-tight">{cred.name}</span>
                  <span className="text-[9px] font-mono text-text-muted block uppercase tracking-wider">{cred.issuer}</span>
                </div>
              </div>
              {cred.date && <span className="text-[10px] font-mono text-text-secondary font-semibold">{cred.date}</span>}
            </div>
          ))}
        </div>
      </section>
    </div>
  </SectionGuard>
  );
}
export default AboutPage;
