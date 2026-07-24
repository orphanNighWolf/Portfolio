import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Search } from "lucide-react";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";

interface Skill {
  _id: string;
  name: string;
  category: string;
  level: number;
  yearsExperience: number;
  icon?: string;
  description?: string;
  featured?: boolean;
}

import { getSkillIcon, getCategoryTheme } from "@/lib/skillIcons";

function GlassSkillTile({ skill }: { skill: Skill }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  const [transition, setTransition] = useState("none");
  const [hovered, setHovered] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const isTouchDevice = () => {
    return typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isReducedMotion || isTouchDevice()) return;
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const maxRotate = 6;
    const rotateX = -((y - centerY) / centerY) * maxRotate;
    const rotateY = ((x - centerX) / centerX) * maxRotate;

    const scale = 1.03;

    setTransition("transform 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94)");
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`);
  };

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    if (isReducedMotion || isTouchDevice()) return;

    setTransition("transform 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275)");
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)");
  };

  const theme = getCategoryTheme(skill.category);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isReducedMotion ? "none" : (isTouchDevice() && hovered ? "scale3d(1.02, 1.02, 1.02)" : hovered ? `${transform} translateY(-2px)` : transform),
        transition: isReducedMotion ? "none" : (isTouchDevice() ? "transform 0.2s ease" : transition),
        borderColor: hovered ? theme.accent : "rgba(255, 255, 255, 0.08)",
        boxShadow: hovered 
          ? `0 12px 36px rgba(0, 0, 0, 0.4), 0 0 20px ${theme.shadowGlow}` 
          : "0 8px 30px rgba(0, 0, 0, 0.2)",
      }}
      className="relative bg-bg-surface/50 backdrop-blur-[14px] border flex flex-col justify-between overflow-hidden group select-none transition-all duration-[200ms] text-text-primary h-[140px] w-full rounded-[20px] p-5"
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.01] via-transparent to-white/[0.03] pointer-events-none" />

      {/* Top Details */}
      <div className="w-full flex justify-between items-center mb-2 pointer-events-none">
        <span className="text-[9px] font-mono font-bold tracking-wider text-text-muted uppercase">
          {skill.category}
        </span>
        <span className="bg-bg-elevated text-[9px] font-mono text-text-primary font-semibold border border-border/20 rounded-full h-5 min-w-[38px] flex items-center justify-center px-1.5">
          {skill.level}%
        </span>
      </div>

      {/* Center Icon */}
      <div className="flex-grow flex items-center justify-center">
        <div 
          className="w-16 h-16 flex items-center justify-center rounded-2xl bg-bg-elevated shadow-sm border border-border/10 transition-transform duration-300"
          style={{ color: theme.accent }}
        >
          <div className="scale-[1.3]">
            {getSkillIcon(skill.name, skill.category)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SkillsPage() {
  const [search, setSearch] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);

  const { data, isLoading, error } = useQuery<Skill[]>({
    queryKey: ["skills", search],
    queryFn: async () => {
      const params: any = {};
      if (search.trim()) {
        params.search = search;
      }
      const response = await api.get("/skills", { params });
      return response.data.data;
    },
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsSearchActive(false);
      e.currentTarget.blur();
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 page-transition font-mono text-sm">
      {/* Filter and Search Bar Container */}
      <div className="w-full flex flex-col items-stretch gap-2.5">
        {/* Search Input - Full Width */}
        <div className="relative w-full flex items-center">
          <Search size={13} className="absolute left-3.5 text-text-secondary" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setIsSearchActive(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search capabilities..."
            className="w-full h-9 bg-bg-surface border border-border/20 rounded-xl pl-9 pr-14 text-xs text-text-primary focus:border-accent-ai focus:outline-none transition-colors"
          />
          {isSearchActive && (
            <button
              onClick={() => setIsSearchActive(false)}
              className="absolute right-3.5 text-[8px] text-text-muted hover:text-text-primary uppercase tracking-widest font-bold cursor-pointer transition-colors"
            >
              Close
            </button>
          )}
        </div>

        {/* Real-time Autocomplete Suggestions */}
        {search.trim() && data && data.length > 0 && (
          <div className="flex flex-wrap gap-1.5 items-center mt-0.5">
            <span className="text-[7px] uppercase tracking-widest text-text-muted mr-1 font-bold">// Quick Fill:</span>
            {data.slice(0, 4).map((skill) => (
              <button
                key={skill._id}
                onClick={() => {
                  setSearch(skill.name);
                  setIsSearchActive(false);
                }}
                className="h-6 flex items-center justify-center px-2.5 rounded-md text-[8px] uppercase tracking-wider cursor-pointer border border-border/20 bg-bg-surface/30 text-text-primary hover:border-accent-ai/50 transition-all"
              >
                {skill.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Skills Grid Bento Panel */}
      {isLoading ? (
        <LoadingState message="COMPILE_SYSTEMS_INVENTORY..." />
      ) : error ? (
        <ErrorState title="Telemetry Error" message="Failed to load skills inventory system metrics." />
      ) : !data || data.length === 0 ? (
        <EmptyState title="No Capabilities Located" message="No matching capabilities were resolved inside system listings." />
      ) : (
        <div className="bg-bg-surface/10 p-8 md:p-12 rounded-[32px] border border-border/20 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-container">
            {data.map((skill) => (
              <div key={skill._id} className="stagger-item">
                <GlassSkillTile skill={skill} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
