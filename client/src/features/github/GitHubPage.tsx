import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { GitBranch, Star, Users, Folder, Github, Activity } from "lucide-react";
import LoadingState from "@/components/LoadingState";
import EmptyState from "@/components/EmptyState";
import Button from "@/components/Button";
import Card from "@/components/Card";
import BloombergChart from "@/components/BloombergChart";

interface Repo {
  name: string;
  description: string;
  htmlUrl: string;
  stars: number;
  forks: number;
  language: string;
  updatedAt: string;
}

interface ActivityItem {
  type: string;
  repoName: string;
  message: string;
  createdAt: string;
}

interface GitHubData {
  username: string;
  profile: {
    name: string;
    avatarUrl: string;
    followers: number;
    publicRepos: number;
    htmlUrl: string;
  };
  repos: Repo[];
  languages: Record<string, number>;
  recentActivity: ActivityItem[];
}

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  HTML: "#e34c26",
  CSS: "#563d7c",
  CPlusPlus: "#f34b7d",
  "C++": "#f34b7d",
  C: "#555555",
};

function getLanguageColor(lang: string, index: number): string {
  if (LANGUAGE_COLORS[lang]) return LANGUAGE_COLORS[lang];
  return `hsl(${(index * 73) % 360}, 65%, 55%)`;
}

