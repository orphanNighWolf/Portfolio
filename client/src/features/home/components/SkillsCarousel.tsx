import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { getSkillIcon, getCategoryTheme } from "@/lib/skillIcons";

interface Skill {
  _id: string;
  name: string;
  category: string;
  level: number;
}

interface SkillsCarouselProps {
  skills: Skill[];
}

export default function SkillsCarousel({ skills }: SkillsCarouselProps) {
  if (!skills || !skills.length) return null;

  return (
    <section className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-end border-b border-border pb-4">
        <div className="space-y-1">
          <h2 className="text-h3 font-bold text-text-primary tracking-tight">Featured Capabilities</h2>
          <span className="text-label text-text-muted font-mono block">// CORE_COMPETENCY_INDEX</span>
        </div>
        <Link to="/skills" className="text-label text-text-muted hover:text-accent-ai flex items-center gap-1.5 transition-colors duration-150">
          EXPAND INDEX <ArrowRight size={12} />
        </Link>
      </div>
      
      {/* Plain, low-interactivity static grid list in place of the animated carousel */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 py-4 justify-items-center">
        {skills.map((skill) => {
          const theme = getCategoryTheme(skill.category);
          return (
            <div
              key={skill._id}
              className="flex flex-col items-center justify-center p-4 bg-bg-surface border border-border rounded-xl w-20 h-20 transition-colors duration-150 hover:border-accent-ai"
              style={{ color: theme.accent }}
            >
              <div className="scale-[1.1]">
                {getSkillIcon(skill.name, skill.category)}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
