import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Search } from "lucide-react";
import LoadingState from "@/components/LoadingState";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import { getSkillIcon, getCategoryTheme } from "@/lib/skillIcons";

interface Skill {
  _id: string;
  name: string;
  category: string;
  level: number;
  yearsExperience: number;
  icon?: string;
  description?: string;
  featured?: boolean;
}

function GlassSkillTile({ skill }: { skill: Skill }) {
  const theme = getCategoryTheme(skill.category);

  return (
    <div
      className="relative bg-bg-surface border border-border flex flex-col justify-between overflow-hidden group select-none text-text-primary h-[140px] w-full rounded-[20px] p-5 transition-colors duration-150 hover:border-accent-ai"
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.01] via-transparent to-white/[0.03] pointer-events-none" />

      {/* Top Details */}
      <div className="w-full flex justify-between items-center mb-2 pointer-events-none">
        <span className="text-[9px] font-mono font-bold tracking-wider text-text-muted uppercase">
          {skill.category}
        </span>
        <span className="bg-bg-elevated text-[9px] font-mono text-text-primary font-semibold border border-border/20 rounded-full h-5 min-w-[38px] flex items-center justify-center px-1.5">
          {skill.level}%
        </span>
      </div>

      {/* Center Icon */}
      <div className="flex-grow flex items-center justify-center">
        <div 
          className="w-16 h-16 flex items-center justify-center rounded-2xl bg-bg-elevated shadow-none border border-border/10 transition-colors duration-150"
          style={{ color: theme.accent }}
        >
          <div className="scale-[1.1]">
            {getSkillIcon(skill.name, skill.category)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SkillsPage() {
  const [search, setSearch] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);

  const { data, isLoading, error } = useQuery<Skill[]>({
    queryKey: ["skills", search],
    queryFn: async () => {
      const params: any = {};
      if (search.trim()) {
        params.search = search;
      }
      const response = await api.get("/skills", { params });
      return response.data.data;
    },
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsSearchActive(false);
      e.currentTarget.blur();
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-mono text-sm">
      {/* Filter and Search Bar Container */}
      <div className="w-full flex flex-col items-stretch gap-2.5">
        {/* Search Input - Full Width */}
        <div className="relative w-full flex items-center">
          <Search size={13} className="absolute left-3.5 text-text-secondary" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setIsSearchActive(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search capabilities..."
            className="w-full h-9 bg-bg-surface border border-border/20 rounded-xl pl-9 pr-14 text-xs text-text-primary focus:border-accent-ai focus:outline-none transition-colors duration-150"
          />
          {isSearchActive && (
            <button
              onClick={() => setIsSearchActive(false)}
              className="absolute right-3.5 text-[8px] text-text-muted hover:text-text-primary uppercase tracking-widest font-bold cursor-pointer transition-colors duration-150"
            >
              Close
            </button>
          )}
        </div>

        {/* Real-time Autocomplete Suggestions */}
        {search.trim() && data && data.length > 0 && (
          <div className="flex flex-wrap gap-1.5 items-center mt-0.5">
            <span className="text-[7px] uppercase tracking-widest text-text-muted mr-1 font-bold">// Quick Fill:</span>
            {data.slice(0, 4).map((skill) => (
              <button
                key={skill._id}
                onClick={() => {
                  setSearch(skill.name);
                  setIsSearchActive(false);
                }}
                className="h-6 flex items-center justify-center px-2.5 rounded-md text-[8px] uppercase tracking-wider cursor-pointer border border-border/20 bg-bg-surface/30 text-text-primary hover:border-accent-ai/50 transition-colors duration-150"
              >
                {skill.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Skills Grid Bento Panel */}
      {isLoading ? (
        <LoadingState message="COMPILE_SYSTEMS_INVENTORY..." />
      ) : error ? (
        <ErrorState title="Telemetry Error" message="Failed to load skills inventory system metrics." />
      ) : !data || data.length === 0 ? (
        <EmptyState title="No Capabilities Located" message="No matching capabilities were resolved inside system listings." />
      ) : (
        <div className="bg-bg-surface/10 p-8 md:p-12 rounded-[32px] border border-border/20 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.map((skill) => (
              <div key={skill._id}>
                <GlassSkillTile skill={skill} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
