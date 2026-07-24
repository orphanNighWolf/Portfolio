import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface Project {
  _id: string;
  title: string;
  category: string;
  shortDescription: string;
  createdAt: string;
  slug: string;
  tags?: string[];
}

interface ProjectsSpotlightProps {
  projects: Project[];
}

export default function ProjectsSpotlight({ projects }: ProjectsSpotlightProps) {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);

  if (!projects || projects.length === 0) return null;

  const activeProject = projects.slice(0, 5)[activeProjectIndex] || projects[0];

  const getProjectAccent = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes("ai") || cat.includes("ml") || cat.includes("agent") || cat.includes("intelligence")) {
      return { 
        accent: "text-accent-ai", 
        border: "border-accent-ai/25", 
        borderL: "border-l-accent-ai", 
        bg: "bg-accent-ai-tint" 
      };
    }
    if (cat.includes("data") || cat.includes("analytics") || cat.includes("dashboard")) {
      return { 
        accent: "text-accent-analytics", 
        border: "border-accent-analytics/25", 
        borderL: "border-l-accent-analytics", 
        bg: "bg-accent-analytics-tint" 
      };
    }
    return { 
      accent: "text-accent-finance-dark", 
      border: "border-accent-finance/25", 
      borderL: "border-l-accent-finance", 
      bg: "bg-accent-finance-tint" 
    };
  };

  const activeProjectColors = getProjectAccent(activeProject.category);

  return (
    <section className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-end border-b border-border pb-4">
        <div className="space-y-1">
          <h2 className="text-h3 font-bold text-text-primary tracking-tight">Code & Engineering Showcases</h2>
          <span className="text-label text-text-muted font-mono block">// RETRIEVING_PROJECT_GALLERY</span>
        </div>
        <Link to="/projects" className="text-label text-text-muted hover:text-accent-ai flex items-center gap-1.5 transition-colors">
          OPEN SPIRAL <ArrowRight size={12} />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Project Sector Table List */}
        <div className="lg:col-span-5 bg-bg-surface border border-border rounded-2xl overflow-hidden shadow-none p-4 flex flex-col justify-between">
          <div>
            <div className="grid grid-cols-3 text-[10px] font-mono text-text-muted uppercase border-b border-border pb-3 mb-2 px-3 tracking-wider font-bold">
              <div>Project</div>
              <div>Domain</div>
              <div className="text-right">Key Focus</div>
            </div>
            
            <div className="space-y-1">
              {projects.slice(0, 5).map((project, index) => {
                const isActive = activeProjectIndex === index;
                
                return (
                  <div
                    key={project._id}
                    onClick={() => setActiveProjectIndex(index)}
                    className={`grid grid-cols-3 items-center py-3.5 px-3 rounded-lg cursor-pointer transition-all duration-200 border-l-[3px] select-none ${
                      isActive 
                        ? 'border-l-accent-ai bg-accent-ai-tint border-y border-r border-border shadow-none' 
                        : 'border-l-transparent hover:bg-bg-elevated/60 hover:border-l-text-muted/30'
                    }`}
                  >
                    <div className={`text-xs font-bold font-display ${isActive ? 'text-text-primary' : 'text-text-secondary'}`}>
                      {project.title}
                    </div>
                    <div className="text-[10px] font-mono text-text-muted truncate uppercase">
                      {project.category}
                    </div>
                    <div className="text-[10px] font-mono text-text-muted text-right truncate">
                      {project.tags && project.tags.length > 0 ? project.tags[0] : 'Engineering'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-border/20 pt-4 mt-4 px-3 flex justify-between items-center text-[10px] font-mono text-text-muted">
            <span>ACTIVE_RECORD // 0{activeProjectIndex + 1}_OF_0{Math.min(projects.length, 5)}</span>
            <span className="animate-pulse">SELECT_TO_SPECIFY</span>
          </div>
        </div>

        {/* Right Column: Dynamic Glass details card preview */}
        <div className="lg:col-span-7 bg-bg-surface border border-border rounded-2xl p-6 shadow-none flex flex-col justify-between min-h-[380px] relative overflow-hidden group">
          {/* Subtle Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.015)_1px,transparent_1px)] bg-[size:12px_12px] pointer-events-none" />
          
          <div className="space-y-6 relative z-10">
            <div className="flex justify-between items-center">
              <span className={`text-[9px] font-mono font-bold tracking-wider px-2.5 py-0.5 rounded-full uppercase border ${activeProjectColors.accent} ${activeProjectColors.border} ${activeProjectColors.bg}`}>
                {activeProject.category}
              </span>
              <span className="text-[10px] font-mono text-text-muted">
                {new Date(activeProject.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short" })}
              </span>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-h3 font-bold text-text-primary font-display tracking-tight leading-none">
                {activeProject.title}
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed max-w-xl">
                {activeProject.shortDescription}
              </p>
            </div>

            {/* Decorative category-based SVG visualization on the right, matching user's image! */}
            <div className="w-full h-32 bg-bg-elevated border border-border rounded-xl flex items-center justify-center relative overflow-hidden p-4">
              {/* Dynamic Category SVG */}
              {activeProject.category.toLowerCase().includes("ai") || activeProject.category.toLowerCase().includes("machine") ? (
                /* AI Neural Nodes */
                <svg viewBox="0 0 200 100" className="w-full h-full text-accent-ai/40">
                  <circle cx="40" cy="50" r="4" fill="var(--accent-ai)" className="animate-pulse" />
                  <circle cx="100" cy="30" r="4" fill="var(--accent-ai)" className="opacity-70" />
                  <circle cx="100" cy="70" r="4" fill="var(--accent-ai)" className="opacity-70" />
                  <circle cx="160" cy="50" r="4" fill="var(--accent-ai)" className="animate-pulse" />
                  <line x1="40" y1="50" x2="100" y2="30" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="40" y1="50" x2="100" y2="70" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="100" y1="30" x2="160" y2="50" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="100" y1="70" x2="160" y2="50" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                </svg>
              ) : activeProject.category.toLowerCase().includes("data") || activeProject.category.toLowerCase().includes("analytics") ? (
                /* Data Bar Chart, matching user's image! */
                <svg viewBox="0 0 200 100" className="w-full h-full text-accent-analytics/40">
                  <rect x="20" y="60" width="12" height="30" fill="var(--accent-analytics)" className="opacity-40 animate-pulse" rx="1" style={{ animationDelay: '0.1s' }} />
                  <rect x="50" y="40" width="12" height="50" fill="var(--accent-analytics)" className="opacity-60 animate-pulse" rx="1" style={{ animationDelay: '0.3s' }} />
                  <rect x="80" y="70" width="12" height="20" fill="var(--accent-analytics)" className="opacity-40 animate-pulse" rx="1" style={{ animationDelay: '0.5s' }} />
                  <rect x="110" y="30" width="12" height="60" fill="var(--accent-analytics)" className="opacity-80 animate-pulse" rx="1" style={{ animationDelay: '0.2s' }} />
                  <rect x="140" y="50" width="12" height="40" fill="var(--accent-analytics)" className="opacity-60 animate-pulse" rx="1" style={{ animationDelay: '0.4s' }} />
                  <rect x="170" y="20" width="12" height="70" fill="var(--accent-analytics)" className="animate-pulse" rx="1" style={{ animationDelay: '0.6s' }} />
                  <line x1="10" y1="90" x2="190" y2="90" stroke="currentColor" strokeWidth="1" />
                </svg>
              ) : (
                /* Finance Upward Spline */
                <svg viewBox="0 0 200 100" className="w-full h-full text-accent-finance/40">
                  <path d="M 20,80 Q 70,60 120,40 T 180,20" fill="none" stroke="var(--accent-finance)" strokeWidth="2" strokeLinecap="round" className="animate-pulse" />
                  <circle cx="180" cy="20" r="4" fill="var(--accent-ai)" />
                  <line x1="10" y1="90" x2="190" y2="90" stroke="currentColor" strokeWidth="1" />
                </svg>
              )}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 border-t border-border/20 pt-4 relative z-10">
            {activeProject.tags && activeProject.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {activeProject.tags.slice(0, 3).map((tag: string) => (
                  <span key={tag} className="text-[9px] font-mono text-text-muted bg-bg-surface px-2 py-0.5 rounded border border-border">
                    #{tag.toLowerCase()}
                  </span>
                ))}
              </div>
            )}
            
            <Link
              to={`/project/${activeProject.slug}`}
              className="inline-flex items-center justify-center gap-1.5 bg-accent-ai hover:bg-accent-ai-hover hover:-translate-y-0.5 text-white text-[10px] font-mono font-medium uppercase tracking-wider px-4 py-2.5 rounded-lg shadow-none transition-all duration-150 ease-in-out select-none whitespace-nowrap self-end sm:self-auto"
            >
              COMPILE SPEC &rarr;
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
