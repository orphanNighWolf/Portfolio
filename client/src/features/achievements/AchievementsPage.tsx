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
      <div className="border-b border-border pb-4">
        <h1 className="text-xl font-bold text-text-primary">// CREDENTIALS_&_AWARDS</h1>
        <p className="text-xs text-text-secondary mt-1">Verified certifications, hackathon rankings, and departmental recognitions</p>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-xs text-accent-analytics">// ANALYZING_RECOGNITIONS...</div>
      ) : error ? (
        <div className="text-center py-20 text-xs text-error">Error: Achievements loading failed.</div>
      ) : !achievements || achievements.length === 0 ? (
        <div className="text-center py-20 text-xs text-text-secondary border border-dashed border-border rounded-xl">
          No awards cataloged in current records.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((item) => {
            const Icon = TYPE_ICONS[item.type] || Award;

            return (
              <div
                key={item._id}
                className="flex flex-col justify-between bg-bg-surface border border-border rounded-xl overflow-hidden hover:border-accent-analytics/25 transition-all group shadow-none"
              >
                <div>
                  {/* Optional Image */}
                  {item.imageUrl && (
                    <div className="h-40 w-full overflow-hidden bg-bg-elevated border-b border-border relative">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="p-5 space-y-3">
                    <div className="flex justify-between items-center text-[9px] text-text-secondary uppercase">
                      <span className="flex items-center gap-1">
                        <Icon size={12} className="text-accent-analytics" />
                        {item.type}
                      </span>
                      <span>
                        {new Date(item.date).toLocaleDateString(undefined, { year: "numeric", month: "short" })}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-text-primary group-hover:text-accent-analytics transition-colors leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-[10px] text-text-secondary font-bold">{item.organization}</p>
                    <p className="text-[11px] text-text-secondary leading-relaxed pt-1">{item.description}</p>
                  </div>
                </div>

                {item.link && (
                  <div className="p-5 pt-0">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-[10px] text-accent-analytics hover:text-accent-analytics/80 font-bold hover:underline uppercase"
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
