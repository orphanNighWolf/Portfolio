export interface Project {
  id: string;
  title: string;
  description: string;
  category: "Analyst" | "Engineer" | "Scientist";
  tags: string[];
  githubUrl?: string;
  demoUrl?: string;
  period?: string;
}

export interface Skill {
  name: string;
  category: "Languages" | "Data Engineering" | "Analytics & BI" | "Data Science & ML" | "Frontend" | "Backend" | "Databases & ORMs" | "Security & Auth" | "Testing & Tooling";
  level: number; // 1-5
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  location?: string;
  description: string[];
  track: "analyst" | "engineer" | "scientist";
}

export interface Blog {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  readingTime: string;
}

export interface JourneyMilestone {
  year: string;
  title: string;
  subtitle: string;
  description: string;
  type: "academic" | "career" | "project";
}

export interface Certificate {
  name: string;
  issuer: string;
  date?: string;
}

export const portfolioData = {
  profile: {
    name: "Aniket Saini",
    title: "Data Analytics Executive & Full-Stack / Data Engineer",
    subtitle: "MCA Candidate at Uttaranchal University | Ex-Balaji Action Buildwell",
    bio: "Data Analytics & Reporting Executive with experience extracting operational data from SAP, developing Power BI (DAX/Power Query) dashboards, and building full-stack web applications (Next.js/React, Node.js/NestJS, TypeScript) and AI machine learning models.",
    email: "aniketsaini0596@gmail.com",
    phone: "7818062803",
    location: "Dehradun / Bareilly, India",
    github: "https://github.com/orphanNighWolf",
    linkedin: "https://linkedin.com",
  },
  skills: [
    // Languages & Analytics
    { name: "Python", category: "Languages", level: 5 },
    { name: "SQL", category: "Languages", level: 5 },
    { name: "TypeScript", category: "Languages", level: 5 },
    { name: "JavaScript", category: "Languages", level: 5 },

    // Data Analytics & BI
    { name: "Power BI (DAX / Power Query)", category: "Analytics & BI", level: 5 },
    { name: "Tableau", category: "Analytics & BI", level: 4 },
    { name: "Excel (Advanced Workflows)", category: "Analytics & BI", level: 5 },

    // Frontend
    { name: "Next.js", category: "Frontend", level: 5 },
    { name: "React 19 / Vite", category: "Frontend", level: 5 },
    { name: "Tailwind CSS", category: "Frontend", level: 5 },
    { name: "TanStack React Query", category: "Frontend", level: 5 },
    { name: "Zustand", category: "Frontend", level: 4 },

    // Backend & Databases
    { name: "Node.js / Express", category: "Backend", level: 5 },
    { name: "NestJS", category: "Backend", level: 4 },
    { name: "MongoDB / Mongoose", category: "Databases & ORMs", level: 5 },
    { name: "Prisma ORM", category: "Databases & ORMs", level: 5 },
    { name: "Redis", category: "Databases & ORMs", level: 4 },
    { name: "PostgreSQL", category: "Databases & ORMs", level: 4 },

    // Security & Auth
    { name: "JWT & Argon2 / bcryptjs", category: "Security & Auth", level: 5 },
    { name: "Helmet & Express Rate Limit", category: "Security & Auth", level: 4 },

    // Testing & Tooling
    { name: "Vitest & React Testing Library", category: "Testing & Tooling", level: 4 },
    { name: "Git & GitHub", category: "Testing & Tooling", level: 5 },
    { name: "Zod & Pino", category: "Testing & Tooling", level: 4 },
  ] as Skill[],
  certificates: [
    { name: "Introduction to MCP (Anthropic)", issuer: "Anthropic", date: "2026" },
    { name: "Java Masterclass 2025 (130+ hrs)", issuer: "Udemy", date: "2025" },
    { name: "AWS Certified Cloud Practitioner", issuer: "Amazon Web Services", date: "2025" },
  ] as Certificate[],
  projects: [
    {
      id: "1",
      title: "Commodities Market AI Agent",
      description: "Building a backtesting framework in Python to evaluate trading strategies on historical data, measuring profitability and risk exposure using ML and statistical optimization.",
      category: "Scientist",
      tags: ["Python", "Machine Learning", "Backtesting", "Time-Series Analysis"],
      period: "April 2026 – Present",
      githubUrl: "https://github.com/orphanNighWolf",
    },
    {
      id: "2",
      title: "CampusVerse — Campus Student Networking Platform",
      description: "Built a Next.js/NestJS monorepo with Prisma ORM, Redis session caching, Argon2 JWT authentication, and GDPR/DPDP-compliant data export/deletion endpoints with MongoDB transactions.",
      category: "Engineer",
      tags: ["Next.js", "NestJS", "Prisma", "MongoDB", "Redis", "TypeScript", "Argon2"],
      period: "May 2026 – Present",
      githubUrl: "https://github.com/orphanNighWolf",
    },
    {
      id: "3",
      title: "ImpactTrace – Dependency Analysis & Visualization Library",
      description: "Developed a Node.js/TypeScript library that analyzes project architecture, generates visual dependency graphs between modules/components, and tracks change impact across applications.",
      category: "Engineer",
      tags: ["Node.js", "TypeScript", "Graph Visualization", "AST Parsing"],
      period: "October 2025 – March 2026",
      githubUrl: "https://github.com/orphanNighWolf",
    },
    {
      id: "4",
      title: "Portfolio Website -- Full-Stack Monorepo",
      description: "Built a full-stack monorepo (React 19/Vite client + Express/MongoDB server) featuring JWT auth, rate-limited API security, OpenAI SSE RAG integration, and Vitest test suites.",
      category: "Engineer",
      tags: ["React 19", "TypeScript", "Vite", "Tailwind CSS", "Node.js", "Express", "MongoDB", "Vitest"],
      period: "March 2026 – June 2026",
      githubUrl: "https://github.com/orphanNighWolf",
    }
  ] as Project[],
  experience: [
    {
      role: "Data Analytics & Reporting Executive",
      company: "Balaji Action Buildwell Pvt. Ltd.",
      period: "September 2025 – April 2026",
      location: "Uttrakhand",
      description: [
        "Extracted and processed operational data from SAP, applying structured data-handling techniques to support business reporting.",
        "Built and maintained Power BI dashboards, using Power Query and DAX for data transformation.",
        "Automated recurring data cleaning and validation workflows in Excel to reduce manual errors and improve reporting turnaround.",
        "Delivered daily/weekly performance reports, collaborating with management to translate raw operational data into actionable insights.",
      ],
      track: "analyst",
    }
  ] as Experience[],
  blogs: [
    {
      id: "blog-1",
      slug: "power-bi-dax-optimization-sap-data",
      title: "Optimizing Power BI DAX & Power Query Workflows for SAP Data",
      excerpt: "How structured data transformation and automated Excel validation reduced operational reporting turnaround times.",
      content: "Processing operational data directly from SAP enterprise systems presents unique challenges in data structure and validation. By designing custom DAX measures and automating Power Query cleaning rules, operational teams gain instant visibility into daily metrics...",
      date: "April 2026",
      category: "Data Analytics",
      readingTime: "5 min read",
    },
    {
      id: "blog-2",
      slug: "building-argon2-jwt-auth-nestjs-prisma",
      title: "Building GDPR & DPDP Compliant Auth with Argon2 & NestJS",
      excerpt: "Implementing secure session management with Prisma ORM, Redis caching, and transactional data export/deletion endpoints.",
      content: "Data privacy regulations require applications to support strict access controls and verifiable data deletion routines. In this post, we walk through configuring Argon2 password hashing alongside Redis-backed JWT session revocation in a NestJS monorepo...",
      date: "May 2026",
      category: "Software Engineering",
      readingTime: "7 min read",
    }
  ] as Blog[],
  journey: [
    {
      year: "2025 – Present",
      title: "Master of Computer Applications (MCA)",
      subtitle: "Uttaranchal University | Dehradun (CGPA: 7.23)",
      description: "Pursuing Master's degree specializing in Advanced Data Analytics, Software Architecture, and Intelligent Systems.",
      type: "academic",
    },
    {
      year: "2025 – 2026",
      title: "Data Analytics & Reporting Executive",
      subtitle: "Balaji Action Buildwell Pvt. Ltd. | Uttrakhand",
      description: "Extracted SAP operational data, engineered Power BI DAX dashboards, and automated recurring Excel validation pipelines.",
      type: "career",
    },
    {
      year: "2021 – 2024",
      title: "Bachelor of Computer Applications (BCA)",
      subtitle: "Invertis University | Bareilly (67%)",
      description: "Completed undergraduate degree laying foundational knowledge in programming, database management, and web development.",
      type: "academic",
    }
  ] as JourneyMilestone[],
};
