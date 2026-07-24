import { createFileRoute } from '@tanstack/react-router'
import { portfolioData } from '../lib/portfolio-data'


export const Route = createFileRoute('/skills')({ component: SkillsPage })

function SkillsPage() {
  const { skills } = portfolioData;

  const categories = [
    {
      id: "Languages",
      title: "Core Languages",
      description: "Foundational programming dialects used for scripting and queries.",
      accentClass: "text-accent-terracotta border-accent-terracotta/20 bg-accent-terracotta/5",
      bulletClass: "bg-accent-terracotta",
    },
    {
      id: "Data Engineering",
      title: "Data Engineering",
      description: "ELT pipeline configuration, data warehousing, and stream processing.",
      accentClass: "text-accent-engineer border-accent-engineer/20 bg-accent-engineer/5",
      bulletClass: "bg-accent-engineer",
    },
    {
      id: "Analytics & BI",
      title: "Analytics & Business Intelligence",
      description: "Aggregating insights and compiling dashboard presentations.",
      accentClass: "text-accent-analyst border-accent-analyst/20 bg-accent-analyst/5",
      bulletClass: "bg-accent-analyst",
    },
    {
      id: "Data Science & ML",
      title: "Data Science & Machine Learning",
      description: "Training neural networks, modeling, and deep learning architectures.",
      accentClass: "text-accent-scientist border-accent-scientist/20 bg-accent-scientist/5",
      bulletClass: "bg-accent-scientist",
    }
  ];

  return (
    <div className="space-y-12 page-transition">
      {/* Header */}
      <section className="space-y-4">
        <div className="space-y-1 border-b border-border/40 pb-4">
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">Skills & Competencies</h1>
          <span className="text-xs font-mono text-text-muted block">// CORE_CAPABILITY_INDEX</span>
        </div>
        <p className="text-text-secondary text-sm max-w-2xl leading-relaxed">
          Index of systems and languages utilized in developing high-throughput analytical platforms.
        </p>
      </section>

      {/* Grid of categories */}
      <div className="space-y-10">
        {categories.map((cat) => {
          const categorySkills = skills.filter(s => s.category === cat.id);

          return (
            <div key={cat.id} className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 border-b border-border/40 pb-2">
                <h2 className="text-md font-bold text-text-primary">{cat.title}</h2>
                <span className="text-[10px] font-mono text-text-muted">{cat.description}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {categorySkills.map((skill) => (
                  <div
                    key={skill.name}
                    className="p-5 rounded-2xl border border-border/60 bg-bg-surface flex flex-col justify-between hover:shadow-sm transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-text-primary">{skill.name}</span>
                      <span className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-full border ${cat.accentClass}`}>
                        level {skill.level}/5
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 mt-4">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-1.5 w-full rounded-full ${
                            i < skill.level 
                              ? cat.bulletClass 
                              : "bg-border/60"
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
