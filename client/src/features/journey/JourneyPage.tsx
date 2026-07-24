import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { GraduationCap, Briefcase, BookOpen, Terminal, Cpu, Award } from "lucide-react";

interface JourneyEntry {
  _id: string;
  type: "school" | "college" | "internship" | "project" | "learning" | "achievement" | "futureGoal";
  title: string;
  description: string;
  dateRange: string;
  icon: string;
}

const TYPE_CONFIGS: Record<string, { label: string; color: string; iconEl: any }> = {
  school: { label: "Graduate studies", color: "text-purple-400 border-purple-400 bg-purple-950/20", iconEl: BookOpen },
  college: { label: "University Studies", color: "text-blue-400 border-blue-400 bg-blue-950/20", iconEl: GraduationCap },
  internship: { label: "Professional Internship", color: "text-emerald-400 border-emerald-400 bg-emerald-950/20", iconEl: Briefcase },
  project: { label: "Project Launch", color: "text-cyan-400 border-cyan-400 bg-cyan-950/20", iconEl: Terminal },
  learning: { label: "Active Learning", color: "text-yellow-400 border-yellow-400 bg-yellow-950/20", iconEl: Cpu },
  achievement: { label: "Achievement", color: "text-orange-400 border-orange-400 bg-orange-950/20", iconEl: Award },
  futureGoal: { label: "Future Roadmap", color: "text-rose-400 border-rose-400 bg-rose-950/20", iconEl: Cpu },
};

export default function JourneyPage() {
  const { data: journeyItems, isLoading, error } = useQuery<JourneyEntry[]>({
    queryKey: ["journey"],
    queryFn: async () => {
      const response = await api.get("/journey");
      return response.data.data;
    },
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 font-mono text-sm">
      <div className="border-b border-white/5 pb-4">
        <h1 className="text-xl font-bold text-[#F7F5F0]">// CHRONOLOGICAL_MILESTONES</h1>
        <p className="text-xs text-gray-400 mt-1">Linear tracking of academics, professional assignments, and strategic research objectives</p>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-xs text-cyan-400">// ANALYZING_CHRONOLOGY...</div>
      ) : error ? (
        <div className="text-center py-20 text-xs text-red-400">Error: Chronology loading failed.</div>
      ) : !journeyItems || journeyItems.length === 0 ? (
        <div className="text-center py-20 text-xs text-gray-500 border border-dashed border-white/5 rounded-xl">
          No milestones registered in current record space.
        </div>
      ) : (
        /* Vertical Timeline */
        <div className="relative border-l border-white/10 pl-6 ml-4 md:ml-8 space-y-12">
          {journeyItems.map((entry) => {
            const config = TYPE_CONFIGS[entry.type] || { label: "Milestone", color: "text-gray-400 border-white/10 bg-white/5", iconEl: Cpu };
            const Icon = config.iconEl;

            return (
              <div key={entry._id} className="relative group">
                {/* Node circle */}
                <div
                  className={`absolute -left-[35px] top-1.5 w-6 h-6 rounded-full border flex items-center justify-center transition-all group-hover:scale-115 ${config.color}`}
                >
                  <Icon size={12} />
                </div>

                {/* Milestone Detail Card */}
                <div className="space-y-2 bg-[#0E0E13]/30 border border-white/5 hover:border-cyan-400/20 p-5 rounded-xl transition-all">
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <span className={`text-[8px] uppercase font-bold tracking-wider px-2 py-0.5 border rounded ${config.color}`}>
                      {config.label}
                    </span>
                    <span className="text-xs text-cyan-400 font-bold">{entry.dateRange}</span>
                  </div>

                  <h3 className="text-sm font-bold text-[#F7F5F0]">{entry.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{entry.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
