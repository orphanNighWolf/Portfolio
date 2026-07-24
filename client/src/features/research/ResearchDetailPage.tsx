import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import MDEditor from "@uiw/react-md-editor";
import { ArrowLeft, Clock, BookOpen, Tag } from "lucide-react";
import LoadingState from "@/components/LoadingState";
import EmptyState from "@/components/EmptyState";
import Button from "@/components/Button";

interface ResearchDoc {
  _id: string;
  title: string;
  category: string;
  tags: string[];
  readingTime: number;
  markdownContent: string;
  createdAt: string;
}

export default function ResearchDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: paper, isLoading, error } = useQuery<ResearchDoc>({
    queryKey: ["research-doc", slug],
    queryFn: async () => {
      const response = await api.get(`/research/${slug}`);
      return response.data.data;
    },
    enabled: !!slug,
  });

  if (isLoading) {
    return <LoadingState message="RETRIEVING_THEORY_MANIFEST..." />;
  }

  if (error || !paper) {
    return (
      <EmptyState 
        title="Document Restricted" 
        message="Requested research document is missing or classified. Verify credentials." 
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 font-mono text-sm">
      <div>
        <Link to="/research">
          <Button
            variant="ghost"
            size="sm"
            icon={<ArrowLeft size={14} />}
            className="text-text-muted hover:text-accent-ai"
          >
            Back to archives
          </Button>
        </Link>
      </div>

      {/* Main card */}
      <section className="bg-bg-surface border border-border p-8 rounded-2xl space-y-5 shadow-lg">
        <div className="flex justify-between items-center text-[10px] text-text-muted">
          <span className="uppercase bg-accent-ai/10 text-accent-ai border border-accent-ai/20 px-2.5 py-0.5 rounded font-bold font-mono">
            {paper.category}
          </span>
          <span className="flex items-center gap-1 font-mono">
            <Clock size={12} /> {paper.readingTime} MIN READ
          </span>
        </div>

        <h1 className="text-h2 font-bold text-text-primary tracking-tight font-display flex items-start gap-3">
          <BookOpen size={24} className="text-accent-ai shrink-0 mt-1" />
          {paper.title}
        </h1>

        <div className="flex flex-wrap gap-1.5 pt-2">
          {paper.tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 text-[10px] bg-bg-base border border-border text-text-muted px-2.5 py-1 rounded-xl font-mono"
            >
              <Tag size={10} className="text-accent-ai" /> {t}
            </span>
          ))}
        </div>
      </section>

      {/* Markdown Body */}
      <section className="bg-bg-surface/30 border border-border p-6 md:p-8 rounded-2xl shadow-md" data-color-mode="dark">
        <div className="prose prose-invert max-w-none font-sans text-text-secondary leading-relaxed">
          <MDEditor.Markdown
            source={paper.markdownContent}
            style={{ 
              backgroundColor: "transparent", 
              fontSize: "14px", 
              color: "var(--text-secondary)", 
              fontFamily: "var(--font-body)", 
              lineHeight: "1.85" 
            }}
          />
        </div>
      </section>
    </div>
  );
}
