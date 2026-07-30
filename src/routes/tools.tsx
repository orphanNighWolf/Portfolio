import { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { Terminal, Cpu, ShieldCheck, Wrench, ExternalLink, Code2, BarChart2, GitBranch, Sparkles, Filter, Download, CheckCircle2, Play, RefreshCw } from 'lucide-react'
import SectionGuard from '../components/SectionGuard'
import { JobMatchingPipeline } from '../lib/job-matching/pipeline'
import { ScoredJobListing } from '../lib/job-matching/types'

export const Route = createFileRoute('/tools')({
  component: ToolsPage,
  head: () => ({
    meta: [
      { title: "Tools & Automation | Aniket Saini" },
      { name: "description", content: "Developer tools, job-matching automation, and technical frameworks engineered by Aniket Saini." },
      { property: "og:title", content: "Tools & Automation | Aniket Saini" },
      { property: "og:description", content: "Developer tools, job-matching automation, and technical frameworks engineered by Aniket Saini." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" }
    ]
  })
})

function ToolsPage() {
  const [jobs, setJobs] = useState<ScoredJobListing[]>([])
  const [loading, setLoading] = useState(false)
  const [activeSourceFilter, setActiveSourceFilter] = useState<string>('all')
  const [activeTab, setActiveTab] = useState<'cards' | 'json'>('cards')

  const runJobPipeline = async () => {
    setLoading(true)
    try {
      const pipeline = new JobMatchingPipeline()
      const results = await pipeline.executePipeline()
      setJobs(results)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    runJobPipeline()
  }, [])

  const filteredJobs = activeSourceFilter === 'all' 
    ? jobs 
    : jobs.filter(j => j.source === activeSourceFilter)

  const downloadCsv = () => {
    const csvContent = JobMatchingPipeline.exportToCsv(jobs)
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `job_matches_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const staticToolsList = [
    {
      id: "tool-1",
      name: "ImpactTrace — AST Dependency Analyzer",
      category: "Software Engineering",
      icon: <GitBranch size={20} className="text-accent-terracotta" />,
      description: "Node.js & TypeScript static analysis library that parses project ASTs to generate visual module dependency graphs and calculate change impact scope.",
      tags: ["TypeScript", "AST Parsing", "Graph Visualization", "Node.js"],
      status: "Production Ready"
    },
    {
      id: "tool-3",
      name: "SlowAPI & HttpOnly Auth Guard",
      category: "Security & Backend",
      icon: <ShieldCheck size={20} className="text-accent-engineer" />,
      description: "FastAPI middleware utility enforcing 5-attempt/min rate limits per IP and 15-minute account lockouts with anti-enumeration response masking.",
      tags: ["FastAPI", "SlowAPI", "JWT", "Argon2", "HttpOnly"],
      status: "Production Ready"
    },
    {
      id: "tool-4",
      name: "SAP DAX Operational Pipeline",
      category: "Analytics & BI",
      icon: <Cpu size={20} className="text-accent-analyst" />,
      description: "Power BI DAX & Power Query transformation pipeline built to automate data cleaning and daily performance reporting for enterprise SAP datasets.",
      tags: ["Power BI", "DAX", "Power Query", "Excel Automation"],
      status: "Deployed"
    }
  ];

  return (
    <SectionGuard section="tools">
      <div className="max-w-4xl mx-auto space-y-16 py-4 page-transition">
        {/* Header */}
        <section className="space-y-4">
          <div className="space-y-1 border-b border-border/40 pb-4">
            <h1 className="text-3xl font-serif font-bold tracking-tight text-text-primary flex items-center gap-3">
              <Wrench className="text-accent-terracotta" size={28} /> Tools & Automation Hub
            </h1>
            <span className="text-xs font-mono text-text-muted block uppercase tracking-wider">// LIVE_DEMO_PROJECTS_&_AUTOMATION_PIPELINES</span>
          </div>

          <p className="text-sm text-text-secondary leading-relaxed max-w-2xl">
            A suite of custom tools, API pipelines, AST visualizers, and zero-browser-automation job aggregators engineered for high efficiency.
          </p>
        </section>

        {/* FEATURED LIVE DEMO: Job-Matching Automation Tool */}
        <section className="p-6 sm:p-8 rounded-3xl border border-accent-terracotta/30 bg-bg-surface space-y-6 shadow-[0_8px_30px_rgba(23,23,23,0.02)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 text-[9px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border border-accent-terracotta/30 text-accent-terracotta bg-accent-terracotta/5">
                <Sparkles size={12} /> LIVE DEMO TOOL
              </span>
              <h2 className="text-xl font-serif font-bold text-text-primary">Job-Matching Automation Pipeline</h2>
              <p className="text-xs text-text-muted font-mono">// GMAIL_API_DIGEST_PARSER_&_MULTI_SOURCE_DEDUPLICATOR</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={runJobPipeline}
                disabled={loading}
                className="px-3.5 py-2 rounded-xl bg-accent-terracotta text-white text-xs font-mono uppercase tracking-wider hover:opacity-90 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? <RefreshCw size={13} className="animate-spin" /> : <Play size={13} />}
                {loading ? "EXECUTING..." : "RUN PIPELINE"}
              </button>
              <button
                onClick={downloadCsv}
                disabled={jobs.length === 0}
                className="p-2 rounded-xl border border-border bg-bg-elevated hover:bg-black/5 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                title="Export CSV"
              >
                <Download size={15} />
              </button>
            </div>
          </div>

          <p className="text-xs text-text-secondary leading-relaxed">
            Extracts job digests directly from Gmail (via OAuth2 Gmail API for LinkedIn Job Alerts) and merges them with direct Indeed, ZipRecruiter, and Dice API feeds without browser automation or ToS violations. Applies fuzzy deduplication and scores matches against standard candidate skills profiles.
          </p>

          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-bg-elevated/50 p-3 rounded-2xl border border-border/60">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider mr-2 flex items-center gap-1">
                <Filter size={11} /> Source:
              </span>
              {[
                { id: 'all', label: 'All Feeds' },
                { id: 'linkedin_email', label: 'Gmail (LinkedIn Digest)' },
                { id: 'indeed_api', label: 'Indeed API' },
                { id: 'ziprecruiter_api', label: 'ZipRecruiter API' },
                { id: 'dice_api', label: 'Dice API' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setActiveSourceFilter(f.id)}
                  className={`text-[9px] font-mono px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    activeSourceFilter === f.id
                      ? "bg-accent-terracotta border-accent-terracotta text-white font-bold"
                      : "border-border/60 bg-bg-surface text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 bg-bg-surface border border-border/60 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('cards')}
                className={`text-[9px] font-mono px-2 py-0.5 rounded-lg cursor-pointer ${activeTab === 'cards' ? 'bg-black/10 font-bold text-text-primary' : 'text-text-muted'}`}
              >
                Card View
              </button>
              <button
                onClick={() => setActiveTab('json')}
                className={`text-[9px] font-mono px-2 py-0.5 rounded-lg cursor-pointer ${activeTab === 'json' ? 'bg-black/10 font-bold text-text-primary' : 'text-text-muted'}`}
              >
                JSON Stream
              </button>
            </div>
          </div>

          {/* Render Output */}
          {activeTab === 'cards' ? (
            <div className="space-y-3 stagger-container">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="p-4 rounded-2xl border border-border/80 bg-bg-surface flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-text-primary/20 transition-all stagger-item"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-text-primary">{job.title}</span>
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-accent-terracotta/10 text-accent-terracotta border border-accent-terracotta/20">
                        {job.matchScore}% MATCH
                      </span>
                      <span className="text-[8px] font-mono text-text-muted uppercase px-1.5 py-0.5 bg-bg-elevated rounded border border-border/40">
                        {job.source}
                      </span>
                    </div>

                    <div className="text-xs text-text-secondary font-medium flex items-center gap-2">
                      <span>{job.company}</span>
                      <span className="text-text-muted">•</span>
                      <span>{job.location}</span>
                    </div>

                    {job.snippet && (
                      <p className="text-[11px] text-text-muted leading-relaxed font-mono">
                        "{job.snippet}"
                      </p>
                    )}

                    <div className="flex flex-wrap gap-1 pt-1">
                      {job.matchedSkills.map(s => (
                        <span key={s} className="text-[8px] font-mono text-accent-engineer bg-accent-engineer/5 px-1.5 py-0.5 rounded border border-accent-engineer/15 flex items-center gap-1">
                          <CheckCircle2 size={9} /> {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <a
                    href={job.applyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="shrink-0 px-3.5 py-1.5 rounded-xl border border-border bg-bg-elevated hover:bg-accent-terracotta hover:text-white text-text-secondary text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-1"
                  >
                    Apply <ExternalLink size={11} />
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-black/95 text-emerald-400 p-4 rounded-2xl font-mono text-[10px] overflow-x-auto max-h-80 border border-border/80">
              <pre>{JSON.stringify(filteredJobs, null, 2)}</pre>
            </div>
          )}
        </section>

        {/* Static Utilities Gallery */}
        <section className="space-y-6">
          <div className="space-y-1 border-b border-border/40 pb-2">
            <h2 className="text-xl font-serif font-bold text-text-primary tracking-tight">Additional Developer Utilities</h2>
            <span className="text-xs font-mono text-text-muted block uppercase tracking-wider">// OTHER_ENGINEERED_SYSTEMS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-container">
            {staticToolsList.map((tool) => (
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
                    <h3 className="text-md font-serif font-bold text-text-primary">{tool.name}</h3>
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

                  <a
                    href="https://github.com/orphanNighWolf"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-mono text-text-secondary hover:text-accent-terracotta transition-colors"
                  >
                    <Code2 size={13} /> View Source Code <ExternalLink size={11} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </SectionGuard>
  )
}

export default ToolsPage
