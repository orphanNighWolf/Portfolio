import { useState, useEffect, useRef } from "react";
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

function FloatingIconCarousel({ skills }: SkillsCarouselProps) {
  const [offset, setOffset] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationId: number;
    const speed = 0.005; // speed of transition

    const update = () => {
      if (!isHovered) {
        setOffset((prev) => (prev + speed) % skills.length);
      }
      animationId = requestAnimationFrame(update);
    };

    animationId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationId);
  }, [skills.length, isHovered]);

  if (!skills.length) return null;

  // Duplicate elements to ensure a dense list for infinite rotation loop
  const carouselSkills = skills.length < 8 ? [...skills, ...skills, ...skills] : skills;

  return (
    <div 
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full h-36 flex items-center justify-center overflow-hidden select-none cursor-pointer"
      style={{
        maskImage: "linear-gradient(to right, transparent, white 20%, white 80%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, white 20%, white 80%, transparent)"
      }}
    >
      <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
        {carouselSkills.map((skill, index) => {
          // Calculate relative position of this item
          let relPos = index - offset;
          
          // Wrap around to keep within -carouselSkills.length/2 to carouselSkills.length/2
          const half = carouselSkills.length / 2;
          if (relPos < -half) relPos += carouselSkills.length;
          if (relPos > half) relPos -= carouselSkills.length;

          // We only render items within a certain range to optimize performance
          if (Math.abs(relPos) > 3.5) return null;

          // Proximity to center (0 means exact center, 1 means far away)
          const absPos = Math.abs(relPos);
          const proximity = Math.max(0, 1 - absPos / 3.0); // 1 at center, 0 at edges

          // Math for scale, opacity, Z-index, and rotation
          const scale = 0.9 + 0.7 * Math.pow(proximity, 2); // scales from 0.9 up to 1.6
          const opacity = 0.2 + 0.8 * proximity; // opacity from 0.2 to 1.0
          const zIndex = Math.round(proximity * 100);
          
          // Horizontal translate in pixels
          const translateX = relPos * 130; // spacing between icons
          
          // Get theme for glow color
          const theme = getCategoryTheme(skill.category);
          
          return (
            <div
              key={`${skill._id}-${index}`}
              className="absolute transition-all duration-[50ms] ease-out flex flex-col items-center justify-center"
              style={{
                transform: `translateX(${translateX}px) scale(${scale})`,
                opacity: opacity,
                zIndex: zIndex,
              }}
            >
              {/* Icon Container */}
              <div 
                className={`w-16 h-16 flex items-center justify-center rounded-2xl bg-white shadow-none transition-all duration-300 ${
                  proximity > 0.75 
                    ? "border-2 border-accent-ai" 
                    : "border border-border"
                }`}
                style={{ 
                  color: theme.accent,
                }}
              >
                <div className="scale-[1.3] transition-transform duration-300">
                  {getSkillIcon(skill.name, skill.category)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function SkillsCarousel({ skills }: SkillsCarouselProps) {
  return (
    <section className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-end border-b border-border pb-4">
        <div className="space-y-1">
          <h2 className="text-h3 font-bold text-text-primary tracking-tight">Featured Capabilities</h2>
          <span className="text-label text-text-muted font-mono block">// COMILING_CORE_COMPETENCY_INDEX</span>
        </div>
        <Link to="/skills" className="text-label text-text-muted hover:text-accent-ai flex items-center gap-1.5 transition-colors">
          EXPAND INDEX <ArrowRight size={12} />
        </Link>
      </div>
      
      <div className="w-full py-4">
        <FloatingIconCarousel skills={skills} />
      </div>
    </section>
  );
}
