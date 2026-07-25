import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { api } from "@/lib/axios";
import { FolderGit2, Newspaper, Mail, Users, Eye, RefreshCw } from "lucide-react";
import Button from "@/components/Button";
import LoadingState from "@/components/LoadingState";

interface SummaryData {
  projectsCount: number;
  blogsCount: number;
  unreadMessages: number;
  pendingBookings: number;
  visitsThisWeek: number;
}

export default function AdminDashboard() {
  const user = useAuthStore((state) => state.user);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: summary, isLoading } = useQuery<SummaryData>({
    queryKey: ["admin-summary"],
    queryFn: async () => {
      const res = await api.get("/admin/summary");
      return res.data.data;
    },
    refetchInterval: 60000, // Re-poll every minute
  });

  const handleRefreshCache = async () => {
    try {
      setIsRefreshing(true);
      await api.post("/github/refresh");
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const cards = [
    {
      label: "Total Projects",
      value: summary?.projectsCount ?? "—",
      icon: <FolderGit2 size={16} />,
      color: "text-accent-ai",
      bg: "bg-accent-ai/5",
      border: "border-accent-ai/15 hover:border-accent-ai/30",
      domain: "AI // ENGINEERING",
    },
    {
      label: "Blog Bulletins",
      value: summary?.blogsCount ?? "—",
      icon: <Newspaper size={16} />,
      color: "text-accent-finance",
      bg: "bg-accent-finance/5",
      border: "border-accent-finance/15 hover:border-accent-finance/30",
      domain: "FINANCIAL MILONES",
    },
    {
      label: "Unread Messages",
      value: summary?.unreadMessages ?? "—",
      icon: <Mail size={16} />,
      color: "text-accent-ai",
      bg: "bg-accent-ai/5",
      border: "border-accent-ai/15 hover:border-accent-ai/30",
      domain: "SYSTEM COMM",
    },
    {
      label: "Pending Bookings",
      value: summary?.pendingBookings ?? "—",
      icon: <Users size={16} />,
      color: "text-accent-finance",
      bg: "bg-accent-finance/5",
      border: "border-accent-finance/15 hover:border-accent-finance/30",
      domain: "MENTORSHIP REVENUE",
    },
    {
      label: "Visits This Week",
      value: summary?.visitsThisWeek ?? "—",
      icon: <Eye size={16} />,
      color: "text-accent-analytics",
      bg: "bg-accent-analytics/5",
      border: "border-accent-analytics/15 hover:border-accent-analytics/30",
      domain: "ANALYTICS TRAFFIC",
    },
  ];

  return (
    <div className="space-y-8 font-mono text-sm animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-border pb-4 flex-wrap gap-4">
        <div>
          <h1 className="text-h2 font-bold text-text-primary font-display">// Command Center</h1>
          <p className="text-xs text-text-muted mt-1">
            Logged in as <span className="text-text-secondary">{user?.email}</span>{" "}
            <span className="text-accent-finance font-bold">({user?.role})</span>
          </p>
        </div>
        <Button
          onClick={handleRefreshCache}
          disabled={isRefreshing}
          variant="outline"
          size="sm"
          icon={<RefreshCw size={12} className={isRefreshing ? "animate-spin" : ""} />}
          className="border-accent-ai/25 text-accent-ai hover:border-accent-ai hover:bg-accent-ai/10"
        >
          {isRefreshing ? "SYNCING..." : "SYNC_GITHUB"}
        </Button>
      </div>

      {/* Summary Cards */}
      {isLoading ? (
        <LoadingState message="AGGREGATING_METRICS..." />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {cards.map((card) => (
            <div
              key={card.label}
              className={`${card.bg} border ${card.border} rounded-2xl p-5 space-y-4 hover:scale-[1.01] transition-all shadow-sm flex flex-col justify-between`}
            >
              <div className="flex justify-between items-center">
                <span className="text-[8px] text-text-muted font-bold tracking-widest">{card.domain}</span>
                <span className={card.color}>{card.icon}</span>
              </div>
              <div className="space-y-1">
                <strong className="text-3xl font-bold text-text-primary block font-mono tracking-tight tabular-nums">
                  {card.value}
                </strong>
                <p className="text-[10px] text-text-muted uppercase tracking-wider font-bold">
                  {card.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Info Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-bg-surface border border-border rounded-2xl p-6 space-y-3 shadow-md flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[8px] text-text-muted uppercase tracking-widest font-bold font-mono">Telemetry Identity</span>
            <p className="text-sm text-text-secondary font-bold font-sans mt-1">{user?.email}</p>
          </div>
          <div className="pt-2 border-t border-divider flex justify-between items-center text-[10px] text-text-muted">
            <span>ROLE LEVEL</span>
            <span className="text-accent-finance font-bold uppercase">{user?.role}</span>
          </div>
        </div>

        <div className="bg-bg-surface border border-border rounded-2xl p-6 space-y-3 shadow-md flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[8px] text-text-muted uppercase tracking-widest font-bold font-mono">System Integrity</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shadow-sm shadow-emerald-400/50" />
              <span className="text-sm text-emerald-400 font-bold tracking-tight">ALL SYSTEMS OPERATIONAL</span>
            </div>
          </div>
          <div className="pt-2 border-t border-divider flex justify-between items-center text-[10px] text-text-muted">
            <span>LAST SYNC TELEMETRY</span>
            <span className="font-mono tabular-nums">{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* Website Section Visibility Controls (ON / OFF) */}
      <SectionTogglePanel />
    </div>
  );
}

function SectionTogglePanel() {
  const queryClient = useQueryClient();
  const [updatingSection, setUpdatingSection] = useState<string | null>(null);

  const { data: serverSettings } = useQuery({
    queryKey: ["global-settings"],
    queryFn: async () => {
      const res = await api.get("/settings");
      return res.data.data;
    },
  });

  const enabledSections: Record<string, boolean> = serverSettings?.enabledSections || {
    about: true,
    skills: true,
    projects: true,
    blogs: true,
    journey: true,
    contact: true,
    mentorship: true,
    achievements: true,
    resources: true,
    resume: true,
    research: true,
  };

  const sectionsList = [
    { key: "about", label: "About Page / Section", path: "/about" },
    { key: "skills", label: "Skills Inventory", path: "/skills" },
    { key: "projects", label: "Projects Gallery", path: "/projects" },
    { key: "blogs", label: "Writing & Blogs", path: "/writing" },
    { key: "journey", label: "Career Journey", path: "/journey" },
    { key: "contact", label: "Contact Form", path: "/contact" },
    { key: "mentorship", label: "Mentorship", path: "/admin/mentorship" },
    { key: "achievements", label: "Achievements", path: "/admin/achievements" },
    { key: "resources", label: "Resources", path: "/admin/resources" },
    { key: "resume", label: "Resume", path: "/admin/resume" },
    { key: "research", label: "Research Notes", path: "/admin/research" },
  ];

  const toggleSection = async (sectionKey: string) => {
    setUpdatingSection(sectionKey);
    const updatedSections = {
      ...enabledSections,
      [sectionKey]: !enabledSections[sectionKey],
    };

    const newSettings = {
      ...serverSettings,
      enabledSections: updatedSections,
    };

    try {
      await api.put("/settings", newSettings);
      queryClient.invalidateQueries({ queryKey: ["global-settings"] });
    } catch (err) {
      console.error("Failed to toggle section:", err);
    } finally {
      setUpdatingSection(null);
    }
  };

  return (
    <div className="bg-bg-surface border border-border rounded-2xl p-6 space-y-6 shadow-md">
      <div className="flex justify-between items-center flex-wrap gap-2 border-b border-divider pb-4">
        <div>
          <h2 className="text-md font-bold text-text-primary uppercase tracking-wider font-display flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent-terracotta" />
            Website Section Controls (ON / OFF)
          </h2>
          <p className="text-xs text-text-muted mt-1">
            Turn sections ON or OFF. Disabled sections are hidden from navigation and locked from public view.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sectionsList.map((sec) => {
          const isON = enabledSections[sec.key] ?? true;
          const isPending = updatingSection === sec.key;

          return (
            <div
              key={sec.key}
              onClick={() => !isPending && toggleSection(sec.key)}
              className={`p-4 rounded-xl border transition-all duration-300 flex items-center justify-between cursor-pointer select-none ${
                isON
                  ? "bg-bg-surface border-accent-terracotta/40 hover:border-accent-terracotta shadow-sm"
                  : "bg-bg-elevated/40 border-border/50 opacity-60 hover:opacity-100"
              }`}
            >
              <div className="space-y-1 min-w-0 pr-2">
                <span className="text-xs font-bold text-text-primary block truncate">
                  {sec.label}
                </span>
                <span className="text-[9px] font-mono text-text-muted block">
                  //{sec.key}_module
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    isON
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-error/10 text-error border border-error/20"
                  }`}
                >
                  {isPending ? "SAVING..." : isON ? "ACTIVE (ON)" : "OFFLINE (OFF)"}
                </span>

                <div
                  className={`w-10 h-6 rounded-full relative transition-colors p-0.5 ${
                    isON ? "bg-accent-terracotta" : "bg-bg-elevated border border-border"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                      isON ? "translate-x-4" : "translate-x-0"
                    }`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

