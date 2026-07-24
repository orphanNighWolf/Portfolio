import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Github, Twitter, Linkedin, Youtube, Globe, ExternalLink, Users } from "lucide-react";
import LoadingState from "@/components/LoadingState";
import EmptyState from "@/components/EmptyState";

interface SocialPlatform {
  platform: string;
  url: string;
  handle: string;
  followerCount: number;
}

interface SocialsResponse {
  platforms: SocialPlatform[];
}

export default function SocialsPage() {
  const { data, isLoading, error } = useQuery<SocialsResponse>({
    queryKey: ["socials"],
    queryFn: async () => {
      const res = await api.get("/socials");
      return res.data.data;
    },
  });

  const getPlatformIcon = (name: string) => {
    const iconSize = 18;
    switch (name.toLowerCase()) {
      case "github":
        return <Github size={iconSize} className="text-accent-ai" />;
      case "twitter":
      case "x":
        return <Twitter size={iconSize} className="text-accent-analytics" />;
      case "linkedin":
        return <Linkedin size={iconSize} className="text-accent-ai" />;
      case "youtube":
        return <Youtube size={iconSize} className="text-accent-finance" />;
      default:
        return <Globe size={iconSize} className="text-text-muted" />;
    }
  };

  const getPlatformAccentClass = (name: string) => {
    switch (name.toLowerCase()) {
      case "github":
      case "linkedin":
        return "hover:border-accent-ai/25 group-hover:text-accent-ai";
      case "twitter":
      case "x":
        return "hover:border-accent-analytics/25 group-hover:text-accent-analytics";
      case "youtube":
        return "hover:border-accent-finance/25 group-hover:text-accent-finance";
      default:
        return "hover:border-border";
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num;
  };

  if (isLoading) {
    return <LoadingState message="RESOLVING_COMMUNITY_CHANNELS..." />;
  }

  if (error || !data) {
    return <EmptyState title="Sync Error" message="Failed to synchronize platform feeds. Check settings." />;
  }

  const platforms = data?.platforms || [];

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500 font-mono">
      <div className="border-b border-border pb-4">
        <h1 className="text-h2 font-bold text-text-primary font-display">Connected Socials</h1>
        <p className="text-xs text-text-muted mt-1">// Sync community communication feeds and verify digital handles</p>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
        {platforms.map((plat, idx) => {
          const accentStyle = getPlatformAccentClass(plat.platform);
          return (
            <a
              key={idx}
              href={plat.url}
              target="_blank"
              rel="noreferrer"
              className={`bg-bg-surface border border-border ${accentStyle} p-6 rounded-2xl block space-y-4 shadow-md transition-all duration-300 group`}
            >
              <div className="flex justify-between items-center">
                <div className="p-2.5 bg-bg-base border border-border rounded-xl">
                  {getPlatformIcon(plat.platform)}
                </div>
                <ExternalLink size={13} className="text-text-muted group-hover:text-text-primary transition-colors" />
              </div>

              <div className="space-y-1">
                <span className="text-[9px] text-text-muted uppercase tracking-widest block font-bold">
                  {plat.platform}
                </span>
                <strong className="text-xs text-text-primary block group-hover:text-accent-ai transition-colors font-mono">
                  {plat.handle}
                </strong>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-text-secondary border-t border-divider pt-3.5">
                <Users size={12} className="text-text-muted" />
                <span>{formatNumber(plat.followerCount)} Telemetry Nodes</span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
