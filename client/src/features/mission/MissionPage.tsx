import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Target, Flag, Shield, Award, Eye } from "lucide-react";

interface MissionData {
  careerMission: string;
  longTermGoals: string[];
  vision: string;
  values: string[];
  currentLearning: string[];
  futureRoadmap: string[];
}

export default function MissionPage() {
  const { data, isLoading, error } = useQuery<MissionData>({
    queryKey: ["mission"],
    queryFn: async () => {
      const response = await api.get("/mission");
      return response.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20 font-mono text-xs text-cyan-400">
        // RETRIEVING_MISSION_DETAILS...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-20 font-mono text-sm text-red-400">
        Error: Failed to retrieve mission statement.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 font-mono">
      {/* Career Mission Header */}
      <section className="bg-[#0E0E13]/50 border border-white/5 p-8 rounded-xl space-y-4">
        <h1 className="text-sm font-bold text-cyan-400 tracking-wider flex items-center gap-2">
          <Target size={16} /> // CAREER_MISSION
        </h1>
        <p className="text-lg md:text-xl font-medium text-[#F7F5F0] leading-relaxed">
          &ldquo;{data.careerMission}&rdquo;
        </p>
      </section>

      {/* Grid: Vision & Long-Term Goals */}
      <div className="grid md:grid-cols-2 gap-8">
        <section className="bg-[#0E0E13]/30 border border-white/5 p-6 rounded-xl space-y-4">
          <h2 className="text-sm font-bold text-cyan-400 tracking-wider flex items-center gap-2">
            <Eye size={16} /> // FUTURE_VISION
          </h2>
          <p className="text-xs text-gray-400 leading-relaxed">{data.vision}</p>
        </section>

        <section className="bg-[#0E0E13]/30 border border-white/5 p-6 rounded-xl space-y-4">
          <h2 className="text-sm font-bold text-cyan-400 tracking-wider flex items-center gap-2">
            <Flag size={16} /> // LONG_TERM_GOALS
          </h2>
          <ul className="space-y-2 text-xs text-gray-400 list-disc list-inside">
            {data.longTermGoals.map((goal, idx) => (
              <li key={idx} className="leading-relaxed">{goal}</li>
            ))}
          </ul>
        </section>
      </div>

      {/* Grid: Core Values & Learning */}
      <div className="grid md:grid-cols-2 gap-8">
        <section className="bg-[#0E0E13]/30 border border-white/5 p-6 rounded-xl space-y-4">
          <h2 className="text-sm font-bold text-cyan-400 tracking-wider flex items-center gap-2">
            <Shield size={16} /> // CORE_VALUES
          </h2>
          <ul className="space-y-2 text-xs text-gray-400 list-none">
            {data.values.map((val, idx) => (
              <li key={idx} className="border-l border-cyan-400/40 pl-3 py-0.5 leading-relaxed">
                {val}
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-[#0E0E13]/30 border border-white/5 p-6 rounded-xl space-y-4">
          <h2 className="text-sm font-bold text-cyan-400 tracking-wider flex items-center gap-2">
            <Award size={16} /> // CURRENT_ACQUISITION
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.currentLearning.map((item, idx) => (
              <span
                key={idx}
                className="bg-yellow-950/40 border border-yellow-500/20 text-yellow-400 text-[10px] px-2.5 py-1 rounded"
              >
                {item}
              </span>
            ))}
          </div>
        </section>
      </div>

      {/* Future Roadmap Section */}
      <section className="bg-[#0E0E13]/30 border border-white/5 p-8 rounded-xl space-y-6">
        <h2 className="text-sm font-bold text-cyan-400 tracking-wider">// ROADMAP_CHRONOLOGY</h2>
        <div className="space-y-4">
          {data.futureRoadmap.map((item, idx) => {
            const [period, ...details] = item.split(":");
            return (
              <div key={idx} className="flex gap-4 text-xs">
                <span className="font-bold text-cyan-400 text-sm tracking-wider shrink-0 w-20">{period}</span>
                <span className="text-gray-400 leading-relaxed">{details.join(":") || period}</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