export default function GitHubPage() {
  const { data, isLoading, error } = useQuery<GitHubData>({
    queryKey: ["github-overview"],
    queryFn: async () => {
      const response = await api.get("/github/overview");
      return response.data.data;
    },
  });

  const { profile, repos, languages, recentActivity } = data || {
    profile: { name: "", avatarUrl: "", followers: 0, publicRepos: 0, htmlUrl: "" },
    repos: [],
    languages: {},
    recentActivity: [],
  };

  // Group commits by date for the last 7 days to render in BloombergChart
  const commitActivityData = useMemo(() => {
    if (!recentActivity || recentActivity.length === 0) return [];
    
    const counts: Record<string, number> = {};
    const days = 7;
    
    // Initialize last 7 days with 0 commits
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const label = date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
      counts[label] = 0;
    }
    
    // Count push activity matches
    recentActivity.forEach((act) => {
      const dateLabel = new Date(act.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" });
      if (counts[dateLabel] !== undefined) {
        counts[dateLabel]++;
      }
    });
    
    return Object.entries(counts).map(([label, value]) => ({
      label,
      value,
    }));
  }, [recentActivity]);

  const totalStars = repos.reduce((acc, r) => acc + r.stars, 0);
  const totalForks = repos.reduce((acc, r) => acc + r.forks, 0);

  // Compute Language Percentages
  const langEntries = Object.entries(languages);
  const totalLangCount = langEntries.reduce((acc, [_, count]) => acc + count, 0);
  const sortedLanguages = langEntries
    .map(([name, count]) => ({
      name,
      percentage: totalLangCount > 0 ? (count / totalLangCount) * 100 : 0,
    }))
    .sort((a, b) => b.percentage - a.percentage);

  if (isLoading) {
    return <LoadingState message="ESTABLISHING_GITHUB_HANDSHAKE..." />;
  }

  if (error || !data) {
    return (
      <EmptyState 
        title="Sync Fail" 
        message="GitHub sync telemetry offline. Verify client-server port endpoints." 
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-500 font-mono text-sm">
      <div className="border-b border-border pb-4 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-h2 font-bold text-text-primary font-display">GitHub Analytics</h1>
          <p className="text-xs text-text-muted mt-1">// Real-time repository metrics and system activity tracking</p>
        </div>
        <a href={profile.htmlUrl} target="_blank" rel="noreferrer">
          <Button
            variant="outline"
            size="sm"
            icon={<Github size={14} />}
            className="border-accent-analytics/20 text-accent-analytics hover:border-accent-analytics hover:bg-accent-analytics/10 font-mono"
          >
            Profile Link
          </Button>
        </a>
      </div>

      {/* Profile Header */}
      <section className="bg-bg-surface border border-border rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center shadow-lg">
        <img
          src={profile.avatarUrl}
          alt={profile.name}
          className="w-16 h-16 rounded-full border border-border object-cover"
        />
        <div className="space-y-1 text-center md:text-left flex-grow">
          <h2 className="text-base font-bold text-text-primary font-display">{profile.name}</h2>
          <p className="text-xs text-text-muted">@{data.username}</p>
        </div>

        {/* Mini stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full md:w-auto">
          <div className="bg-bg-base border border-border p-3.5 rounded-xl text-center min-w-[100px]">
            <Users size={14} className="mx-auto text-accent-analytics mb-1.5" />
            <span className="text-[9px] text-text-muted block font-mono">FOLLOWERS</span>
            <strong className="text-text-primary text-xs font-mono tabular-nums">{profile.followers}</strong>
          </div>
          <div className="bg-bg-base border border-border p-3.5 rounded-xl text-center min-w-[100px]">
            <Folder size={14} className="mx-auto text-accent-analytics mb-1.5" />
            <span className="text-[9px] text-text-muted block font-mono">REPOS</span>
            <strong className="text-text-primary text-xs font-mono tabular-nums">{profile.publicRepos}</strong>
          </div>
          <div className="bg-bg-base border border-border p-3.5 rounded-xl text-center min-w-[100px]">
            <Star size={14} className="mx-auto text-accent-analytics mb-1.5" />
            <span className="text-[9px] text-text-muted block font-mono">STARS</span>
            <strong className="text-text-primary text-xs font-mono tabular-nums">{totalStars}</strong>
          </div>
          <div className="bg-bg-base border border-border p-3.5 rounded-xl text-center min-w-[100px]">
            <GitBranch size={14} className="mx-auto text-accent-analytics mb-1.5" />
            <span className="text-[9px] text-text-muted block font-mono">FORKS</span>
            <strong className="text-text-primary text-xs font-mono tabular-nums">{totalForks}</strong>
          </div>
        </div>
      </section>

      {/* Double grid: Languages Breakdown & Commit Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Languages Breakdown */}
        {sortedLanguages.length > 0 && (
          <section className="bg-bg-surface border border-border rounded-2xl p-6 space-y-4 shadow-md flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold text-accent-analytics uppercase tracking-widest font-mono">// Language Density</h3>
              <p className="text-[10px] text-text-muted mt-1 uppercase">// Repository language proportions</p>
            </div>
            
            <div className="space-y-4">
              {/* Continuous bar */}
              <div className="h-2.5 w-full bg-border rounded-full overflow-hidden flex">
                {sortedLanguages.map((lang, idx) => (
                  <div
                    key={lang.name}
                    style={{
                      width: `${lang.percentage}%`,
                      backgroundColor: getLanguageColor(lang.name, idx),
                    }}
                    title={`${lang.name}: ${lang.percentage.toFixed(1)}%`}
                  />
                ))}
              </div>

              {/* Dots list */}
              <div className="flex flex-wrap gap-x-5 gap-y-2 pt-1">
                {sortedLanguages.map((lang, idx) => (
                  <div key={lang.name} className="flex items-center gap-1.5 text-xs">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: getLanguageColor(lang.name, idx) }}
                    />
                    <span className="text-text-secondary">{lang.name}</span>
                    <span className="text-text-muted font-bold font-mono tabular-nums">{lang.percentage.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Bloomberg Commit Activity Chart */}
        {recentActivity.length > 0 && (
          <BloombergChart
            data={commitActivityData}
            variant="ai"
            title="SYSTEM_COMMIT_ACTIVITY"
            subtitle="DAILY_PUSH_EVENTS_WEEKLY"
            height={180}
          />
        )}
      </div>

      {/* Double grid: Repos & Recent Commits */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Pinned Repos (col-span-2) */}
        <section className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-accent-analytics uppercase tracking-widest font-mono">// Active Repositories</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {repos.map((repo) => (
              <Card
                key={repo.name}
                variant="resource"
                title={repo.name}
                description={repo.description}
                category={repo.language}
                date={repo.updatedAt}
                meta={`${repo.stars} Stars / ${repo.forks} Forks`}
                linkUrl={repo.htmlUrl}
              />
            ))}
          </div>
        </section>

        {/* Commit Log Feed */}
        <section className="space-y-4">
          <h3 className="text-xs font-bold text-accent-analytics uppercase tracking-widest font-mono">// Commit Logs</h3>
          {recentActivity.length > 0 ? (
            <div className="bg-bg-surface border border-border rounded-2xl p-5 space-y-4 max-h-[500px] overflow-y-auto shadow-md">
              {recentActivity.map((act, idx) => (
                <div
                  key={idx}
                  className="border-b border-divider pb-3.5 last:border-b-0 last:pb-0 flex items-start gap-3 text-xs"
                >
                  <Activity size={14} className="text-accent-analytics shrink-0 mt-0.5" />
                  <div className="space-y-1 font-mono">
                    <span className="text-[9px] text-text-muted block uppercase font-bold">
                      {act.repoName.split("/")[1] || act.repoName}
                    </span>
                    <p className="text-text-primary leading-relaxed text-[11px] font-sans">{act.message}</p>
                    <span className="text-[9px] text-text-muted block font-mono">
                      {new Date(act.createdAt).toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No Commit Activity" message="Run repository synchronization logs from database config." />
          )}
        </section>
      </div>
    </div>
  );
}
