import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Search, Code2, Server, Database, GitBranch, Brain, Wrench, Compass } from "lucide-react";
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

import {
  siReact,
  siVuedotjs,
  siAngular,
  siNodedotjs,
  siExpress,
  siMongodb,
  siPostgresql,
  siMysql,
  siRedis,
  siPython,
  siGo,
  siTypescript,
  siJavascript,
  siDocker,
  siKubernetes,
  siGooglecloud,
  siGit,
  siGithub,
  siFigma,
  siGraphql,
  siHtml5,
  siCss,
  siSass,
  siTailwindcss,
  siNextdotjs,
  siNestjs,
  siRust,
  siLinux
} from "simple-icons";

const SIMPLE_ICONS_MAP: Record<string, any> = {
  react: siReact,
  reactjs: siReact,
  vue: siVuedotjs,
  vuejs: siVuedotjs,
  angular: siAngular,
  node: siNodedotjs,
  nodejs: siNodedotjs,
  express: siExpress,
  expressjs: siExpress,
  mongodb: siMongodb,
  mongo: siMongodb,
  postgresql: siPostgresql,
  postgres: siPostgresql,
  mysql: siMysql,
  redis: siRedis,
  python: siPython,
  go: siGo,
  golang: siGo,
  typescript: siTypescript,
  ts: siTypescript,
  javascript: siJavascript,
  js: siJavascript,
  docker: siDocker,
  kubernetes: siKubernetes,
  k8s: siKubernetes,
  gcp: siGooglecloud,
  googlecloud: siGooglecloud,
  git: siGit,
  github: siGithub,
  figma: siFigma,
  graphql: siGraphql,
  html: siHtml5,
  html5: siHtml5,
  css: siCss,
  css3: siCss,
  sass: siSass,
  tailwindcss: siTailwindcss,
  tailwind: siTailwindcss,
  nextjs: siNextdotjs,
  nextdotjs: siNextdotjs,
  nestjs: siNestjs,
  rust: siRust,
  linux: siLinux,
};

const getSkillIcon = (name: string, category: string) => {
  const n = name.toLowerCase().replace(/[^a-z0-9]/g, "");
  const matchedIcon = SIMPLE_ICONS_MAP[n] || Object.keys(SIMPLE_ICONS_MAP).find(k => n.includes(k) || k.includes(n)) ? SIMPLE_ICONS_MAP[n] || SIMPLE_ICONS_MAP[Object.keys(SIMPLE_ICONS_MAP).find(k => n.includes(k) || k.includes(n))!] : null;

  if (matchedIcon) {
    return (
      <svg 
        role="img" 
        viewBox="0 0 24 24" 
        className="w-5 h-5 fill-current shrink-0"
      >
        <title>{matchedIcon.title}</title>
        <path d={matchedIcon.path} />
      </svg>
    );
  }

  // Fallback to lucide-react icons
  const normName = name.toLowerCase();
  const normCat = category.toLowerCase();

  if (normName.includes("react") || normName.includes("vue") || normName.includes("html") || normName.includes("css") || normName.includes("frontend") || normCat.includes("frontend") || normName.includes("ui") || normName.includes("design")) {
    return <Code2 className="shrink-0" size={18} />;
  }
  if (normName.includes("node") || normName.includes("express") || normName.includes("backend") || normName.includes("python") || normName.includes("go") || normName.includes("rust") || normCat.includes("backend")) {
    return <Server className="shrink-0" size={18} />;
  }
  if (normName.includes("mongo") || normName.includes("sql") || normName.includes("database") || normName.includes("redis") || normName.includes("postgres") || normCat.includes("database")) {
    return <Database className="shrink-0" size={18} />;
  }
  if (normName.includes("docker") || normName.includes("kube") || normName.includes("aws") || normName.includes("cloud") || normName.includes("devops") || normCat.includes("devops") || normCat.includes("cloud")) {
    return <GitBranch className="shrink-0" size={18} />;
  }
  if (normName.includes("ai") || normName.includes("ml") || normName.includes("pytorch") || normName.includes("tensorflow") || normCat.includes("ai") || normName.includes("neural") || normName.includes("intelligence")) {
    return <Brain className="shrink-0" size={18} />;
  }
  if (normName.includes("git") || normName.includes("tool") || normCat.includes("tools")) {
    return <Wrench className="shrink-0" size={18} />;
  }
  return <Compass className="shrink-0" size={18} />;
};

const getCategoryTheme = (category: string) => {
  const cat = category.toLowerCase();
  if (
    cat.includes("database") ||
    cat.includes("backend") ||
    cat.includes("cloud") ||
    cat.includes("programming") ||
    cat.includes("ai")
  ) {
    return {
      accent: "var(--accent-ai)",
      text: "text-accent-ai",
      shadowGlow: "rgba(91, 140, 255, 0.12)",
    };
  } else if (cat.includes("frontend") || cat.includes("tools")) {
    return {
      accent: "var(--accent-analytics)",
      text: "text-accent-analytics",
      shadowGlow: "rgba(0, 229, 255, 0.12)",
    };
  } else if (cat.includes("finance")) {
    return {
      accent: "var(--accent-finance)",
      text: "text-accent-finance",
      shadowGlow: "rgba(229, 169, 60, 0.12)",
    };
  }
  return {
    accent: "var(--accent-ai)",
    text: "text-accent-ai",
    shadowGlow: "rgba(91, 140, 255, 0.12)",
  };
};

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
