import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = "DECRYPTING_SYSTEM_DATA..." }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] p-8 border border-border bg-bg-surface/30 rounded-2xl shadow-xl backdrop-blur-sm font-mono select-none">
      {/* Animated Glowing Ring Loader */}
      <div className="relative w-16 h-16 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-accent-ai/10 animate-pulse" />
        <div className="absolute inset-2 rounded-full border-t border-accent-ai animate-spin" />
        <Loader2 size={24} className="text-accent-ai animate-spin" />
        <div className="absolute inset-0 bg-accent-ai/5 rounded-full blur-xl opacity-30" />
      </div>
      
      <span className="text-[10px] text-accent-ai font-bold tracking-widest mt-6 uppercase animate-pulse">
        {message}
      </span>
      <span className="text-[8px] text-text-muted mt-2 uppercase tracking-widest">
        SYSTEM_DIAGNOSTICS // ACTIVE
      </span>
    </div>
  );
}
