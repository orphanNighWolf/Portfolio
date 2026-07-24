import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import mongoose from "mongoose";
import { About } from "../modules/about/about.model";
import { Mission } from "../modules/mission/mission.model";
import { Skill } from "../modules/skills/skills.model";
import { Project } from "../modules/projects/projects.model";
import { Research } from "../modules/research/research.model";
import { Blog } from "../modules/blogs/blogs.model";
import { Journey } from "../modules/journey/journey.model";
import { Achievement } from "../modules/achievements/achievements.model";
import { Resource } from "../modules/resources/resources.model";
import { MentorshipService, MentorshipConfig } from "../modules/mentorship/mentorship.model";
import { ResumeData } from "../modules/resume/resume.model";
import { SocialsConfig } from "../modules/socials/socials.model";
import { GlobalSettings } from "../modules/settings/settings.model";
import pino from "pino";

const logger = pino({
  transport: {
    target: "pino-pretty",
  },
});

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/portfolio";

async function seedData() {
  try {
    logger.info("Connecting to database for seeding data...");
    await mongoose.connect(MONGO_URI);
    logger.info("Connected to database.");

    await About.deleteMany({});
    await Mission.deleteMany({});
    await Skill.deleteMany({});
    await Project.deleteMany({});
    await Research.deleteMany({});
    await Blog.deleteMany({});
    await Journey.deleteMany({});
    await Achievement.deleteMany({});
    await Resource.deleteMany({});
    await MentorshipService.deleteMany({});
    await MentorshipConfig.deleteMany({});
    await ResumeData.deleteMany({});
    await SocialsConfig.deleteMany({});
    await GlobalSettings.deleteMany({});
    logger.info("Cleared collections: About, Mission, Skills, Projects, Research, Blogs, Journey, Achievements, Resources, Mentorship, Resume, Socials, and Settings.");

    // 1. Seed About
    await About.create({
      name: "Alex Mercer",
      title: "Senior AI Researcher & Full Stack Engineer",
      bio: "Building intelligent systems at the intersection of quantitative reasoning, machine learning, and scalable web architectures. Passionate about neural networks, distributed databases, and high-performance user interfaces.",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
      location: "San Francisco, CA",
      education: [
        {
          institution: "Stanford University",
          degree: "Master of Science",
          fieldOfStudy: "Computer Science (AI Track)",
          startDate: "2020-09",
          endDate: "2022-06",
          current: false,
        },
        {
          institution: "UC Berkeley",
          degree: "Bachelor of Science",
          fieldOfStudy: "Electrical Engineering & Computer Science",
          startDate: "2016-09",
          endDate: "2020-05",
          current: false,
        },
      ],
      experience: [
        {
          company: "DeepMind Alpha",
          position: "Research Engineer",
          location: "San Francisco, CA",
          startDate: "2022-07",
          current: true,
          description: "Optimizing large language model inference architectures, designing custom RLHF alignments, and scaling vector indexing frameworks.",
        },
        {
          company: "Stripe",
          position: "Software Engineer Intern",
          location: "South San Francisco, CA",
          startDate: "2021-06",
          endDate: "2021-09",
          current: false,
          description: "Implemented custom risk assessment APIs, migrated legacy database endpoints to distributed schemas, and optimized client dashboard load speeds.",
        },
      ],
      interests: ["Quantum Mechanics", "Sci-Fi Literature", "Bouldering", "Violin Improvisation", "Decentralized Finance"],
      techStack: ["TypeScript", "Python", "React", "Node.js", "Express", "PyTorch", "Docker", "Kubernetes", "MongoDB", "PostgreSQL"],
      currentFocus: "Evaluating neural alignment techniques using high-performance token processing pipeline distributions.",
      timeline: [
        { year: "2022", title: "Joined DeepMind Alpha", description: "Began research on large-scale model inference loops." },
        { year: "2022", title: "Completed Stanford MS", description: "Graduated with specialization in Artificial Intelligence." },
        { year: "2020", title: "EECS Graduation", description: "Graduated UC Berkeley with highest honors." },
      ],
      mentorshipCta: "Book a 1:1 call to discuss career navigation, AI systems research, or full-stack software development pipelines.",
      contactCta: "Reach out via email or schedule a virtual coffee connection to discuss potential research collaborations.",
    });
    logger.info("Seeded About document.");

    // 2. Seed Mission
    await Mission.create({
      careerMission: "To bridge the gap between advanced deep learning research and production-grade full-stack implementations, creating systems that solve complex real-world data reasoning tasks.",
      longTermGoals: [
        "Develop an open-source decentralized agent framework with native local execution loops.",
        "Lead a research group focused on high-efficiency transformer architectures and zero-shot reasoning.",
        "Mentor 100+ aspiring engineers from underrepresented backgrounds in technology.",
      ],
      vision: "A future where personal AI agents operate securely and locally on edge nodes, respecting privacy while enhancing human capabilities.",
      values: [
        "Open Source Advocacy: Sharing code and research transparently.",
        "Rigorous Verification: Testing pipelines thoroughly before assumptions.",
        "User-Centric Design: Building tools that solve practical problems directly.",
      ],
      currentLearning: ["Rust Compiler Internals", "CUDA Kernel Optimization", "Differential Privacy Frameworks"],
      futureRoadmap: [
        "Q3 2026: Publish research paper on context-window compression techniques.",
        "Q4 2026: Release first beta version of local agentic scheduler loop.",
        "H1 2027: Deploy edge inference pipelines for wearable visual devices.",
      ],
    });
    logger.info("Seeded Mission document.");

    // 3. Seed Skills
    const skillsList = [
      { name: "TypeScript", category: "Programming", level: 95, yearsExperience: 6, featured: true, description: "Type-safe modern web application logic.", icon: "Code" },
      { name: "Python", category: "Programming", level: 98, yearsExperience: 7, featured: true, description: "Machine learning research, data processing, and scripting pipelines.", icon: "Terminal" },
      { name: "React", category: "Frontend", level: 90, yearsExperience: 5, featured: true, description: "Component-driven user interface development with hooks and context APIs.", icon: "Layout" },
      { name: "Tailwind CSS", category: "Frontend", level: 85, yearsExperience: 4, featured: false, description: "Utility-first modern styling frameworks.", icon: "Palette" },
      { name: "Node.js", category: "Backend", level: 92, yearsExperience: 6, featured: true, description: "Asynchronous backend server architectures.", icon: "Server" },
      { name: "Express", category: "Backend", level: 90, yearsExperience: 5, featured: false, description: "Lightweight routing framework for RESTful JSON APIs.", icon: "Cpu" },
      { name: "MongoDB", category: "Database", level: 88, yearsExperience: 5, featured: true, description: "NoSQL document store modeling and complex aggregation pipelines.", icon: "Database" },
      { name: "PostgreSQL", category: "Database", level: 85, yearsExperience: 4, featured: false, description: "Structured relational modeling and transactional integrity.", icon: "Database" },
      { name: "Docker", category: "DevOps", level: 90, yearsExperience: 5, featured: true, description: "Containerized deployments and orchestration structures.", icon: "Box" },
      { name: "PyTorch", category: "AI", level: 95, yearsExperience: 5, featured: true, description: "Deep learning model design, training loops, and evaluations.", icon: "Brain" },
      { name: "Google Cloud Platform", category: "Cloud", level: 80, yearsExperience: 3, featured: false, description: "Hosting virtual instances, serverless runtimes, and bucket storage.", icon: "Cloud" },
      { name: "Git", category: "Tools", level: 95, yearsExperience: 8, featured: false, description: "Distributed code versioning and collaborative pull-request flows.", icon: "GitBranch" },
    ];
    await Skill.insertMany(skillsList);
    logger.info(`Seeded ${skillsList.length} Skill documents.`);

    // 4. Seed Projects
    const projectsList = [
      {
        title: "AlphaSearch AI",
        category: "Artificial Intelligence",
        tags: ["Vector Search", "LLM", "Python"],
        shortDescription: "High-performance semantic vector indexer and LLM-driven retrieval augmentation pipeline.",
        problemStatement: "Keyword searches often miss contextual nuances in massive engineering document portals, leading to wasted research cycles.",
        solution: "### Hybrid Vector Engine\n- Implemented custom bidirectional sentence embeddings.\n- Built real-time chunking engines that feed a local Milvus index.\n- Connected LLaMA models for contextual retrieval QA.",
        challenges: "### High Latency\nInference latency was originally ~2.5s. Optimized via CUDA graph execution models and quantization to 4-bits, reducing search-to-answer responses down to 350ms.",
        futureImprovements: "### Agentic Routing\nIntegrating multi-agent routing loops to classify user intents before querying vector spaces.",
        techStack: ["Python", "PyTorch", "Milvus", "FastAPI", "Docker"],
        githubUrl: "https://github.com/alex-mercer/asearch-ai",
        liveDemoUrl: "https://asearch.demo.dev",
        gallery: [
          "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
          "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80",
        ],
        videos: [],
        architectureImages: ["https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80"],
        featured: true,
        status: "published",
      },
      {
        title: "QuantFlow Engine",
        category: "Quantitative Solutions",
        tags: ["Trading", "Rust", "Distributed Databases"],
        shortDescription: "High-frequency backtesting platform and statistical model execution scheduler.",
        problemStatement: "Simulating quantitative strategy performances against millisecond order-book ticks was computationally bottlenecked on legacy languages.",
        solution: "### Rust Backtesting Kernel\n- Multi-threaded backtester processing ~1.2M market ticks per second.\n- Zero-copy deserialization loops mapping historical logs.\n- Integration with PostgreSQL timescale db plugins.",
        challenges: "### Lock Contention\nHeavy CPU lock conflicts on thread pools. Resolved via lock-free ring buffers to pipeline thread-to-thread communication loops.",
        futureImprovements: "### Reinforcement Learning Strategy\nIntroduce a DQN agent configuration selector to auto-tune hedging variables during runtime simulations.",
        techStack: ["Rust", "PostgreSQL", "C++", "Docker"],
        githubUrl: "https://github.com/alex-mercer/quantflow",
        liveDemoUrl: "https://quantflow.demo.dev",
        gallery: [
          "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&auto=format&fit=crop&q=80",
        ],
        videos: [],
        architectureImages: [],
        featured: true,
        status: "published",
      },
      {
        title: "Decentralized Scheduler Core",
        category: "System Architectures",
        tags: ["Distributed Systems", "Go", "Docker"],
        shortDescription: "Fault-tolerant agent orchestration scheduler mapping task configurations on edge nodes.",
        problemStatement: "Centralized server queues fail under network partitions, interrupting data-pipeline cycles in edge clusters.",
        solution: "### Gossip Core Consensus\n- Custom RAFT consensus orchestrating job scheduling dynamically.\n- Self-healing task execution containers running locally via Docker APIs.\n- Client hooks supporting JSON-RPC commands.",
        challenges: "### Brain Split Recovery\nNetwork splits led to concurrent executions. Resolved via logical vector clocks and transaction locks.",
        futureImprovements: "### WASM Runtimes\nReplace native container deployments with secure, sandboxed WebAssembly execution sandboxes.",
        techStack: ["Go", "Docker", "gRPC", "Redis"],
        githubUrl: "https://github.com/alex-mercer/dscheduler",
        liveDemoUrl: "https://dscheduler.demo.dev",
        gallery: [
          "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80",
        ],
        videos: [],
        architectureImages: [],
        featured: false,
        status: "published",
      },
      {
        title: "CloudNest Portal",
        category: "System Architectures",
        tags: ["Kubernetes", "TypeScript", "React"],
        shortDescription: "Draft status devops manager layout tracking cluster node deployments.",
        problemStatement: "Internal testing dashboard for edge container nodes.",
        solution: "### Portal View\n- Single page react client monitoring CPU cycles.\n- Admin metrics logs.",
        challenges: "### None\nDraft sandbox test.",
        futureImprovements: "### Release\nPublish code changes.",
        techStack: ["TypeScript", "React", "Node.js"],
        githubUrl: "https://github.com/alex-mercer/cloudnest",
        gallery: [],
        videos: [],
        architectureImages: [],
        featured: false,
        status: "draft",
      },
      {
        title: "NeuralMesh Compiler",
        category: "Artificial Intelligence",
        tags: ["Compilers", "C++", "PyTorch"],
        shortDescription: "High-performance inference compiler optimizing model operators for localized edge systems.",
        problemStatement: "Standard model operators run inefficiently on low-power devices, draining batteries and causing latency.",
        solution: "### Graph Operator Fusion\n- Merged multiple activation layers into fused GPU kernels.\n- Automated weight quantization profiles down to integer limits.\n- Native C++ executable generation hooks.",
        challenges: "### Operator Incompatibilities\nCustom model shapes failed standard compilation scripts. Resolved via generic kernel code generator templates.",
        futureImprovements: "### Apple Silicon\nOptimize Metal performance shaders integration layouts.",
        techStack: ["C++", "PyTorch", "Python", "CMake"],
        githubUrl: "https://github.com/alex-mercer/neuralmesh",
        gallery: ["https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=600&auto=format&fit=crop&q=80"],
        videos: [],
        architectureImages: [],
        featured: false,
        status: "published",
      },
    ];
    await Project.create(projectsList);
    logger.info(`Seeded ${projectsList.length} Project documents.`);

    // 5. Seed Research
    const researchList = [
      {
        title: "Context Window Compression in Transformers",
        category: "Deep Learning Research",
        tags: ["LLM", "Attention Mechanics", "Research"],
        readingTime: 12,
        markdownContent: "### Abstract\nLarge context lengths in transformers cause quadratic attention cost. We present a dynamic compression framework using sliding semantic clustering.\n\n### Experiments\nTested on LLaMA-7B across 32K token windows, reducing GPU memory by 40% with <1.5% perplexity drift.",
        bookmarked: true,
        status: "published",
      },
      {
        title: "Logical Vector Clocks in High-Throughput Edge Nodes",
        category: "Distributed Systems",
        tags: ["Go", "Vector Clocks", "Consensus"],
        readingTime: 8,
        markdownContent: "### Overview\nTracing transactional order in unstable networks. This paper addresses vector clock scaling overhead by modeling logical tree increments.\n\n### Benchmarks\nMaintained strict consistency over 1,000 parallel edge devices under 20% mock packet drop rates.",
        bookmarked: false,
        status: "published",
      },
      {
        title: "Self-Healing Agent Loops with Local WebAssembly Sandboxes",
        category: "Systems & Security",
        tags: ["WASM", "Rust", "Agentic Loops"],
        readingTime: 15,
        markdownContent: "### Abstract\nExecuting untrusted user-generated code in autonomous agent cycles. We propose sandboxed WASM runtimes with resource quotas.\n\n### Implementations\nImplemented in Rust, restricting loop iterations dynamically.",
        bookmarked: false,
        status: "draft",
      },
    ];
    await Research.create(researchList);
    logger.info(`Seeded ${researchList.length} Research documents.`);

    // 6. Seed Blogs
    const blogsList = [
      {
        title: "Why We Swapped PyTorch for Rust Kernels in Tick Databases",
        category: "Systems Engineering",
        tags: ["Rust", "PyTorch", "Databases"],
        readingTime: 7,
        markdownContent: "### The Bottleneck\nWe discovered that Python's global interpreter lock (GIL) stalled our multi-threaded tickers under high tick volumes.\n\n### The Solution\nRewrote the calculations in a pure Rust static library, bound back to PyTorch using pyo3 bridges. Latency dropped instantly by 5x.",
        featured: true,
        relatedBlogSlugs: ["building-a-fault-tolerant-gossip-core-in-go"],
        status: "published",
      },
      {
        title: "Building a Fault-Tolerant Gossip Core in Go",
        category: "Distributed Infrastructure",
        tags: ["Go", "Distributed Systems", "Gossip Protocol"],
        readingTime: 10,
        markdownContent: "### Introduction\nCluster consensus is hard. In this article, we map the gossip protocol details, from peer discovery to anti-entropy sweeps.",
        featured: false,
        relatedBlogSlugs: ["why-we-swapped-pytorch-for-rust-kernels-in-tick-databases"],
        status: "published",
      },
      {
        title: "The Sandbox Trap: Secure Execution Loops in AI Assistants",
        category: "AI Security",
        tags: ["Security", "Docker", "WASM"],
        readingTime: 5,
        markdownContent: "### Explaining Sandbox Escape Vectors\nAI assistants executing terminal commands must be locked. We analyze why Docker daemon configurations are often insecure.",
        featured: false,
        relatedBlogSlugs: [],
        status: "draft",
      },
    ];
    await Blog.create(blogsList);
    logger.info(`Seeded ${blogsList.length} Blog documents.`);

    // 7. Seed Journey
    const journeyList = [
      {
        type: "college",
        title: "B.S. in Electrical Engineering & Computer Science",
        description: "Graduated with highest honors from UC Berkeley. Specialized in distributed databases and compiler designs.",
        dateRange: "2016 - 2020",
        icon: "GraduationCap",
      },
      {
        type: "internship",
        title: "Software Engineer Intern at Stripe",
        description: "Designed custom ledger verification schemas and microservices for merchant payout compliance checks.",
        dateRange: "Summer 2021",
        icon: "Briefcase",
      },
      {
        type: "school",
        title: "M.S. in Computer Science at Stanford University",
        description: "Academics in neural network models and heuristic searching. Published MS thesis on sliding window attention compression.",
        dateRange: "2020 - 2022",
        icon: "BookOpen",
      },
      {
        type: "project",
        title: "Launched AlphaSearch AI Platform",
        description: "Integrated local semantic retrieval vector indexers supporting LLM-driven query optimizations.",
        dateRange: "Late 2024",
        icon: "Terminal",
      },
      {
        type: "futureGoal",
        title: "Develop Zero-Shot WebAssembly Compiler Loops",
        description: "Targeting decentralized edge execution sandboxes supporting secure, fast agent scheduler cycles.",
        dateRange: "2027 Roadmap",
        icon: "Cpu",
      },
    ];
    await Journey.insertMany(journeyList);
    logger.info(`Seeded ${journeyList.length} Journey milestones.`);

    // 8. Seed Achievements
    const achievementsList = [
      {
        type: "award",
        title: "Outstanding Research Award (Stanford CS)",
        organization: "Stanford Computer Science Department",
        date: new Date("2022-06-15"),
        description: "Honored for MS thesis on context compression algorithms for transformer models.",
        imageUrl: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=400&auto=format&fit=crop&q=80",
        link: "https://cs.stanford.edu/awards",
      },
      {
        type: "hackathon",
        title: "1st Place Champion - SF AI agent Hackathon",
        organization: "SF AI Builders & Founders",
        date: new Date("2024-10-20"),
        description: "Led a team of three to build a decentralized executor node utilizing local WebAssembly loops.",
        imageUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&auto=format&fit=crop&q=80",
        link: "https://hackathon.demo",
      },
      {
        type: "certificate",
        title: "AWS Certified Solutions Architect (Professional)",
        organization: "Amazon Web Services",
        date: new Date("2023-04-10"),
        description: "Validated expert knowledge in architecting distributed fault-tolerant environments.",
        imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&auto=format&fit=crop&q=80",
        link: "https://aws.amazon.com/certification",
      },
    ];
    await Achievement.insertMany(achievementsList);
    logger.info(`Seeded ${achievementsList.length} Achievement entries.`);

    // 9. Seed Resources
    const resourcesList = [
      {
        type: "cheatsheet",
        title: "Transformers & Attention Mechanics Cheat Sheet",
        category: "Deep Learning",
        description: "Math formulas, query-key-value scaling rules, and memory calculation helpers for multi-head attention blocks.",
        fileUrl: "https://res.cloudinary.com/mock-cloud/raw/upload/v123456/transformers-cheat-sheet.pdf",
        downloadCount: 120,
        status: "published",
      },
      {
        type: "roadmap",
        title: "Rust Systems Programming Learning Path",
        category: "Systems Engineering",
        description: "Sequential reading log for mastering memory allocations, asynchronous tokio cycles, and zero-copy parsing.",
        fileUrl: "https://res.cloudinary.com/mock-cloud/raw/upload/v123456/rust-roadmap.pdf",
        downloadCount: 85,
        status: "published",
      },
      {
        type: "template",
        title: "Express TypeScript Boilerplate with Zod & Pino",
        category: "Backend",
        description: "Pre-configured template repository matching strict tsconfigs, centralized exception mappings, and rate limiters.",
        fileUrl: "https://res.cloudinary.com/mock-cloud/raw/upload/v123456/express-boilerplate.zip",
        downloadCount: 42,
        status: "published",
      },
      {
        type: "pdf",
        title: "Local WASM Executor Design Specs",
        category: "Systems Engineering",
        description: "Sandbox draft specifications for zero-shot WebAssembly execution cycles.",
        fileUrl: "https://res.cloudinary.com/mock-cloud/raw/upload/v123456/wasm-specs.pdf",
        downloadCount: 0,
        status: "draft",
      },
    ];
    await Resource.create(resourcesList);
    logger.info(`Seeded ${resourcesList.length} Resource documents.`);

    // 10. Seed Mentorship Services
    const servicesList = [
      { title: "1-on-1 Strategy Session", description: "60-minute deep dive into engineering architecture, career navigation, or code patterns.", price: 120, duration: "60 Min" },
      { title: "Career Guidance & Pathing", description: "Structured review of your background to chart a concrete transition plan into systems development.", price: 90, duration: "45 Min" },
      { title: "Resume & Portfolio Review", description: "Detailed optimization of your resume, GitHub repositories, and project presentation assets.", price: 75, duration: "30 Min" },
      { title: "AI Consulting & Architecting", description: "Strategy session covering vector search, local execution loops, and custom embedding pipelines.", price: 150, duration: "60 Min" },
      { title: "Mock Technical Interview", description: "Simulated software engineering or systems research interview with instant feedback loops.", price: 130, duration: "60 Min" }
    ];
    await MentorshipService.create(servicesList);
    logger.info(`Seeded ${servicesList.length} Mentorship Services.`);

    // 11. Seed Mentorship Config (Testimonials & FAQs)
    const mockConfig = {
      testimonials: [
        { name: "Jane Doe", role: "Software Engineer at Stripe", text: "Alex's mock interviews and architectural guidance were instrumental in helping me secure my role. Extremely structured feedback!", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" },
        { name: "David Chen", role: "Graduate Student at Stanford", text: "The AI consultation session clarified exactly how to set up vector indexing constraints. Highly recommend his systems engineering sessions.", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" }
      ],
      faqs: [
        { question: "Who is this mentorship program designed for?", answer: "Aspiring developers, systems engineers, and research graduates looking for hands-on, production-grade systems advice." },
        { question: "Can I reschedule a booked session?", answer: "Yes, you can reschedule up to 24 hours before the session slot by contacting me directly via the form." },
        { question: "Are sessions conducted remotely?", answer: "Yes, all mentorship sessions are conducted remotely over secure video conference links." }
      ]
    };
    await MentorshipConfig.create(mockConfig);
    logger.info("Seeded Mentorship Config document.");

    // 12. Seed Resume Data
    const mockResume = {
      personalInfo: {
        name: "Alex Mercer",
        email: "alex@mercer.com",
        phone: "+1 (555) 019-2834",
        website: "https://anni.dev",
        github: "github.com/alex-mercer",
        location: "San Francisco, CA",
        title: "Senior AI & Systems Infrastructure Engineer",
        summary: "Systems architect and developer specializing in low-latency infrastructure, high-performance distributed networks, and real-time machine learning deployment pipelines."
      },
      experience: [
        {
          company: "Neural Infrastructure Lab",
          position: "Lead Systems Architect",
          startDate: "2024-03",
          endDate: "Present",
          description: "Led development of real-time GPU orchestration frameworks, scaling custom embedding and retrieval loops to millions of queries per second. Reduced processing latency by 35%."
        },
        {
          company: "Distributed Systems Corp",
          position: "Senior Infrastructure Engineer",
          startDate: "2022-01",
          endDate: "2024-02",
          description: "Built high-throughput consensus mechanisms and localized WebAssembly execution sandboxes. Refactored Node and Rust services to optimize runtime execution cycles."
        }
      ],
      education: [
        {
          institution: "Stanford University",
          degree: "Master of Science",
          fieldOfStudy: "Computer Science (Systems Specialization)",
          startDate: "2020-09",
          endDate: "2021-12"
        }
      ],
      projects: [
        {
          title: "Local WASM Executor Sandbox",
          description: "Custom zero-shot sandbox built for high-performance localized edge execution of sandboxed WASM files.",
          role: "Creator",
          techStack: ["Rust", "Wasmtime", "TypeScript"],
          link: "https://github.com/alex-mercer/wasm-sandbox"
        }
      ],
      skills: [
        { name: "Rust", level: 95, category: "Programming" },
        { name: "TypeScript", level: 90, category: "Programming" },
        { name: "Go", level: 85, category: "Programming" },
        { name: "C++", level: 80, category: "Programming" },
        { name: "Node.js", level: 90, category: "Backend" },
        { name: "Kubernetes", level: 85, category: "DevOps" },
        { name: "Docker", level: 90, category: "DevOps" }
      ],
      certificates: [
        {
          name: "Certified Kubernetes Administrator (CKA)",
          issuer: "The Linux Foundation",
          date: "2025-05",
          credentialUrl: "https://linuxfoundation.org/cka"
        }
      ]
    };
    await ResumeData.create(mockResume);
    logger.info("Seeded Resume Config data.");

    // 13. Seed Socials config
    const mockSocials = {
      platforms: [
        { platform: "GitHub", url: "https://github.com/alex-mercer", handle: "alex-mercer", followerCount: 0 },
        { platform: "Twitter", url: "https://twitter.com/alex_mercer", handle: "@alex_mercer", followerCount: 1250 },
        { platform: "LinkedIn", url: "https://linkedin.com/in/alex-mercer", handle: "alex-mercer", followerCount: 3840 }
      ]
    };
    await SocialsConfig.create(mockSocials);
    logger.info("Seeded Socials platforms data.");

    // 14. Seed Default GlobalSettings
    await GlobalSettings.create({
      darkModeDefault: true,
      language: "en",
      soundToggle: true,
      animationToggle: true,
      accessibilityOptions: { screenReaderFriendly: false, highContrast: false },
      themeTokens: { primaryColor: "#00e5ff", secondaryColor: "#ff007f" },
      enabledSections: {
        about: true,
        skills: true,
        projects: true,
        blogs: true,
        contact: true,
        journey: true,
        achievements: true,
        resources: true,
        mentorship: true,
        resume: true,
        assistant: true,
        research: true,
      },
    });
    logger.info("Seeded GlobalSettings default configuration document.");

  } catch (error) {
    logger.error({ err: error }, "Failed to seed database data");
  } finally {
    await mongoose.connection.close();
    logger.info("Database connection closed.");
  }
}

seedData();
