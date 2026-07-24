import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, Download, ArrowRight, BookOpen } from "lucide-react";

interface CardProps {
  variant: "project" | "blog" | "research" | "resource" | "service" | "log";
  title?: string;
  subtitle?: string;
  description?: string;
  category?: string;
  date?: string;
  meta?: string | number; // e.g. reading time or file size
  tags?: string[];
  slug?: string;
  linkUrl?: string;
  price?: number;
  actionButton?: ReactNode;
  actionLabel?: string;
}

export default function Card({
  variant,
  title = "",
  subtitle,
  description,
  category,
  date,
  meta,
  tags,
  slug,
  linkUrl,
  price,
  actionButton,
  actionLabel,
}: CardProps) {
  // Early return for log row variant
  if (variant === "log") {
    return (
      <div className="border-b border-divider pb-3.5 last:border-b-0 last:pb-0 flex items-start justify-between gap-3 text-xs">
        <div className="space-y-1.5">
          <span className="text-[10px] text-accent-analytics font-bold uppercase tracking-wider font-mono">
            {category}
          </span>
          <p className="text-text-secondary leading-relaxed text-[11px] font-sans">{description}</p>
        </div>
        <span className="text-[9px] font-mono text-text-muted shrink-0 mt-0.5">
          {date && new Date(date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
        </span>
      </div>
    );
  }

  // Domain accent color resolver
  const accentConfig = {
    project: {
      accent: "text-accent-ai",
      border: "hover:border-accent-ai/25",
      badge: "bg-accent-ai/10 text-accent-ai border-accent-ai/15",
      btn: "text-accent-ai",
    },
    research: {
      accent: "text-accent-ai",
      border: "hover:border-accent-ai/25",
      badge: "bg-accent-ai/10 text-accent-ai border-accent-ai/15",
      btn: "text-accent-ai",
    },
    resource: {
      accent: "text-accent-analytics",
      border: "hover:border-accent-analytics/25",
      badge: "bg-accent-analytics/10 text-accent-analytics border-accent-analytics/15",
      btn: "text-accent-analytics",
    },
    blog: {
      accent: "text-accent-finance",
      border: "hover:border-accent-finance/25",
      badge: "bg-accent-finance/10 text-accent-finance border-accent-finance/15",
      btn: "text-accent-finance",
    },
    service: {
      accent: "text-accent-finance",
      border: "hover:border-accent-finance/25",
      badge: "bg-accent-finance/10 text-accent-finance border-accent-finance/15",
      btn: "text-accent-finance",
    },
  };

  const current = accentConfig[variant as "project" | "blog" | "research" | "resource" | "service"];

  // Resolve target url path
  const targetUrl = linkUrl || (slug ? `/${variant}/${slug}` : "#");

  return (
    <div className={`flex flex-col justify-between bg-bg-surface border border-border rounded-xl p-6 transition-all duration-300 group shadow-none ${current.border}`}>
      <div className="space-y-4">
        {/* Top Header Row */}
        <div className="flex justify-between items-center text-[10px] font-mono text-text-muted">
          {category && (
            <span className={`px-2 py-0.5 rounded-md border uppercase tracking-wider ${current.badge}`}>
              {category}
            </span>
          )}
          {date && (
            <span className="flex items-center gap-1">
              <Calendar size={11} />
              {new Date(date).toLocaleDateString(undefined, { year: "numeric", month: "short" })}
            </span>
          )}
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-1">
          <h3 className="text-h4 font-bold text-text-primary group-hover:text-accent-ai transition-colors font-display leading-snug">
            {title}
          </h3>
          {subtitle && (
            <p className="text-[11px] font-mono text-text-muted">
              {subtitle}
            </p>
          )}
        </div>

        {/* Body Description */}
        {description && (
          <p className="text-xs text-text-secondary leading-relaxed min-h-[40px] font-sans">
            {description}
          </p>
        )}

        {/* Project specific Tech Stack list */}
        {variant === "project" && tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {tags.map((tag) => (
              <span key={tag} className="text-[9px] font-mono text-text-muted bg-bg-elevated border border-border px-2 py-0.5 rounded">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Service specific Price Grid */}
        {variant === "service" && price !== undefined && (
          <div className="pt-2">
            <span className="text-h3 font-bold text-text-primary font-display">${price}</span>
            <span className="text-[10px] text-text-muted font-mono ml-1">/ SESSION</span>
          </div>
        )}
      </div>

      {/* Card Actions Footer */}
      <div className="border-t border-divider mt-6 pt-4 flex justify-between items-center text-xs">
        {/* Meta Info Row */}
        <div className="text-[10px] font-mono text-text-muted">
          {variant === "blog" && meta && (
            <span className="flex items-center gap-1">
              <Clock size={11} /> {meta} MIN READ
            </span>
          )}
          {variant === "research" && meta && (
            <span className="flex items-center gap-1">
              <BookOpen size={11} /> {meta} MIN READ
            </span>
          )}
          {variant === "resource" && meta && (
            <span className="flex items-center gap-1">
              <Download size={11} /> {meta}
            </span>
          )}
        </div>

        {/* Call to action links */}
        <div>
          {actionButton ? (
            actionButton
          ) : (
            <Link
              to={targetUrl}
              className={`text-label font-bold flex items-center gap-1 transition-colors ${current.btn} hover:text-text-primary`}
            >
              {actionLabel || (variant === "resource" ? "DOWNLOAD" : "EXPLORE")} <ArrowRight size={12} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
