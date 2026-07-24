import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { ExternalLink, Calendar, Award, Trophy, Bookmark } from "lucide-react";

interface AchievementDoc {
  _id: string;
  type: "certificate" | "hackathon" | "competition" | "award" | "badge" | "conference";
  title: string;
  organization: string;
  date: string;
  description: string;
  imageUrl?: string;
  link?: string;
}

const TYPE_ICONS: Record<string, any> = {
  certificate: Bookmark,
  hackathon: Trophy,
  competition: Trophy,
  award: Award,
  badge: Award,
  conference: Calendar,
};

export default function AchievementsPage() {
  const { data: achievements, isLoading, error } = useQuery<AchievementDoc[]>({
    queryKey: ["achievements"],
    queryFn: async () => {
      const response = await api.get("/achievements");
      return response.data.data;
    },
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 font-mono text-sm">
      <div className="border-b border-white/5 pb-4">
        <h1 className="text-xl font-bold text-[#F7F5F0]">// CREDENTIALS_&_AWARDS</h1>
        <p className="text-xs text-gray-400 mt-1">Verified certifications, hackathon rankings, and departmental recognitions</p>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-xs text-cyan-400">// ANALYZING_RECOGNITIONS...</div>
      ) : error ? (
        <div className="text-center py-20 text-xs text-red-400">Error: Achievements loading failed.</div>
      ) : !achievements || achievements.length === 0 ? (
        <div className="text-center py-20 text-xs text-gray-500 border border-dashed border-white/5 rounded-xl">
          No awards cataloged in current records.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((item) => {
            const Icon = TYPE_ICONS[item.type] || Award;

            return (
              <div
                key={item._id}
                className="flex flex-col justify-between bg-[#0E0E13]/30 border border-white/5 rounded-xl overflow-hidden hover:border-cyan-400/25 transition-all group"
              >
                <div>
                  {/* Optional Image */}
                  {item.imageUrl && (
                    <div className="h-40 w-full overflow-hidden bg-[#07070A] border-b border-white/5 relative">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="p-5 space-y-3">
                    <div className="flex justify-between items-center text-[9px] text-gray-500 uppercase">
                      <span className="flex items-center gap-1">
                        <Icon size={12} className="text-cyan-400" />
                        {item.type}
                      </span>
                      <span>
                        {new Date(item.date).toLocaleDateString(undefined, { year: "numeric", month: "short" })}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-[#F7F5F0] group-hover:text-cyan-400 transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[10px] text-gray-400 font-bold">{item.organization}</p>
                    <p className="text-[11px] text-gray-400 leading-relaxed pt-1">{item.description}</p>
                  </div>
                </div>

                {item.link && (
                  <div className="p-5 pt-0">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-[10px] text-cyan-400 hover:text-cyan-300 font-bold hover:underline uppercase"
                    >
                      Verify Credentials <ExternalLink size={12} />
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
