import { createFileRoute } from '@tanstack/react-router'
import { portfolioData } from '../lib/portfolio-data'
import { useState } from 'react'
import { Github, Folder, ExternalLink, Search } from 'lucide-react'

export const Route = createFileRoute('/projects')({
  component: ProjectsPage,
  head: () => ({
    meta: [
      { title: "Projects | Aniket Saini" },
      { name: "description", content: "Filterable and searchable portfolio of systems, databases, and predictive models." },
      { property: "og:title", content: "Projects | Aniket Saini" },
      { property: "og:description", content: "Filterable and searchable portfolio of systems, databases, and predictive models." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" }
    ]
  })
})

function ProjectsPage() {
  const { projects } = portfolioData;
  const [filter, setFilter] = useState<"All" | "Analyst" | "Engineer" | "Scientist">("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = projects.filter((project) => {
    const matchesCategory = filter === "All" || project.category === filter;
    const matchesSearch = 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-12 page-transition">
      {/* Header */}
      <section className="space-y-4">
        <div className="space-y-1 border-b border-border/40 pb-4">
          <h1 className="text-3xl font-serif font-bold tracking-tight text-text-primary">Projects</h1>
          <span className="text-xs font-mono text-text-muted block uppercase tracking-wider">// SELECTING_TECHNICAL_IMPLEMENTATIONS</span>
        </div>
        <p className="text-text-secondary text-sm max-w-2xl leading-relaxed">
          Curated index of analytical pipelines, database schemas, and ML pipelines constructed across the development track.
        </p>
      </section>

      {/* Controls Bar (Filter + Search) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {(["All", "Analyst", "Engineer", "Scientist"] as const).map((cat) => {
            const isActive = filter === cat;
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all cursor-pointer ${
                  isActive 
                    ? "bg-accent-terracotta text-white shadow-sm" 
                    : "bg-bg-surface border border-border text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search Input Box */}
        <div className="relative max-w-xs w-full">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
            <Search size={14} />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects or tags..."
            className="w-full bg-bg-surface border border-border rounded-xl pl-9 pr-4 py-2 text-xs text-text-primary focus:border-accent-terracotta focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Projects Grid of flat paper cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-container">
        {filteredProjects.map((project) => {
          const isScientist = project.category === "Scientist";
          const isEngineer = project.category === "Engineer";
          const accentLabel = isScientist 
            ? "text-accent-scientist border-accent-scientist/20 bg-accent-scientist/5" 
            : isEngineer 
            ? "text-accent-engineer border-accent-engineer/20 bg-accent-engineer/5" 
            : "text-accent-analyst border-accent-analyst/20 bg-accent-analyst/5";
          
          return (
            <div
              key={project.id}
              className="p-6 rounded-2xl border border-border bg-bg-surface flex flex-col justify-between hover:border-text-primary/10 transition-all duration-300 shadow-[0_4px_20px_rgba(23,23,23,0.01)] stagger-item"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="p-2 rounded-xl bg-bg-elevated border border-border text-text-secondary">
                    <Folder size={18} />
                  </div>
                  <span className={`text-[9px] font-mono font-bold tracking-wider px-2.5 py-0.5 rounded border uppercase ${accentLabel}`}>
                    {project.category}
                  </span>
                </div>
                
                <h3 className="text-md font-serif font-bold text-text-primary">{project.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{project.description}</p>
              </div>

              <div className="pt-6 mt-6 border-t border-border/40">
                {/* Tags in Monospace */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.tags.map((tag) => (
                    <span key={tag} className="text-[9px] font-mono text-text-muted bg-bg-elevated px-2 py-0.5 rounded border border-border/40">
                      #{tag.toLowerCase()}
                    </span>
                  ))}
                </div>

                {/* External repository links */}
                <div className="flex gap-4 text-xs font-mono">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-text-secondary hover:text-accent-terracotta transition-colors"
                    >
                      <Github size={13} /> Repository
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-text-secondary hover:text-accent-terracotta transition-colors"
                    >
                      <ExternalLink size={13} /> Live Demo
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
export default ProjectsPage;
