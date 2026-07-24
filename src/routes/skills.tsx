import { createFileRoute } from '@tanstack/react-router'
import { portfolioData } from '../lib/portfolio-data'

export const Route = createFileRoute('/skills')({
  component: SkillsPage,
  head: () => ({
    meta: [
      { title: "Skills | Aniket Saini" },
      { name: "description", content: "Technical skills inventory: Analytics, Engineering, Machine Learning Science, and Tooling." },
      { property: "og:title", content: "Skills | Aniket Saini" },
      { property: "og:description", content: "Technical skills inventory: Analytics, Engineering, Machine Learning Science, and Tooling." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" }
    ]
  })
})

function SkillsPage() {
  const { skills } = portfolioData;

  const categories = [
    {
      id: "Analytics & BI",
      title: "Analytics",
      description: "Aggregating warehouse facts, building executive dashboards, and querying warehouse schemas.",
      accentClass: "text-accent-analyst border-accent-analyst/20 bg-accent-analyst/5",
      bulletClass: "bg-accent-analyst",
    },
    {
      id: "Data Engineering",
      title: "Engineering",
      description: "Designing robust orchestrations, building clean ELT pipelines, and scaling warehouse clusters.",
      accentClass: "text-accent-engineer border-accent-engineer/20 bg-accent-engineer/5",
      bulletClass: "bg-accent-engineer",
    },
    {
      id: "Data Science & ML",
      title: "Science",
      description: "Developing custom neural architectures, training algorithms, and deploying model runs.",
      accentClass: "text-accent-scientist border-accent-scientist/20 bg-accent-scientist/5",
      bulletClass: "bg-accent-scientist",
    },
    {
      id: "Languages",
      title: "Tooling",
      description: "Foundational programming dialects and developer frameworks utilized cross-pipeline.",
      accentClass: "text-accent-terracotta border-accent-terracotta/20 bg-accent-terracotta/5",
      bulletClass: "bg-accent-terracotta",
    }
  ];

  return (
    <div className="space-y-12 page-transition">
      {/* Header */}
      <section className="space-y-4">
        <div className="space-y-1 border-b border-border/40 pb-4">
          <h1 className="text-3xl font-serif font-bold tracking-tight text-text-primary">Skills</h1>
          <span className="text-xs font-mono text-text-muted block uppercase tracking-wider">// CORE_CAPABILITY_INDEX</span>
        </div>
        <p className="text-text-secondary text-sm max-w-2xl leading-relaxed">
          Classified index of platforms, analytical packages, and development tools utilized across the data track.
        </p>
      </section>

      {/* 4 Grouped Capability Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 stagger-container">
        {categories.map((cat) => {
          const categorySkills = skills.filter(s => s.category === cat.id);

          return (
            <div 
              key={cat.id} 
              className="p-6 rounded-3xl border border-border bg-bg-surface flex flex-col justify-between space-y-6 shadow-[0_4px_20px_rgba(23,23,23,0.01)] stagger-item"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-border/40 pb-3">
                  <h2 className="text-lg font-serif font-bold text-text-primary">{cat.title}</h2>
                  <span className="text-[9px] font-mono text-text-muted uppercase tracking-widest">// {cat.id.replace("&", "·").toLowerCase()}</span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">{cat.description}</p>
              </div>

              {/* Skill Items List */}
              <div className="space-y-3.5 pt-2">
                {categorySkills.map((skill) => (
                  <div key={skill.name} className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-text-primary">{skill.name}</span>
                    
                    {/* Subtle proficiency dot meter - no neon bars */}
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full border border-border/80 ${
                            i < skill.level 
                              ? cat.bulletClass 
                              : "bg-bg-elevated/80"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export default SkillsPage;
