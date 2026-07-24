import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Download, Briefcase, GraduationCap, Code, FileBadge, Mail, Phone, MapPin, Globe, Github } from "lucide-react";
import LoadingState from "@/components/LoadingState";
import Button from "@/components/Button";

interface PersonalInfo {
  name: string;
  email: string;
  phone: string;
  website: string;
  github: string;
  location: string;
  title: string;
  summary: string;
}

interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
}

interface Project {
  title: string;
  description: string;
  role: string;
  techStack: string[];
  link?: string;
}

interface Skill {
  name: string;
  level: number;
  category: string;
}

interface Certificate {
  name: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
}

interface ResumeResponse {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: Skill[];
  certificates: Certificate[];
}

export default function ResumePage() {
  const { data, isLoading } = useQuery<ResumeResponse>({
    queryKey: ["resume"],
    queryFn: async () => {
      const res = await api.get("/resume");
      return res.data.data;
    },
  });

  const handleDownloadPDF = () => {
    const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    window.open(`${backendUrl}/resume/pdf`, "_blank");
  };

  if (isLoading) {
    return <LoadingState message="LOADING_CREDENTIALS_MANIFEST..." />;
  }

  if (!data) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 font-mono text-sm">
      {/* Page Header */}
      <div className="flex justify-between items-center border-b border-border pb-4 flex-wrap gap-4">
        <div>
          <h1 className="text-h2 font-bold text-text-primary font-display">Resume</h1>
          <p className="text-xs text-text-muted mt-1">// Structured professional history and technical parameters</p>
        </div>
        <Button
          onClick={handleDownloadPDF}
          variant="primary"
          size="sm"
          icon={<Download size={14} />}
          className="bg-accent-finance hover:bg-accent-finance/90 text-bg-base border-accent-finance/10"
        >
          Download PDF
        </Button>
      </div>

      {/* Main Preview Container */}
      <div className="bg-bg-surface border border-border rounded-2xl p-8 space-y-8 shadow-2xl relative overflow-hidden">
        {/* Sky glow element */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-accent-finance/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        {/* Header Block */}
        <div className="text-center space-y-4">
          <div className="space-y-1.5">
            <h2 className="text-h2 font-bold text-text-primary tracking-tight font-display">{data.personalInfo.name.toUpperCase()}</h2>
            <p className="text-accent-finance text-xs uppercase font-bold tracking-widest font-mono">{data.personalInfo.title}</p>
          </div>

          <div className="flex justify-center items-center gap-4 flex-wrap text-[11px] text-text-muted">
            {data.personalInfo.email && (
              <span className="flex items-center gap-1.5"><Mail size={12} className="text-accent-finance" /> {data.personalInfo.email}</span>
            )}
            {data.personalInfo.phone && (
              <span className="flex items-center gap-1.5"><Phone size={12} className="text-accent-finance" /> {data.personalInfo.phone}</span>
            )}
            {data.personalInfo.location && (
              <span className="flex items-center gap-1.5"><MapPin size={12} className="text-accent-finance" /> {data.personalInfo.location}</span>
            )}
            {data.personalInfo.website && (
              <span className="flex items-center gap-1.5">
                <Globe size={12} className="text-accent-finance" /> 
                <a href={data.personalInfo.website} target="_blank" rel="noreferrer" className="hover:text-accent-finance hover:underline">
                  {data.personalInfo.website.replace(/^https?:\/\//, "")}
                </a>
              </span>
            )}
            {data.personalInfo.github && (
              <span className="flex items-center gap-1.5">
                <Github size={12} className="text-accent-finance" /> 
                <span className="text-text-muted">{data.personalInfo.github}</span>
              </span>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-2.5 border-t border-divider pt-6">
          <h3 className="text-xs font-bold text-accent-finance uppercase tracking-widest font-mono">// Summary</h3>
          <p className="text-xs text-text-secondary leading-relaxed font-sans">{data.personalInfo.summary}</p>
        </div>

        {/* Experience */}
        {data.experience.length > 0 && (
          <div className="space-y-4 border-t border-divider pt-6">
            <h3 className="text-xs font-bold text-accent-finance uppercase tracking-widest flex items-center gap-2 font-mono">
              <Briefcase size={14} /> Professional Experience
            </h3>
            <div className="space-y-6">
              {data.experience.map((exp, idx) => (
                <div key={idx} className="space-y-2 relative group pl-4 border-l border-border hover:border-accent-finance/30 transition-colors">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <strong className="text-xs text-text-primary font-sans">{exp.position}</strong>
                      <span className="text-text-muted text-xs font-sans"> @ {exp.company}</span>
                    </div>
                    <span className="text-[10px] text-text-muted bg-bg-base border border-border rounded px-2.5 py-0.5 font-bold font-mono">
                      {exp.startDate} &mdash; {exp.endDate}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed font-sans whitespace-pre-wrap">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {data.projects.length > 0 && (
          <div className="space-y-4 border-t border-divider pt-6">
            <h3 className="text-xs font-bold text-accent-finance uppercase tracking-widest flex items-center gap-2 font-mono">
              <Code size={14} /> Selected Projects
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {data.projects.map((proj, idx) => (
                <div key={idx} className="bg-bg-base border border-border p-5 rounded-xl space-y-3 hover:border-accent-finance/20 transition-colors shadow-sm">
                  <div className="flex justify-between items-start">
                    <h4 className="text-xs font-bold text-text-primary uppercase tracking-wide">{proj.title}</h4>
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noreferrer" className="text-[10px] text-accent-finance hover:underline font-bold">
                        LINK //
                      </a>
                    )}
                  </div>
                  <p className="text-[11px] text-text-muted leading-relaxed font-sans">{proj.description}</p>
                  {proj.techStack && proj.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {proj.techStack.map((tech, i) => (
                        <span key={i} className="text-[9px] bg-accent-finance/10 text-accent-finance border border-accent-finance/20 rounded px-2 py-0.5 font-mono">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills & Education */}
        <div className="grid md:grid-cols-2 gap-8 border-t border-divider pt-6">
          {/* Skills */}
          {data.skills.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-accent-finance uppercase tracking-widest flex items-center gap-2 font-mono">
                <Code size={14} /> Skills Registry
              </h3>
              <div className="space-y-3">
                {/* Group skills by category */}
                {Array.from(new Set(data.skills.map((s) => s.category))).map((cat) => (
                  <div key={cat} className="space-y-1.5">
                    <span className="text-[9px] text-text-muted uppercase tracking-wider block font-bold font-mono">{cat}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {data.skills
                        .filter((s) => s.category === cat)
                        .map((sk, i) => (
                          <span key={i} className="text-[10px] bg-bg-base border border-border rounded-lg px-2.5 py-1 text-text-secondary font-mono">
                            {sk.name} <span className="text-accent-finance font-bold text-[9px]">&bull; {sk.level}%</span>
                          </span>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education & Certs */}
          <div className="space-y-6">
            {data.education.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-accent-finance uppercase tracking-widest flex items-center gap-2 font-mono">
                  <GraduationCap size={14} /> Education
                </h3>
                <div className="space-y-4">
                  {data.education.map((edu, idx) => (
                    <div key={idx} className="space-y-1 relative pl-4 border-l border-border">
                      <div className="flex justify-between items-start text-xs flex-wrap gap-1">
                        <strong className="text-text-primary font-sans">{edu.degree} in {edu.fieldOfStudy}</strong>
                        <span className="text-[9px] text-text-muted font-mono">{edu.startDate} - {edu.endDate}</span>
                      </div>
                      <p className="text-[11px] text-text-muted font-sans">{edu.institution}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.certificates.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-accent-finance uppercase tracking-widest flex items-center gap-2 font-mono">
                  <FileBadge size={14} /> Certifications
                </h3>
                <div className="space-y-3">
                  {data.certificates.map((cert, idx) => (
                    <div key={idx} className="space-y-0.5 pl-4 border-l border-border">
                      <div className="flex justify-between items-start text-xs flex-wrap gap-1">
                        <strong className="text-text-primary font-sans">{cert.name}</strong>
                        <span className="text-[9px] text-text-muted font-mono">{cert.date}</span>
                      </div>
                      <p className="text-[10px] text-text-muted font-sans">Issued by {cert.issuer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
