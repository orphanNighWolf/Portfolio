import { AlertCircle } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title = "No Data Found",
  message = "No matching records were found in the current intelligence query context.",
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] p-8 border border-border border-dashed bg-bg-surface/10 rounded-2xl text-center max-w-lg mx-auto font-mono select-none">
      <div className="w-12 h-12 rounded-full bg-border/40 border border-border flex items-center justify-center mb-5 text-text-muted">
        <AlertCircle size={20} />
      </div>
      
      <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-2">
        // {title}
      </h3>
      
      <p className="text-[11px] text-text-secondary leading-relaxed max-w-sm mb-6 font-sans">
        {message}
      </p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="bg-bg-elevated hover:bg-border text-accent-ai border border-border text-[10px] uppercase font-bold tracking-widest px-4 py-2 rounded-lg cursor-pointer transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
