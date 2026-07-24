import { AlertTriangle, RotateCcw } from "lucide-react";
import Button from "./Button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  errorDetails?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = "System Failure",
  message = "A critical transaction exception occurred during database initialization.",
  errorDetails,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] p-8 border border-error/20 bg-error/5 rounded-2xl text-center max-w-lg mx-auto font-mono select-none animate-in fade-in zoom-in-95 duration-200">
      <div className="w-12 h-12 rounded-full bg-error/15 border border-error/25 flex items-center justify-center mb-5 text-error">
        <AlertTriangle size={20} className="animate-bounce" />
      </div>

      <h3 className="text-sm font-bold text-error uppercase tracking-wider mb-2">
        // CRITICAL_FAIL: {title}
      </h3>

      <p className="text-[11px] text-text-secondary leading-relaxed max-w-sm mb-4 font-sans">
        {message}
      </p>

      {errorDetails && (
        <div className="w-full bg-bg-base/70 border border-error/10 p-3.5 rounded-lg mb-6 text-[9px] text-left text-error/80 overflow-x-auto max-h-[120px] font-mono leading-relaxed whitespace-pre-wrap">
          {errorDetails}
        </div>
      )}

      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          icon={<RotateCcw size={12} />}
          onClick={onRetry}
          className="border-error/20 hover:border-error hover:bg-error/10 text-error hover:text-error"
        >
          RETRY QUERY
        </Button>
      )}
    </div>
  );
}
