import { createFileRoute } from '@tanstack/react-router'
import { Terminal, Cpu, Database, ShieldCheck, Wrench, ExternalLink, Code2, BarChart2, GitBranch } from 'lucide-react'
import SectionGuard from '../components/SectionGuard'

export const Route = createFileRoute('/tools')({
  component: ToolsPage,
  head: () => ({
    meta: [
      { title: "Tools & Utilities | Aniket Saini" },
      { name: "description", content: "Developer tools, analytics utilities, and technical frameworks engineered by Aniket Saini." },
      { property: "og:title", content: "Tools & Utilities | Aniket Saini" },
      { property: "og:description", content: "Developer tools, analytics utilities, and technical frameworks engineered by Aniket Saini." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" }
    ]
  })
})

function ToolsPage() {
  const toolsList = [
    {
      id: "tool-1",
      name: "ImpactTrace — AST Dependency Analyzer",
      category: "Software Engineering",
      icon: <GitBranch size={20} className="text-accent-terracotta" />,
      description: "Node.js & TypeScript static analysis library that parses project ASTs to generate visual module dependency graphs and calculate change impact scope.",
      tags: ["TypeScript", "AST Parsing", "Graph Visualization", "Node.js"],
      status: "Production Ready",
      link: "https://github.com/orphanNighWolf"
    },
    {
      id: "tool-2",
      name: "Commodities Backtesting Framework",
      category: "Data Science & ML",
      icon: <BarChart2 size={20} className="text-accent-scientist" />,
      description: "Python-based quantitative backtesting engine for historical time-series market data, calculating Sharpe ratios, max drawdown, and strategy risk profiles.",
      tags: ["Python", "Pandas", "Time-Series", "Machine Learning"],
      status: "Active Development",
      link: "https://github.com/orphanNighWolf"
    },
    {
      id: "tool-3",
      name: "SlowAPI & HttpOnly Auth Guard",
      category: "Security & Backend",
      icon: <ShieldCheck size={20} className="text-accent-engineer" />,
      description: "FastAPI middleware utility enforcing 5-attempt/min rate limits per IP and 15-minute account lockouts with anti-enumeration response masking.",
      tags: ["FastAPI", "SlowAPI", "JWT", "Argon2", "HttpOnly"],
      status: "Production Ready",
      link: "https://github.com/orphanNighWolf"
    },
    {
      id: "tool-4",
      name: "SAP DAX Operational Pipeline",
      category: "Analytics & BI",
      icon: <Cpu size={20} className="text-accent-analyst" />,
      description: "Power BI DAX & Power Query transformation pipeline built to automate data cleaning and daily performance reporting for enterprise SAP datasets.",
      tags: ["Power BI", "DAX", "Power Query", "Excel Automation"],
      status: "Deployed",
      link: "https://github.com/orphanNighWolf"
    }
  ];

  return (
    <SectionGuard section="tools">
      <div className="max-w-4xl mx-auto space-y-12 py-4 page-transition">
        {/* Header */}
        <section className="space-y-4">
          <div className="space-y-1 border-b border-border/40 pb-4">
            <h1 className="text-3xl font-serif font-bold tracking-tight text-text-primary flex items-center gap-3">
              <Wrench className="text-accent-terracotta" size={28} /> Tools & Utilities
            </h1>
            <span className="text-xs font-mono text-text-muted block uppercase tracking-wider">// SYSTEM_UTILITIES_&_TECHNICAL_FRAMEWORKS</span>
          </div>

          <p className="text-sm text-text-secondary leading-relaxed max-w-2xl">
            A collection of developer libraries, data analytics pipelines, AST parsers, and security utilities built and maintained for high-performance applications.
          </p>
        </section>

        {/* Tools Showcase Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-container">
          {toolsList.map((tool) => (
            <div
              key={tool.id}
              className="p-6 rounded-2xl border border-border bg-bg-surface flex flex-col justify-between hover:border-text-primary/10 transition-all duration-300 shadow-[0_4px_20px_rgba(23,23,23,0.01)] stagger-item"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="p-2.5 rounded-xl bg-bg-elevated border border-border">
                    {tool.icon}
                  </div>
                  <span className="text-[9px] font-mono font-bold tracking-wider px-2.5 py-0.5 rounded border border-border/60 uppercase bg-bg-elevated text-text-muted">
                    {tool.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-accent-terracotta uppercase tracking-wider block">{tool.category}</span>
                  <h2 className="text-md font-serif font-bold text-text-primary">{tool.name}</h2>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed">
                  {tool.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-border/40 space-y-4">
                <div className="flex flex-wrap gap-1.5">
                  {tool.tags.map((tag) => (
                    <span key={tag} className="text-[9px] font-mono text-text-muted bg-bg-elevated px-2 py-0.5 rounded border border-border/40">
                      #{tag.toLowerCase()}
                    </span>
                  ))}
                </div>

                {tool.link && (
                  <a
                    href={tool.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-text-secondary hover:text-accent-terracotta transition-colors"
                  >
                    <Code2 size={13} /> View Source Code <ExternalLink size={11} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </section>
      </div>
    </SectionGuard>
  );
}

export default ToolsPage;
