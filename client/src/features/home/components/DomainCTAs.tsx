import { Link } from "react-router-dom";
import { GraduationCap, MessageSquare } from "lucide-react";

interface DomainCTAsProps {
  mentorshipCta?: string;
  contactCta?: string;
}

export default function DomainCTAs({ mentorshipCta, contactCta }: DomainCTAsProps) {
  return (
    <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
      
      {/* Left CTA: Financial Advisory / Mentorship */}
      <div className="bg-bg-surface border border-border hover:border-accent-finance/40 hover:-translate-y-0.5 rounded-2xl p-8 flex flex-col justify-between gap-6 shadow-none transition-all duration-150 ease-in-out">
        <div className="space-y-3">
          <h3 className="text-label text-accent-finance-dark font-bold flex items-center gap-2">
            <GraduationCap size={16} /> // MENTORSHIP_CHANNEL
          </h3>
          <p className="text-xs text-text-secondary leading-relaxed font-sans">{mentorshipCta}</p>
        </div>
        <Link
          to="/mentorship"
          className="inline-flex justify-center items-center bg-bg-surface hover:bg-bg-base text-text-primary border border-border text-xs font-semibold px-5 py-3 rounded-lg uppercase tracking-wider transition-all self-start cursor-pointer font-mono shadow-none"
        >
          Request Mentorship
        </Link>
      </div>

      {/* Right CTA: AI & Data Engineering Collab */}
      <div className="bg-bg-surface border border-border hover:border-accent-ai/40 hover:-translate-y-0.5 rounded-2xl p-8 flex flex-col justify-between gap-6 shadow-none transition-all duration-150 ease-in-out">
        <div className="space-y-3">
          <h3 className="text-label text-accent-ai font-bold flex items-center gap-2">
            <MessageSquare size={16} /> // COLLAB_GATEWAY
          </h3>
          <p className="text-xs text-text-secondary leading-relaxed font-sans">{contactCta}</p>
        </div>
        <Link
          to="/contact"
          className="inline-flex justify-center items-center bg-accent-ai hover:bg-accent-ai-hover hover:-translate-y-0.5 text-white text-xs font-bold px-5 py-3 rounded-lg uppercase tracking-wider transition-all self-start cursor-pointer font-mono shadow-none"
        >
          Start Project
        </Link>
      </div>
    </section>
  );
}
