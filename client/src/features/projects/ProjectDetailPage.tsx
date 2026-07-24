import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import MDEditor from "@uiw/react-md-editor";
import { Github, ExternalLink, ArrowLeft, Code2, AlertCircle, Compass, Target } from "lucide-react";

interface Project {
  _id: string;
  title: string;
  category: string;
  tags: string[];
  shortDescription: string;
  problemStatement: string;
  solution: string;
  challenges: string;
  futureImprovements: string;
  techStack: string[];
  githubUrl?: string;
  liveDemoUrl?: string;
  gallery: string[];
  videos: string[];
  architectureImages: string[];
  featured: boolean;
  createdAt: string;
}

export default function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data, isLoading, error } = useQuery<Project>({
    queryKey: ["project", slug],
    queryFn: async () => {
      const response = await api.get(`/projects/${slug}`);
      return response.data.data;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20 font-mono text-xs text-cyan-400">
        // DECODING_SPECIFICATION_MANIFEST...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-20 font-mono text-xs text-red-400">
        Error: Specification decryption failed or project missing.
      </div>
    );
  }

  const project = data;

  return (
    <div className="max-w-4xl mx-auto space-y-10 font-mono text-sm">
      {/* Back button */}
      <div>
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-cyan-400 transition-colors uppercase"
        >
          <ArrowLeft size={14} /> Back to index
        </Link>
      </div>

      {/* Main Header Card */}
      <section className="bg-[#0E0E13]/50 border border-white/5 p-8 rounded-xl space-y-4">
        <div className="flex justify-between items-start flex-wrap gap-3">
          <span className="text-[10px] bg-cyan-950/40 text-cyan-400 border border-cyan-500/25 px-2.5 py-0.5 rounded uppercase">
            {project.category}
          </span>
          <span className="text-[10px] text-gray-500">
            COMPILED // {new Date(project.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long" })}
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-[#F7F5F0] tracking-wide">{project.title}</h1>
        <p className="text-xs text-gray-400 leading-relaxed">{project.shortDescription}</p>

        {/* Links */}
        <div className="flex flex-wrap gap-4 pt-2">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs bg-white/5 hover:bg-white/10 text-gray-300 px-3 py-1.5 rounded transition-colors"
            >
              <Github size={14} /> Repository
            </a>
          )}
          {project.liveDemoUrl && (
            <a
              href={project.liveDemoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs bg-cyan-500 hover:bg-cyan-600 text-black px-3 py-1.5 rounded font-semibold transition-colors"
            >
              <ExternalLink size={14} /> Live Demo
            </a>
          )}
        </div>
      </section>

      {/* Media Gallery Grid */}
      {project.gallery && project.gallery.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xs text-gray-400 uppercase tracking-widest">// SCREENSHOT_GALLERY</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.gallery.map((imgUrl, idx) => (
              <div key={idx} className="border border-white/5 rounded-lg overflow-hidden bg-[#0E0E13]">
                <img
                  src={imgUrl}
                  alt={`Screenshot ${idx + 1}`}
                  className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Content Sections */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Left Side: Summary & Stack */}
        <div className="md:col-span-1 space-y-6">
          {/* Tech Stack */}
          <div className="bg-[#0E0E13]/30 border border-white/5 p-5 rounded-xl space-y-3">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
              <Code2 size={14} /> Tech Stack
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="bg-cyan-950/40 text-cyan-400 border border-cyan-500/20 text-[10px] px-2 py-0.5 rounded"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="bg-[#0E0E13]/30 border border-white/5 p-5 rounded-xl space-y-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Metadata Tags</h3>
              <div className="flex flex-wrap gap-1 text-[10px] text-gray-500">
                {project.tags.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Markdown Blocks */}
        <div className="md:col-span-2 space-y-8">
          {/* Problem Statement */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
              <Target size={14} /> Problem Statement
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed bg-[#0E0E13]/20 border border-white/5 p-4 rounded-lg">
              {project.problemStatement}
            </p>
          </div>

          {/* Solution */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
              <Compass size={14} /> Solution Details
            </h3>
            <div className="bg-[#0E0E13]/25 border border-white/5 p-4 rounded-lg" data-color-mode="dark">
              <MDEditor.Markdown
                source={project.solution}
                style={{ backgroundColor: "transparent", fontSize: "11px", color: "#F7F5F0", fontFamily: "monospace" }}
              />
            </div>
          </div>

          {/* Challenges */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
              <AlertCircle size={14} /> Challenges & Solutions
            </h3>
            <div className="bg-[#0E0E13]/25 border border-white/5 p-4 rounded-lg" data-color-mode="dark">
              <MDEditor.Markdown
                source={project.challenges}
                style={{ backgroundColor: "transparent", fontSize: "11px", color: "#F7F5F0", fontFamily: "monospace" }}
              />
            </div>
          </div>

          {/* Future Improvements */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
              <Compass size={14} /> Future Roadmap
            </h3>
            <div className="bg-[#0E0E13]/25 border border-white/5 p-4 rounded-lg" data-color-mode="dark">
              <MDEditor.Markdown
                source={project.futureImprovements}
                style={{ backgroundColor: "transparent", fontSize: "11px", color: "#F7F5F0", fontFamily: "monospace" }}
              />
            </div>
          </div>

          {/* Architecture Images */}
          {project.architectureImages && project.architectureImages.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">// SYSTEM_ARCHITECTURE</h3>
              <div className="space-y-4">
                {project.architectureImages.map((imgUrl, idx) => (
                  <div key={idx} className="border border-white/5 rounded-lg overflow-hidden bg-[#0E0E13]">
                    <img src={imgUrl} alt={`Architecture ${idx + 1}`} className="w-full object-contain max-h-[400px] p-2" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
