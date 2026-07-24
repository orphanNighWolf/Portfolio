import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Lock } from "lucide-react";
import LoadingState from "./LoadingState";

interface SettingsData {
  enabledSections?: Record<string, boolean>;
}

interface SectionGuardProps {
  section: string;
  children: React.ReactNode;
}

export default function SectionGuard({ section, children }: SectionGuardProps) {
  const { data: serverSettings, isLoading } = useQuery<SettingsData>({
    queryKey: ["global-settings"],
    queryFn: async () => {
      const res = await api.get("/settings");
      return res.data.data;
    },
    // Keep cached settings so transitions feel instant
    staleTime: 60 * 1000,
  });

  if (isLoading) {
    return <LoadingState message="VERIFYING_SECURE_COORDINATES..." />;
  }

  const isEnabled = serverSettings?.enabledSections?.[section] ?? true;

  if (!isEnabled) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 rounded-3xl border border-error/20 bg-bg-surface/40 backdrop-blur-[14px] shadow-2xl flex flex-col items-center text-center space-y-6 select-none font-mono">
        {/* Glow Core */}
        <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-bg-elevated border border-error/30 text-error shadow-[0_0_15px_rgba(239,68,68,0.15)] animate-pulse">
          <Lock size={28} />
          <div className="absolute inset-0 bg-error/5 rounded-2xl blur-md" />
        </div>

        {/* Status code */}
        <div className="text-[10px] text-error font-bold uppercase tracking-[0.2em]">
          // administrative_lockout
        </div>

        {/* Main notice */}
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-text-primary tracking-wider uppercase font-display">
            Coordinate Deactivated
          </h2>
          <p className="text-xs text-text-secondary leading-relaxed max-w-sm">
            This module has been temporarily disabled by the administrator. Access permissions for this path are revoked.
          </p>
        </div>

        {/* Diagnostics block */}
        <div className="w-full bg-bg-base/80 border border-border/10 rounded-xl p-4 text-[10px] text-text-muted text-left space-y-1">
          <div>SYSTEM_DIAGNOSTICS:</div>
          <div>➜ target_path: /api/{section}</div>
          <div>➜ route_status: 403_TEMPORARILY_OFFLINE</div>
          <div className="flex items-center gap-1.5 pt-1.5 mt-1.5 border-t border-border/10">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-error opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-error"></span>
            </span>
            <span className="uppercase text-[9px] tracking-wider font-bold">Diag_Code: ERR_SEC_LOCKED</span>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
