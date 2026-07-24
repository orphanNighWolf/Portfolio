import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, MessageSquare, GraduationCap, Code2, Server, Database, GitBranch, Brain, Wrench, Compass } from "lucide-react";
import LoadingState from "@/components/LoadingState";
import EmptyState from "@/components/EmptyState";
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


interface FloatingIconCarouselProps {
  skills: Skill[];
}

function FloatingIconCarousel({ skills }: FloatingIconCarouselProps) {
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
                    ? "border-2 border-[#2563EB]" 
                    : "border border-[#E2E8F0]"
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

interface Skill {
  _id: string;
  name: string;
  category: string;
  level: number;
}

interface HomeData {
  hero: {
    name: string;
    title: string;
    bio: string;
    location: string;
    avatarUrl?: string;
  };
  featuredSkills: Skill[];
  projects: any[];
  latestBlog: any[];
  research: any[];
  githubActivity: any[];
  mentorshipCta: string;
  contactCta: string;
}

export default function HomePage() {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const { data, isLoading, error } = useQuery<HomeData>({
    queryKey: ["home-data"],
    queryFn: async () => {
      const response = await api.get("/home");
      return response.data.data;
    },
  });

  if (isLoading) {
    return <LoadingState message="BOOTING_PLATFORM_DASHBOARD..." />;
  }

  if (error || !data) {
    return (
      <EmptyState 
        title="Initialization Error" 
        message="Failed to retrieve home coordinates. Check system backend connectivity." 
      />
    );
  }



  return (
    <div className="space-y-24 page-transition">
      
      {/* 2-Column Hero Section */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-12">
        
        {/* Left Side Content Block */}
        <div className="lg:col-span-7 space-y-8 text-left">
          
          {/* Status Pill */}
          <div className="inline-flex items-center gap-2 bg-bg-surface border border-border text-accent-ai text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-widest font-mono">
            <Sparkles size={11} className="animate-pulse" /> SYSTEMS OPERATIONAL // PORT_ONLINE
          </div>
          
          {/* Typographic Title Scale */}
          <div className="space-y-4">
            <h1 className="text-h2 md:text-h1 font-bold text-text-primary tracking-tight leading-none">
              Hello, I'm <span className="text-accent-ai">{data.hero.name || "Alex Mercer"}</span>
            </h1>
            
            {/* Structured Identity Line */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs tracking-wider uppercase font-mono border-l-2 border-border pl-4">
              <span className="text-accent-ai font-semibold">AI Engineer</span>
              <span className="text-text-muted">•</span>
              <span className="text-accent-analytics font-medium">Data Analyst</span>
              <span className="text-text-muted">•</span>
              <span className="text-accent-finance font-light">Financial Advisor</span>
            </div>
          </div>

          <p className="text-body text-text-secondary leading-relaxed max-w-xl">
            {data.hero.bio || "Quantitative developer modeling deep learning and full-stack systems."}
          </p>

          {/* Primary/Secondary Button Scale */}
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/about"
              className="bg-[#2563EB] hover:bg-[#1D4ED8] hover:-translate-y-0.5 text-white text-xs font-mono font-medium uppercase tracking-wider px-6 py-3 rounded-lg shadow-none transition-all duration-150 ease-in-out"
            >
              Analyze Profile
            </Link>
            <Link
              to="/contact"
              className="border border-[#E2E8F0] bg-white hover:bg-[#F1F5F9] hover:-translate-y-0.5 text-[#0F172A] text-xs font-mono font-medium uppercase tracking-wider px-6 py-3 rounded-lg shadow-none transition-all duration-150 ease-in-out"
            >
              Request Briefing
            </Link>
          </div>
        </div>

        {/* Right Side Signature Visual Element (AI, Data, Finance overlay) */}
        <div className="lg:col-span-5 relative flex items-center justify-center min-h-[300px] lg:min-h-[400px]">
          <div className="absolute inset-0 bg-[#F1F5F9] border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-none flex items-center justify-center p-6 select-none">
            
            {/* Subtle Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
            
            {/* Overlapping Signature Motif Diagram */}
            <svg viewBox="0 0 400 400" className="w-full h-full max-w-[320px] relative z-10">
              
              {/* Coordinates Grid (Analytics domain) */}
              <g className="text-[#64748B] opacity-30">
                <line x1="40" y1="360" x2="360" y2="360" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="40" y1="40" x2="40" y2="360" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                <text x="350" y="380" className="text-[10px] font-mono fill-current">X_VAL</text>
                <text x="15" y="50" className="text-[10px] font-mono fill-current">Y_VAL</text>
              </g>

              {/* AI Neural Circle Paths */}
              <g className="text-[#2563EB] opacity-60">
                <circle cx="200" cy="200" r="110" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 8" className="animate-spin" style={{ animationDuration: '30s' }} />
                <circle cx="200" cy="200" r="80" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" className="animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
                
                {/* Node Intersections */}
                <circle cx="200" cy="90" r="5" fill="currentColor" />
                <circle cx="200" cy="310" r="5" fill="currentColor" />
                <circle cx="90" cy="200" r="5" fill="currentColor" />
                <circle cx="310" cy="200" r="5" fill="currentColor" />
                <path d="M 200,90 L 90,200 L 200,310 L 310,200 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </g>

              {/* Data Bar Graphs (Analytics domain in Green) */}
              <g className="text-[#16A34A] opacity-60">
                <rect x="70" y="270" width="16" height="90" fill="currentColor" rx="2" className="animate-pulse" style={{ animationDelay: '0.1s' }} />
                <rect x="110" y="220" width="16" height="140" fill="currentColor" rx="2" className="animate-pulse" style={{ animationDelay: '0.3s' }} />
                <rect x="150" y="290" width="16" height="70" fill="currentColor" rx="2" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
                <rect x="230" y="240" width="16" height="120" fill="currentColor" rx="2" className="animate-pulse" style={{ animationDelay: '0.2s' }} />
                <rect x="270" y="190" width="16" height="170" fill="currentColor" rx="2" className="animate-pulse" style={{ animationDelay: '0.4s' }} />
                <rect x="310" y="260" width="16" height="100" fill="currentColor" rx="2" className="animate-pulse" style={{ animationDelay: '0.6s' }} />
              </g>

              {/* Upward Finance Spline (Advisory domain in Amber with Blue connector dots) */}
              <g className="text-[#F59E0B]">
                <path 
                  d="M 40,320 Q 120,280 200,190 T 360,70" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="3.5" 
                  strokeLinecap="round"
                />
                {/* Active Sweeping Node & Connectors in Blue */}
                <circle cx="360" cy="70" r="5" fill="#2563EB" className="animate-pulse" />
                <circle cx="200" cy="190" r="4" fill="#2563EB" />
                <circle cx="120" cy="280" r="4" fill="#2563EB" />
              </g>
              
            </svg>
          </div>
        </div>
      </section>

      {/* Featured Capabilities (Skills Grid) */}
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
          <FloatingIconCarousel skills={data.featuredSkills} />
        </div>
      </section>

      {/* Featured Projects (3D Showcase Teaser) */}
      <section className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-end border-b border-border pb-4">
          <div className="space-y-1">
            <h2 className="text-h3 font-bold text-text-primary tracking-tight">Code & Engineering Showcases</h2>
            <span className="text-label text-text-muted font-mono block">// RETRIEVING_PROJECT_GALLERY</span>
          </div>
          <Link to="/projects" className="text-label text-text-muted hover:text-accent-ai flex items-center gap-1.5 transition-colors">
            OPEN SPIRAL <ArrowRight size={12} />
          </Link>
        </div>

        {data.projects && data.projects.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Project Sector Table List */}
            <div className="lg:col-span-5 bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-none p-4 flex flex-col justify-between">
              <div>
                <div className="grid grid-cols-3 text-[10px] font-mono text-text-muted uppercase border-b border-border pb-3 mb-2 px-3 tracking-wider font-bold">
                  <div>Project</div>
                  <div>Domain</div>
                  <div className="text-right">Key Focus</div>
                </div>
                
                <div className="space-y-1">
                  {data.projects.slice(0, 5).map((project, index) => {
                    const isActive = activeProjectIndex === index;
                    
                    return (
                      <div
                        key={project._id}
                        onClick={() => setActiveProjectIndex(index)}
                        className={`grid grid-cols-3 items-center py-3.5 px-3 rounded-lg cursor-pointer transition-all duration-200 border-l-[3px] select-none ${
                          isActive 
                            ? 'border-l-[#2563EB] bg-[#EFF6FF] border-y border-r border-[#E2E8F0] shadow-none' 
                            : 'border-l-transparent hover:bg-[#F1F5F9]/60 hover:border-l-[#64748B]/30'
                        }`}
                      >
                        <div className={`text-xs font-bold font-display ${isActive ? 'text-text-primary' : 'text-text-secondary'}`}>
                          {project.title}
                        </div>
                        <div className="text-[10px] font-mono text-text-muted truncate uppercase">
                          {project.category}
                        </div>
                        <div className="text-[10px] font-mono text-text-muted text-right truncate">
                          {project.tags && project.tags.length > 0 ? project.tags[0] : 'Engineering'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-border/20 pt-4 mt-4 px-3 flex justify-between items-center text-[10px] font-mono text-text-muted">
                <span>ACTIVE_RECORD // 0{activeProjectIndex + 1}_OF_0{Math.min(data.projects.length, 5)}</span>
                <span className="animate-pulse">SELECT_TO_SPECIFY</span>
              </div>
            </div>

            {/* Right Column: Dynamic Glass details card preview */}
            {(() => {
              const activeProject = data.projects.slice(0, 5)[activeProjectIndex] || data.projects[0];
              
              const getProjectAccent = (category: string) => {
                const cat = category.toLowerCase();
                if (cat.includes("ai") || cat.includes("ml") || cat.includes("agent") || cat.includes("intelligence")) {
                  return { 
                    accent: "text-[#2563EB]", 
                    border: "border-[#2563EB]/25", 
                    borderL: "border-l-[#2563EB]", 
                    bg: "bg-[#EFF6FF]" 
                  };
                }
                if (cat.includes("data") || cat.includes("analytics") || cat.includes("dashboard")) {
                  return { 
                    accent: "text-[#16A34A]", 
                    border: "border-[#16A34A]/25", 
                    borderL: "border-l-[#16A34A]", 
                    bg: "bg-[#F0FDF4]" 
                  };
                }
                return { 
                  accent: "text-[#B45309]", 
                  border: "border-[#F59E0B]/25", 
                  borderL: "border-l-[#F59E0B]", 
                  bg: "bg-[#FFFBEB]" 
                };
              };
              
              const activeProjectColors = getProjectAccent(activeProject.category);

              return (
                <div className="lg:col-span-7 bg-white border border-[#E2E8F0] rounded-2xl p-6 shadow-none flex flex-col justify-between min-h-[380px] relative overflow-hidden group">
                  {/* Subtle Grid overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.015)_1px,transparent_1px)] bg-[size:12px_12px] pointer-events-none" />
                  
                  <div className="space-y-6 relative z-10">
                    <div className="flex justify-between items-center">
                      <span className={`text-[9px] font-mono font-bold tracking-wider px-2.5 py-0.5 rounded-full uppercase border ${activeProjectColors.accent} ${activeProjectColors.border} ${activeProjectColors.bg}`}>
                        {activeProject.category}
                      </span>
                      <span className="text-[10px] font-mono text-text-muted">
                        {new Date(activeProject.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short" })}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-h3 font-bold text-text-primary font-display tracking-tight leading-none">
                        {activeProject.title}
                      </h3>
                      <p className="text-xs text-text-secondary leading-relaxed max-w-xl">
                        {activeProject.shortDescription}
                      </p>
                    </div>

                    {/* Decorative category-based SVG visualization on the right, matching user's image! */}
                    <div className="w-full h-32 bg-[#F1F5F9] border border-[#E2E8F0] rounded-xl flex items-center justify-center relative overflow-hidden p-4">
                      {/* Dynamic Category SVG */}
                      {activeProject.category.toLowerCase().includes("ai") || activeProject.category.toLowerCase().includes("machine") ? (
                        /* AI Neural Nodes */
                        <svg viewBox="0 0 200 100" className="w-full h-full text-[#2563EB]/40">
                          <circle cx="40" cy="50" r="4" fill="#2563EB" className="animate-pulse" />
                          <circle cx="100" cy="30" r="4" fill="#2563EB" className="opacity-70" />
                          <circle cx="100" cy="70" r="4" fill="#2563EB" className="opacity-70" />
                          <circle cx="160" cy="50" r="4" fill="#2563EB" className="animate-pulse" />
                          <line x1="40" y1="50" x2="100" y2="30" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                          <line x1="40" y1="50" x2="100" y2="70" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                          <line x1="100" y1="30" x2="160" y2="50" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                          <line x1="100" y1="70" x2="160" y2="50" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                        </svg>
                      ) : activeProject.category.toLowerCase().includes("data") || activeProject.category.toLowerCase().includes("analytics") ? (
                        /* Data Bar Chart, matching user's image! */
                        <svg viewBox="0 0 200 100" className="w-full h-full text-[#16A34A]/40">
                          <rect x="20" y="60" width="12" height="30" fill="#16A34A" className="opacity-40 animate-pulse" rx="1" style={{ animationDelay: '0.1s' }} />
                          <rect x="50" y="40" width="12" height="50" fill="#16A34A" className="opacity-60 animate-pulse" rx="1" style={{ animationDelay: '0.3s' }} />
                          <rect x="80" y="70" width="12" height="20" fill="#16A34A" className="opacity-40 animate-pulse" rx="1" style={{ animationDelay: '0.5s' }} />
                          <rect x="110" y="30" width="12" height="60" fill="#16A34A" className="opacity-80 animate-pulse" rx="1" style={{ animationDelay: '0.2s' }} />
                          <rect x="140" y="50" width="12" height="40" fill="#16A34A" className="opacity-60 animate-pulse" rx="1" style={{ animationDelay: '0.4s' }} />
                          <rect x="170" y="20" width="12" height="70" fill="#16A34A" className="animate-pulse" rx="1" style={{ animationDelay: '0.6s' }} />
                          <line x1="10" y1="90" x2="190" y2="90" stroke="currentColor" strokeWidth="1" />
                        </svg>
                      ) : (
                        /* Finance Upward Spline */
                        <svg viewBox="0 0 200 100" className="w-full h-full text-[#F59E0B]/40">
                          <path d="M 20,80 Q 70,60 120,40 T 180,20" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" className="animate-pulse" />
                          <circle cx="180" cy="20" r="4" fill="#2563EB" />
                          <line x1="10" y1="90" x2="190" y2="90" stroke="currentColor" strokeWidth="1" />
                        </svg>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 border-t border-border/20 pt-4 relative z-10">
                    {activeProject.tags && activeProject.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {activeProject.tags.slice(0, 3).map((tag: string) => (
                          <span key={tag} className="text-[9px] font-mono text-[#64748B] bg-white px-2 py-0.5 rounded border border-[#E2E8F0]">
                            #{tag.toLowerCase()}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <Link
                      to={`/project/${activeProject.slug}`}
                      className="inline-flex items-center justify-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] hover:-translate-y-0.5 text-white text-[10px] font-mono font-medium uppercase tracking-wider px-4 py-2.5 rounded-lg shadow-none transition-all duration-150 ease-in-out select-none whitespace-nowrap self-end sm:self-auto"
                    >
                      COMPILE SPEC &rarr;
                    </Link>
                  </div>
                </div>
              );
            })()}
          </div>
        ) : (
          <EmptyState title="No Projects Found" message="Verify project seeding records in administration panel." />
        )}
      </section>

      {/* Grid: Blog Articles & GitHub Contributions */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Latest Blog Posts */}
        <section className="space-y-6">
          <div className="flex justify-between items-end border-b border-border pb-4">
            <div className="space-y-1">
              <h2 className="text-h3 font-bold text-text-primary tracking-tight">Latest Analysis Notes</h2>
              <span className="text-label text-text-muted font-mono block">// READING_KNOWLEDGE_INDEX</span>
            </div>
            <Link to="/blogs" className="text-label text-text-muted hover:text-accent-finance flex items-center gap-1.5 transition-colors">
              VIEW INDEX <ArrowRight size={12} />
            </Link>
          </div>
          
          {data.latestBlog && data.latestBlog.length > 0 ? (
            <div className="space-y-4">
              {data.latestBlog.slice(0, 2).map((blog: any) => (
                <div 
                  key={blog._id} 
                  className="bg-white border border-[#E2E8F0] hover:border-[#F59E0B]/50 rounded-xl p-5 hover:-translate-y-0.5 transition-all duration-150 ease-in-out group shadow-none flex flex-col justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-mono text-text-muted">
                      <span className="uppercase text-[#B45309] font-bold">{blog.category || "FINANCE"}</span>
                      <span>{blog.readingTime || 5} MIN READ</span>
                    </div>
                    <h3 className="text-sm font-bold text-[#0F172A] group-hover:text-[#B45309] transition-colors font-display">
                      {blog.title}
                    </h3>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-text-muted">
                      {new Date(blog.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    <Link to={`/blog/${blog.slug}`} className="text-label text-[#B45309] hover:underline">
                      READ POST
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No Articles Compiled" message="Check content settings or publish an article draft." />
          )}
        </section>

        {/* GitHub Contribution Logs */}
        <section className="space-y-6">
          <div className="flex justify-between items-end border-b border-border pb-4">
            <div className="space-y-1">
              <h2 className="text-h3 font-bold text-text-primary tracking-tight">Recent System Logs</h2>
              <span className="text-label text-text-muted font-mono block">// INTERCEPTING_GITHUB_SOCKETS</span>
            </div>
            <Link to="/github" className="text-label text-text-muted hover:text-accent-analytics flex items-center gap-1.5 transition-colors">
              SYNC METRICS <ArrowRight size={12} />
            </Link>
          </div>

          {data.githubActivity && data.githubActivity.length > 0 ? (
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-6 space-y-4 shadow-none max-h-[310px] overflow-y-auto">
              {data.githubActivity.slice(0, 4).map((act: any, idx: number) => (
                <div
                  key={idx}
                  className="border-b border-divider pb-3.5 last:border-b-0 last:pb-0 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-[#16A34A] font-bold uppercase tracking-wider font-mono">
                      {act.repoName.split("/")[1] || act.repoName}
                    </span>
                    <p className="text-text-secondary leading-relaxed text-[11px] font-sans">{act.message}</p>
                  </div>
                  <span className="text-[9px] font-mono text-text-muted shrink-0 mt-0.5">
                    {new Date(act.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No Logs Syncing" message="Run the GitHub telemetry synchronization from dashboard settings." />
          )}
        </section>
      </div>

      {/* Research Highlights Section */}
      <section className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-end border-b border-border pb-4">
          <div className="space-y-1">
            <h2 className="text-h3 font-bold text-text-primary tracking-tight">Research & Publications</h2>
            <span className="text-label text-text-muted font-mono block">// QUERYING_ACADEMIC_COLLECTION</span>
          </div>
          <Link to="/research" className="text-label text-text-muted hover:text-accent-ai flex items-center gap-1.5 transition-colors">
            OPEN INDEX <ArrowRight size={12} />
          </Link>
        </div>

        {data.research && data.research.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.research.slice(0, 3).map((paper) => (
              <div
                key={paper._id}
                className="flex flex-col justify-between bg-white border border-[#E2E8F0] rounded-xl p-5 hover:border-[#2563EB]/40 hover:-translate-y-0.5 transition-all duration-150 ease-in-out group shadow-none"
              >
                <div className="space-y-3.5">
                  <div className="flex justify-between items-center text-[10px] font-mono text-text-muted">
                    <span className="uppercase text-[#2563EB] font-bold">{paper.category}</span>
                    <span>{paper.readingTime} MIN READ</span>
                  </div>
                  <h3 className="text-h4 font-bold text-text-primary group-hover:text-[#2563EB] transition-colors font-display">
                    {paper.title}
                  </h3>
                </div>
                <div className="border-t border-divider mt-6 pt-4 flex justify-between items-center text-xs">
                  <span className="text-text-muted text-[10px] font-mono">
                    {new Date(paper.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short" })}
                  </span>
                  <Link
                    to={`/research/${paper.slug}`}
                    className="text-label text-[#2563EB] hover:text-[#1D4ED8] transition-colors"
                  >
                    READ NOTE
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No Research Indexed" message="Seeding academic publications is managed by the administrator." />
        )}
      </section>

      {/* Rebuilt 2-Column Domain Division CTAs */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
        
        {/* Left CTA: Financial Advisory / Mentorship */}
        <div className="bg-white border border-[#E2E8F0] hover:border-[#F59E0B]/40 hover:-translate-y-0.5 rounded-2xl p-8 flex flex-col justify-between gap-6 shadow-none transition-all duration-150 ease-in-out">
          <div className="space-y-3">
            <h3 className="text-label text-[#B45309] font-bold flex items-center gap-2">
              <GraduationCap size={16} /> // MENTORSHIP_CHANNEL
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed font-sans">{data.mentorshipCta}</p>
          </div>
          <Link
            to="/mentorship"
            className="inline-flex justify-center items-center bg-white hover:bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0] text-xs font-semibold px-5 py-3 rounded-lg uppercase tracking-wider transition-all self-start cursor-pointer font-mono shadow-none"
          >
            Request Mentorship
          </Link>
        </div>

        {/* Right CTA: AI & Data Engineering Collab */}
        <div className="bg-white border border-[#E2E8F0] hover:border-[#2563EB]/40 hover:-translate-y-0.5 rounded-2xl p-8 flex flex-col justify-between gap-6 shadow-none transition-all duration-150 ease-in-out">
          <div className="space-y-3">
            <h3 className="text-label text-[#2563EB] font-bold flex items-center gap-2">
              <MessageSquare size={16} /> // COLLAB_GATEWAY
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed font-sans">{data.contactCta}</p>
          </div>
          <Link
            to="/contact"
            className="inline-flex justify-center items-center bg-[#2563EB] hover:bg-[#1D4ED8] hover:-translate-y-0.5 text-white text-xs font-bold px-5 py-3 rounded-lg uppercase tracking-wider transition-all self-start cursor-pointer font-mono shadow-none"
          >
            Start Project
          </Link>
        </div>
      </section>
    </div>
  );
}
