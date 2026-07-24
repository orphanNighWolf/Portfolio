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
import { Code2, Server, Database, GitBranch, Brain, Wrench, Compass } from "lucide-react";

export const SIMPLE_ICONS_MAP: Record<string, any> = {
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

export const getSkillIcon = (name: string, category: string) => {
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

export const getCategoryTheme = (category: string) => {
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
