import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { BarChart3, Globe, FileText } from "lucide-react";
import BloombergChart from "@/components/BloombergChart";
import LoadingState from "@/components/LoadingState";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";

interface VisitPoint {
  date: string;
  views: number;
  uniques: number;
}

interface TopEntry {
  path?: string;
  referrer?: string;
  count: number;
}

interface AnalyticsData {
  visitsOverTime: VisitPoint[];
  topPages: TopEntry[];
  topReferrers: TopEntry[];
}

export default function AdminAnalyticsPage() {
  const { data, isLoading, error } = useQuery<AnalyticsData>({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const res = await api.get("/analytics/overview");
      return res.data.data;
    },
  });

  if (isLoading) {
    return <LoadingState message="COMPILING_TELEMETRY_DATA..." />;
  }

  if (error || !data) {
    return (
      <ErrorState
        title="Telemetry Failed"
        message="Analytics matrix loading failed. Verify MongoDB collection connectivity."
      />
    );
  }

  const visits = data?.visitsOverTime ?? [];
  const topPages = data?.topPages ?? [];
  const topReferrers = data?.topReferrers ?? [];

  const totalViews = visits.reduce((sum, v) => sum + v.views, 0);
  const totalUniques = visits.reduce((sum, v) => sum + v.uniques, 0);

  // Map database analytics arrays into BloombergChart data points
  const viewsChartData = visits.map((v) => ({
    label: new Date(v.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    value: v.views,
  }));

  const uniquesChartData = visits.map((v) => ({
    label: new Date(v.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    value: v.uniques,
  }));

  return (
    <div className="space-y-8 font-mono text-sm animate-in fade-in duration-500">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <h1 className="text-h2 font-bold text-text-primary flex items-center gap-2 font-display">
          <BarChart3 size={22} className="text-accent-analytics" /> Analytics Dashboard
        </h1>
        <p className="text-xs text-text-muted mt-1">// Rolling 30-day visitor telemetry and page interactions</p>
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-bg-surface border border-border rounded-xl p-4.5 shadow-sm">
          <p className="text-[9px] text-text-muted uppercase tracking-widest font-bold font-mono">Total Page Views</p>
          <strong className="text-2xl font-bold text-text-primary mt-1.5 block font-mono tracking-tight tabular-nums">
            {totalViews.toLocaleString()}
          </strong>
        </div>
        <div className="bg-bg-surface border border-border rounded-xl p-4.5 shadow-sm">
          <p className="text-[9px] text-text-muted uppercase tracking-widest font-bold font-mono">Unique Visitors</p>
          <strong className="text-2xl font-bold text-text-primary mt-1.5 block font-mono tracking-tight tabular-nums">
            {totalUniques.toLocaleString()}
          </strong>
        </div>
        <div className="bg-bg-surface border border-border rounded-xl p-4.5 shadow-sm">
          <p className="text-[9px] text-text-muted uppercase tracking-widest font-bold font-mono">Active Target Pages</p>
          <strong className="text-2xl font-bold text-text-primary mt-1.5 block font-mono tracking-tight tabular-nums">
            {topPages.length}
          </strong>
        </div>
        <div className="bg-bg-surface border border-border rounded-xl p-4.5 shadow-sm">
          <p className="text-[9px] text-text-muted uppercase tracking-widest font-bold font-mono">Referrer Vectors</p>
          <strong className="text-2xl font-bold text-text-primary mt-1.5 block font-mono tracking-tight tabular-nums">
            {topReferrers.filter((r) => r.referrer).length}
          </strong>
        </div>
      </div>

      {/* Charts using BloombergChart */}
      {visits.length === 0 ? (
        <EmptyState title="No Telemetry Data" message="No visitor interactions captured within the last 30 days." />
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <BloombergChart
              data={viewsChartData}
              variant="analytics"
              title="PAGE_VIEWS_SERIES"
              subtitle="DAILY_VIEWS_OVER_TIME"
              height={180}
            />
          </div>
          <div className="space-y-2">
            <BloombergChart
              data={uniquesChartData}
              variant="analytics"
              title="UNIQUE_VISITORS_SERIES"
              subtitle="DAILY_UNIQUES_OVER_TIME"
              height={180}
            />
          </div>
        </div>
      )}

      {/* Tables with high density layout */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-bg-surface border border-border rounded-xl p-5 space-y-4 shadow-md">
          <h3 className="text-xs font-bold text-accent-analytics uppercase tracking-widest flex items-center gap-2 font-mono">
            <FileText size={14} className="text-accent-analytics" /> Top Target Pages
          </h3>
          {topPages.length === 0 ? (
            <p className="text-xs text-text-muted italic">// No page hits indexed.</p>
          ) : (
            <div className="space-y-3.5">
              {topPages.map((page, i) => {
                const maxCount = topPages[0]?.count || 1;
                const barWidth = (page.count / maxCount) * 100;
                return (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-text-secondary truncate max-w-[240px] font-mono">{page.path || "/"}</span>
                      <span className="text-text-primary font-bold shrink-0 ml-2 font-mono tabular-nums">{page.count}</span>
                    </div>
                    <div className="w-full h-1 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent-analytics/45 rounded-full transition-all"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Referrers */}
        <div className="bg-bg-surface border border-border rounded-xl p-5 space-y-4 shadow-md">
          <h3 className="text-xs font-bold text-accent-analytics uppercase tracking-widest flex items-center gap-2 font-mono">
            <Globe size={14} className="text-accent-analytics" /> Traffic Referrers
          </h3>
          {topReferrers.length === 0 ? (
            <p className="text-xs text-text-muted italic">// No referrers indexed.</p>
          ) : (
            <div className="space-y-3.5">
              {topReferrers.map((ref, i) => {
                const maxCount = topReferrers[0]?.count || 1;
                const barWidth = (ref.count / maxCount) * 100;
                return (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-text-secondary truncate max-w-[240px] font-mono">
                        {ref.referrer || "(direct)"}
                      </span>
                      <span className="text-text-primary font-bold shrink-0 ml-2 font-mono tabular-nums">{ref.count}</span>
                    </div>
                    <div className="w-full h-1 bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent-analytics/30 rounded-full transition-all"
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

