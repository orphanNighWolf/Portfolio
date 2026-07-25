import { createFileRoute, Link } from '@tanstack/react-router'
import { portfolioData } from '../lib/portfolio-data'
import { ArrowRight, BarChart2, Database, Terminal, Cpu, ArrowUpRight } from 'lucide-react'
import { useReducedMotion } from '../hooks/use-reduced-motion'
import { DataConstellation } from '../components/portfolio/DataConstellation'
import { StaticConstellation } from '../components/portfolio/StaticConstellation'

import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/axios'

export const Route = createFileRoute('/')({
  component: Home,
  head: () => ({
    meta: [
      { title: "Aniket Saini | Data Portfolio" },
      { name: "description", content: "Personal portfolio of Aniket Saini, master's student on a data analyst -> engineer -> scientist track." },
      { property: "og:title", content: "Aniket Saini | Data Portfolio" },
      { property: "og:description", content: "Personal portfolio of Aniket Saini, master's student on a data analyst -> engineer -> scientist track." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" }
    ]
  })
})

function Home() {
  const { profile, projects, skills, blogs } = portfolioData;
  const isReduced = useReducedMotion();

  const { data: serverSettings } = useQuery({
    queryKey: ["global-settings"],
    queryFn: async () => {
      const res = await api.get("/settings");
      return res.data.data;
    },
    staleTime: 30 * 1000,
  });

  const enabledSections = serverSettings?.enabledSections || {};

  const tracks = [
    {
      id: "analyst",
      title: "Data Analyst",
      icon: <BarChart2 className="text-accent-analyst" size={20} />,
      accentClass: "border-accent-analyst/30 hover:border-accent-analyst/70 text-accent-analyst bg-accent-analyst/5",
      textClass: "text-accent-analyst",
      description: "Extracting actionable intelligence, building interactive dashboards, and querying warehouse instances.",
      tech: ["PostgreSQL", "SQL", "Tableau", "PowerBI"]
    },
    {
      id: "engineer",
      title: "Data Engineer",
      icon: <Database className="text-accent-engineer" size={20} />,
      accentClass: "border-accent-engineer/30 hover:border-accent-engineer/70 text-accent-engineer bg-accent-engineer/5",
      textClass: "text-accent-engineer",
      description: "Designing robust orchestrations, building clean ELT pipelines, and scaling cloud data warehouse schemas.",
      tech: ["dbt", "Airflow", "Snowflake", "PySpark"]
    },
    {
      id: "scientist",
      title: "Data Scientist",
      icon: <Terminal className="text-accent-scientist" size={20} />,
      accentClass: "border-accent-scientist/30 hover:border-accent-scientist/70 text-accent-scientist bg-accent-scientist/5",
      textClass: "text-accent-scientist",
      description: "Developing custom deep learning models, training neural architectures, and deploying predictive pipelines.",
      tech: ["PyTorch", "scikit-learn", "MLflow", "Deep Learning"]
    }
  ];

  return (
    <div className="space-y-24 page-transition">
      {/* 2-Column Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-6">
        {/* Left Column: Typographic block */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest block">
              // ANALYST · ENGINEER · SCIENTIST
            </span>
            <h1 className="text-5xl sm:text-7xl font-serif font-bold text-text-primary leading-tight">
              Aniket Saini<span className="text-accent-terracotta">.</span>
            </h1>
          </div>

          <p className="text-md sm:text-lg font-medium text-text-secondary leading-relaxed max-w-xl">
            Master's student on a data analyst → engineer → scientist track. Building high-throughput schemas and predictive pipelines.
          </p>

          {/* Compact Info Tiles */}
          <div className="grid grid-cols-2 gap-4 max-w-sm pt-2">
            <div className="p-4 rounded-2xl border border-border bg-bg-surface flex flex-col justify-between shadow-[0_4px_20px_rgba(23,23,23,0.02)]">
              <span className="text-[9px] font-mono text-text-muted uppercase tracking-wider block">// Status</span>
              <span className="text-xs font-semibold text-text-primary flex items-center gap-1.5 pt-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-analyst animate-pulse" /> Available
              </span>
            </div>
            <div className="p-4 rounded-2xl border border-border bg-bg-surface flex flex-col justify-between shadow-[0_4px_20px_rgba(23,23,23,0.02)]">
              <span className="text-[9px] font-mono text-text-muted uppercase tracking-wider block">// Base</span>
              <span className="text-xs font-semibold text-text-primary pt-1.5">India · Remote</span>
            </div>
          </div>

          {/* Status Label & Actions */}
          <div className="space-y-4 pt-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/80 bg-bg-surface text-text-secondary text-[10px] font-mono uppercase tracking-wider shadow-sm">
              {isReduced ? (
                <>
                  <Cpu size={12} /> Signal graph · static view / Calm
                </>
              ) : (
                <>
                  <Cpu size={12} className="animate-pulse text-accent-terracotta" /> Platform Online // CS & Analytics
                </>
              )}
            </div>

            <div className="flex gap-4">
              <Link
                to="/projects"
                className="px-5 py-2.5 rounded-xl bg-accent-terracotta hover:opacity-90 text-white text-xs font-mono uppercase tracking-wider transition-opacity shadow-sm"
              >
                Explore Projects
              </Link>
              <Link
                to="/about"
                className="px-5 py-2.5 rounded-xl border border-border hover:bg-bg-elevated text-text-primary text-xs font-mono uppercase tracking-wider transition-colors"
              >
                View Bio
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Canvas 2D Constellation */}
        <div className="lg:col-span-5 flex justify-center">
          {isReduced ? <StaticConstellation /> : <DataConstellation />}
        </div>
      </section>

      {/* Loose 2-Column Grid Below Hero */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start border-t border-border/45 pt-16">
        
        {/* Left Column: Growth Tracks Stack */}
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-serif font-bold text-text-primary tracking-tight">Growth Tracks</h2>
            <span className="text-[10px] text-text-muted font-mono block">// PROGRESSION_ANALYSIS_METRICS</span>
          </div>

          <div className="space-y-6 stagger-container">
            {tracks.map((track) => (
              <div
                key={track.id}
                className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between hover:-translate-y-1 stagger-item ${track.accentClass}`}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    {track.icon}
                    <span className="text-[9px] font-mono tracking-widest uppercase">
                      {track.id}_layer
                    </span>
                  </div>
                  <h3 className="text-md font-bold text-text-primary">{track.title}</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">{track.description}</p>
                </div>
                <div className="pt-4 border-t border-border/20 mt-6">
                  <span className="text-[9px] font-mono text-text-muted block mb-1.5 uppercase tracking-wider">// core_tech</span>
                  <div className="flex flex-wrap gap-1.5">
                    {track.tech.map((t) => (
                      <span key={t} className="text-[9px] font-mono px-2 py-0.5 rounded border border-border/40 bg-bg-surface text-text-secondary">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Featured Projects Stack */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex justify-between items-end pb-1">
            <div className="space-y-1">
              <h2 className="text-xl font-serif font-bold text-text-primary tracking-tight">Featured Showcases</h2>
              <span className="text-[10px] text-text-muted font-mono block">// COMPILED_PROJECT_RECORDS</span>
            </div>
            <Link to="/projects" className="text-xs font-mono text-text-muted hover:text-accent-terracotta flex items-center gap-1 transition-colors">
              VIEW ALL <ArrowRight size={12} />
            </Link>
          </div>

          <div className="space-y-6 stagger-container">
            {projects.slice(0, 2).map((project) => {
              const isScientist = project.category === "Scientist";
              const isEngineer = project.category === "Engineer";
              const accentText = isScientist ? "text-accent-scientist" : isEngineer ? "text-accent-engineer" : "text-accent-analyst";
              const accentBorder = isScientist ? "hover:border-accent-scientist/40" : isEngineer ? "hover:border-accent-engineer/40" : "hover:border-accent-analyst/40";
              
              return (
                <div
                  key={project.id}
                  className={`p-6 rounded-2xl border border-border/60 bg-bg-surface flex flex-col justify-between transition-all duration-300 hover:shadow-md stagger-item ${accentBorder}`}
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <span className={`text-[9px] font-mono font-bold tracking-wider px-2.5 py-0.5 rounded-full uppercase border border-current bg-transparent ${accentText}`}>
                        {project.category}
                      </span>
                    </div>
                    <h3 className="text-md font-bold text-text-primary">{project.title}</h3>
                    <p className="text-xs text-text-secondary leading-relaxed">{project.description}</p>
                  </div>
                  <div className="pt-6 flex flex-wrap gap-1.5 mt-4 border-t border-border/20">
                    {project.tags.map((tag) => (
                      <span key={tag} className="text-[9px] font-mono text-text-muted bg-bg-elevated px-2 py-0.5 rounded">
                        #{tag.toLowerCase()}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Competencies */}
      <section className="space-y-8 border-t border-border/45 pt-16">
        <div className="space-y-1">
          <h2 className="text-xl font-serif font-bold text-text-primary tracking-tight">Core Competencies</h2>
          <span className="text-[10px] text-text-muted font-mono block">// CORE_TECH_COMPILATION</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 stagger-container">
          {skills.slice(0, 8).map((skill) => (
            <div key={skill.name} className="p-4 rounded-xl border border-border/40 bg-bg-surface flex flex-col justify-between stagger-item shadow-sm">
              <span className="text-xs font-medium text-text-primary">{skill.name}</span>
              <div className="flex gap-0.5 mt-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 w-full rounded-full ${
                      i < skill.level 
                        ? skill.category.includes("Science") ? "bg-accent-scientist" : skill.category.includes("Engineering") ? "bg-accent-engineer" : "bg-accent-analyst"
                        : "bg-border/60"
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Writings */}
      <section className="space-y-8 border-t border-border/45 pt-16">
        <div className="flex justify-between items-end pb-1">
          <div className="space-y-1">
            <h2 className="text-xl font-serif font-bold text-text-primary tracking-tight">Latest Writings</h2>
            <span className="text-[10px] text-text-muted font-mono block">// KNOWLEDGE_SHARING_SOCKET</span>
          </div>
          <Link to="/writing" className="text-xs font-mono text-text-muted hover:text-accent-terracotta flex items-center gap-1 transition-colors">
            VIEW BLOGS <ArrowRight size={12} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-container">
          {blogs.map((blog) => (
            <div
              key={blog.id}
              className="p-6 rounded-2xl border border-border/60 bg-bg-surface flex flex-col justify-between hover:border-border transition-all duration-300 stagger-item shadow-sm"
            >
              <div className="space-y-3">
                <div className="flex justify-between text-[9px] font-mono text-text-muted">
                  <span>{blog.category}</span>
                  <span>{blog.date}</span>
                </div>
                <h3 className="text-md font-bold text-text-primary hover:text-accent-terracotta transition-colors">
                  {blog.title}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed">{blog.excerpt}</p>
              </div>
              <div className="pt-4 mt-4 border-t border-border/20 flex justify-between items-center">
                <span className="text-[10px] font-mono text-text-muted">{blog.readingTime}</span>
                <span className="text-xs text-accent-terracotta flex items-center gap-1 font-mono font-bold cursor-pointer hover:translate-x-0.5 transition-transform">
                  READ ARTICLE <ArrowUpRight size={12} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
export default Home;
