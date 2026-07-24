import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Card from "@/components/Card";
import EmptyState from "@/components/EmptyState";

interface ResearchPaper {
  _id: string;
  title: string;
  category: string;
  readingTime: number;
  slug: string;
  createdAt: string;
}

interface ResearchHighlightsProps {
  research: ResearchPaper[];
}

export default function ResearchHighlights({ research }: ResearchHighlightsProps) {
  return (
    <section className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-end border-b border-border pb-4">
        <div className="space-y-1">
          <h2 className="text-h3 font-bold text-text-primary tracking-tight">Research & Publications</h2>
          <span className="text-label text-text-muted font-mono block">// QUERYING_ACADEMIC_COLLECTION</span>
        </div>
        <Link to="/research" className="text-label text-text-muted hover:text-accent-ai flex items-center gap-1.5 transition-colors duration-150">
          OPEN INDEX <ArrowRight size={12} />
        </Link>
      </div>

      {research && research.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {research.slice(0, 3).map((paper) => (
            <Card
              key={paper._id}
              variant="research"
              title={paper.title}
              category={paper.category}
              date={paper.createdAt}
              meta={paper.readingTime}
              slug={paper.slug}
              actionLabel="READ NOTE"
            />
          ))}
        </div>
      ) : (
        <EmptyState title="No Research Indexed" message="Seeding academic publications is managed by the administrator." />
      )}
    </section>
  );
}
