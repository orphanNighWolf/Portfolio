import { createFileRoute } from '@tanstack/react-router'
import { portfolioData } from '../lib/portfolio-data'
import { useState } from 'react'
import { Github, Folder, ExternalLink } from 'lucide-react'

export const Route = createFileRoute('/projects')({ component: Projects })

function Projects() {
  const { projects } = portfolioData;
  const [filter, setFilter] = useState<"All" | "Analyst" | "Engineer" | "Scientist">("All");

  const filteredProjects = filter === "All" 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <div className="space-y-12 page-transition">
      {/* Header */}
      <section className="space-y-4">
        <div className="space-y-1 border-b border-border/40 pb-4">
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">Projects & Showcases</h1>
          <span className="text-xs font-mono text-text-muted block">// SELECTING_TECHNICAL_IMPLEMENTATIONS</span>
        </div>
        <p className="text-text-secondary text-sm max-w-2xl leading-relaxed">
          Explore a curated selection of systems and analytical platforms constructed across the data track.
        </p>
      </section>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {(["All", "Analyst", "Engineer", "Scientist"] as const).map((cat) => {
          const isActive = filter === cat;
          const activeStyle = cat === "Analyst" 
            ? "bg-accent-analyst text-white shadow-sm" 
            : cat === "Engineer" 
            ? "bg-accent-engineer text-white shadow-sm" 
            : cat === "Scientist" 
            ? "bg-accent-scientist text-white shadow-sm" 
            : "bg-text-primary text-white shadow-sm";

          return (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                isActive 
                  ? activeStyle 
                  : "bg-bg-surface border border-border text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((project) => {
          const isScientist = project.category === "Scientist";
          const isEngineer = project.category === "Engineer";
          const accentColor = isScientist ? "text-accent-scientist" : isEngineer ? "text-accent-engineer" : "text-accent-analyst";
          const accentBorder = isScientist ? "hover:border-accent-scientist/40" : isEngineer ? "hover:border-accent-engineer/40" : "hover:border-accent-analyst/40";
          const accentBg = isScientist ? "bg-accent-scientist/5" : isEngineer ? "bg-accent-engineer/5" : "bg-accent-analyst/5";
          
          return (
            <div
              key={project.id}
              className={`p-6 rounded-2xl border border-border/60 bg-bg-surface flex flex-col justify-between transition-all duration-300 hover:shadow-md ${accentBorder}`}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className={`p-2 rounded-lg ${accentBg} ${accentColor}`}>
                    <Folder size={18} />
                  </div>
                  <span className={`text-[9px] font-mono font-bold tracking-wider px-2.5 py-0.5 rounded-full uppercase border border-current bg-transparent ${accentColor}`}>
                    {project.category}
                  </span>
                </div>
                
                <h3 className="text-md font-bold text-text-primary">{project.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{project.description}</p>
              </div>

              <div className="pt-6 mt-6 border-t border-border/20">
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-[9px] font-mono text-text-muted bg-bg-elevated px-2 py-0.5 rounded">
                      #{tag.toLowerCase()}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3 text-xs font-mono">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-text-secondary hover:text-text-primary transition-colors"
                    >
                      <Github size={14} /> Repository
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-text-secondary hover:text-text-primary transition-colors"
                    >
                      <ExternalLink size={14} /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
