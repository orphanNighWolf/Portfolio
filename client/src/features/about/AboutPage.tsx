import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { MapPin, Briefcase, GraduationCap, Compass, BookOpen } from "lucide-react";
import LoadingState from "@/components/LoadingState";
import EmptyState from "@/components/EmptyState";

interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  current: boolean;
}

interface Experience {
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
}

interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

interface AboutData {
  name: string;
  title: string;
  bio: string;
  avatarUrl?: string;
  location: string;
  education: Education[];
  experience: Experience[];
  interests: string[];
  techStack: string[];
  currentFocus: string;
  timeline: TimelineItem[];
  mentorshipCta: string;
  contactCta: string;
}

export default function AboutPage() {
  const { data, isLoading, error } = useQuery<AboutData>({
    queryKey: ["about"],
    queryFn: async () => {
      const response = await api.get("/about");
      return response.data.data;
    },
  });

  if (isLoading) {
    return <LoadingState message="RETRIEVING_ABOUT_PROFILE..." />;
  }

  if (error || !data) {
    return (
      <EmptyState 
        title="Data Error" 
        message="Failed to retrieve bio information. Check database seeding state." 
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-16 animate-in fade-in duration-500">
      
      {/* Intro Header */}
      <section className="flex flex-col md:flex-row items-center gap-8 bg-bg-surface border border-border p-8 rounded-2xl shadow-xl">
        {data.avatarUrl && (
          <img
            src={data.avatarUrl}
            alt={data.name}
            className="w-32 h-32 rounded-full border border-accent-ai/20 object-cover shadow-lg"
          />
        )}
        <div className="space-y-4 text-center md:text-left">
          <h1 className="text-h2 font-bold text-text-primary tracking-tight font-display">{data.name}</h1>
          <p className="text-accent-ai text-sm font-mono uppercase tracking-wider font-semibold">{data.title}</p>
          <p className="text-xs text-text-muted flex items-center justify-center md:justify-start gap-1.5 font-mono">
            <MapPin size={13} className="text-accent-ai" /> {data.location}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed max-w-xl font-sans">{data.bio}</p>
        </div>
      </section>

      {/* Grid: Focus and Stack */}
      <div className="grid md:grid-cols-2 gap-8">
        <section className="bg-bg-surface border border-border p-6 rounded-2xl space-y-4 shadow-md">
          <h2 className="text-xs font-bold text-accent-ai tracking-widest flex items-center gap-2 font-mono uppercase border-b border-divider pb-2">
            <Compass size={14} /> // Current Focus
          </h2>
          <p className="text-xs text-text-secondary leading-relaxed font-sans">{data.currentFocus}</p>
        </section>

        <section className="bg-bg-surface border border-border p-6 rounded-2xl space-y-4 shadow-md">
          <h2 className="text-xs font-bold text-accent-ai tracking-widest flex items-center gap-2 font-mono uppercase border-b border-divider pb-2">
            <BookOpen size={14} /> // Core Tech Stack
          </h2>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {data.techStack.map((tech) => (
              <span
                key={tech}
                className="bg-bg-elevated border border-border text-text-secondary font-mono text-[10px] px-2.5 py-1 rounded"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>
      </div>

      {/* Experience Section */}
      <section className="space-y-8">
        <h2 className="text-h3 font-bold text-text-primary flex items-center gap-2 font-display pb-2 border-b border-border">
          <Briefcase size={18} className="text-accent-ai" /> Professional History
        </h2>
        <div className="space-y-8">
          {data.experience.map((exp, idx) => (
            <div key={idx} className="relative pl-6 border-l border-border space-y-2">
              <div className="absolute w-2 h-2 bg-accent-ai rounded-full -left-[4.5px] top-2 shadow-[0_0_8px_rgba(91,140,255,0.8)]" />
              <div className="flex justify-between items-start text-xs flex-wrap gap-2">
                <div>
                  <h3 className="font-bold text-text-primary text-sm font-sans">{exp.position}</h3>
                  <p className="text-text-muted text-[11px] font-mono mt-0.5">{exp.company} &bull; {exp.location}</p>
                </div>
                <span className="text-accent-ai font-mono text-[10px]">
                  {exp.startDate} &mdash; {exp.current ? "PRESENT" : exp.endDate}
                </span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed font-sans">{exp.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Education Section */}
      <section className="space-y-8">
        <h2 className="text-h3 font-bold text-text-primary flex items-center gap-2 font-display pb-2 border-b border-border">
          <GraduationCap size={18} className="text-accent-ai" /> Academic Credentials
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.education.map((edu, idx) => (
            <div key={idx} className="border border-border bg-bg-surface p-5 rounded-xl flex flex-col justify-between text-xs shadow-md">
              <div className="space-y-1">
                <h3 className="font-bold text-text-primary text-sm">{edu.degree}</h3>
                <p className="text-accent-ai font-mono text-[10px] uppercase tracking-wider">{edu.fieldOfStudy}</p>
                <p className="text-text-muted text-[10px] mt-2 font-mono">{edu.institution}</p>
              </div>
              <div className="border-t border-divider mt-4 pt-3 flex justify-end">
                <span className="text-text-muted font-mono text-[9px]">
                  {edu.startDate} &mdash; {edu.current ? "PRESENT" : edu.endDate}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline Highlights */}
      <section className="space-y-8">
        <h2 className="text-h3 font-bold text-text-primary flex items-center gap-2 font-display pb-2 border-b border-border">
          Chronological Milestones
        </h2>
        <div className="space-y-6">
          {data.timeline.map((item, idx) => (
            <div key={idx} className="flex gap-6 text-xs bg-bg-surface/50 border border-border p-4 rounded-xl shadow-sm">
              <span className="font-bold text-accent-finance text-sm tracking-wider shrink-0 w-14 font-mono">{item.year}</span>
              <div className="space-y-1">
                <h4 className="font-bold text-text-primary font-sans">{item.title}</h4>
                <p className="text-text-secondary leading-relaxed text-[11px] font-sans">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interests Section */}
      <section className="bg-bg-surface border border-border p-6 rounded-xl space-y-4 shadow-md">
        <h2 className="text-xs font-bold text-accent-ai tracking-widest font-mono uppercase border-b border-divider pb-2">
          // Areas of Interest
        </h2>
        <div className="flex flex-wrap gap-2 text-xs text-text-secondary">
          {data.interests.map((interest, idx) => (
            <span key={idx} className="border border-border bg-bg-elevated px-3 py-1.5 rounded-full font-mono text-[10px]">
              {interest}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
