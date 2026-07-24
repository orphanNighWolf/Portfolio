import { createFileRoute } from '@tanstack/react-router'
import { portfolioData } from '../lib/portfolio-data'
import { Calendar, Clock, ArrowRight } from 'lucide-react'

export const Route = createFileRoute('/blogs')({ component: BlogsPage })

function BlogsPage() {
  const { blogs } = portfolioData;

  return (
    <div className="space-y-12 page-transition">
      {/* Header */}
      <section className="space-y-4">
        <div className="space-y-1 border-b border-border/40 pb-4">
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">Analytical Notes & Writings</h1>
          <span className="text-xs font-mono text-text-muted block">// ACCESSING_KNOWLEDGE_STREAM</span>
        </div>
        <p className="text-text-secondary text-sm max-w-2xl leading-relaxed">
          Deep-dives into data pipeline debugging, ML architecture experiments, and custom analytics integrations.
        </p>
      </section>

      {/* Blogs list */}
      <div className="space-y-6">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="p-6 rounded-2xl border border-border/60 bg-bg-surface flex flex-col justify-between hover:border-border transition-all duration-300 stagger-item"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] font-mono text-text-muted">
                <span className="px-2 py-0.5 rounded border border-border bg-bg-elevated/40">
                  {blog.category}
                </span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1"><Calendar size={11} /> {blog.date}</span>
                  <span className="flex items-center gap-1"><Clock size={11} /> {blog.readingTime}</span>
                </div>
              </div>
              
              <h2 className="text-xl font-bold text-text-primary hover:text-accent-engineer transition-colors cursor-pointer">
                {blog.title}
              </h2>
              <p className="text-xs text-text-secondary leading-relaxed max-w-3xl">
                {blog.excerpt}
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-border/20 flex justify-between items-center">
              <div className="text-xs text-text-muted">
                Author: Aniket Saini
              </div>
              <button className="text-xs text-accent-engineer flex items-center gap-1 font-mono font-bold cursor-pointer hover:translate-x-0.5 transition-transform bg-transparent border-none">
                READ ARTICLE <ArrowRight size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
