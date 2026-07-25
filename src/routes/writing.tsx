import { createFileRoute } from '@tanstack/react-router'
import { portfolioData } from '../lib/portfolio-data'
import { Calendar, Clock, ArrowUpRight } from 'lucide-react'

import SectionGuard from '../components/SectionGuard'

export const Route = createFileRoute('/writing')({
  component: WritingPage,
  head: () => ({
    meta: [
      { title: "Writing | Aniket Saini" },
      { name: "description", content: "Analysis notes and articles on data engineering pipelines, ML experiments, and database architectures." },
      { property: "og:title", content: "Writing | Aniket Saini" },
      { property: "og:description", content: "Analysis notes and articles on data engineering pipelines, ML experiments, and database architectures." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" }
    ]
  })
})

function WritingPage() {
  const { blogs } = portfolioData;

  return (
    <SectionGuard section="blogs">
      <div className="max-w-2xl mx-auto space-y-12 page-transition">
      {/* Header */}
      <section className="space-y-4">
        <div className="space-y-1 border-b border-border/40 pb-4">
          <h1 className="text-3xl font-serif font-bold tracking-tight text-text-primary">Writing</h1>
          <span className="text-xs font-mono text-text-muted block uppercase tracking-wider">// ACCESSING_KNOWLEDGE_STREAM</span>
        </div>
        <p className="text-text-secondary text-sm leading-relaxed">
          Technical deep-dives and logs documenting custom analytical setups, pipelines, and research findings.
        </p>
      </section>

      {/* Vertical list of analysis notes - no cards, just clean list items with dividers */}
      <div className="divide-y divide-border/60 stagger-container">
        {blogs.map((blog) => (
          <article 
            key={blog.id} 
            className="py-8 first:pt-0 last:pb-0 space-y-3.5 hover:opacity-[0.98] transition-opacity stagger-item"
          >
            <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-text-muted uppercase tracking-wider">
              <span className="text-accent-terracotta font-semibold">// {blog.category}</span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span className="flex items-center gap-1"><Calendar size={11} /> {blog.date}</span>
              <span className="w-1 h-1 rounded-full bg-border" />
              <span className="flex items-center gap-1"><Clock size={11} /> {blog.readingTime}</span>
            </div>

            <h2 className="text-xl font-serif font-bold text-text-primary hover:text-accent-terracotta transition-colors cursor-pointer leading-snug">
              {blog.title}
            </h2>

            {/* Dek (Description excerpt) */}
            <p className="text-xs text-text-secondary leading-relaxed max-w-xl">
              {blog.excerpt}
            </p>

            <div className="pt-2">
              <button className="text-[10px] text-accent-terracotta flex items-center gap-1 font-mono font-bold cursor-pointer hover:translate-x-0.5 transition-transform bg-transparent border-none">
                READ NOTES <ArrowUpRight size={12} />
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  </SectionGuard>
  );
}
export default WritingPage;
