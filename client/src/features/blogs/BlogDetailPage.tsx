import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import MDEditor from "@uiw/react-md-editor";
import { ArrowLeft, Clock, Copy, Twitter, Linkedin, Check } from "lucide-react";
import LoadingState from "@/components/LoadingState";
import EmptyState from "@/components/EmptyState";
import Button from "@/components/Button";

interface BlogDoc {
  _id: string;
  title: string;
  category: string;
  tags: string[];
  readingTime: number;
  markdownContent: string;
  relatedBlogSlugs: string[];
  createdAt: string;
}

export default function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [copied, setCopied] = useState(false);

  const { data: blog, isLoading, error } = useQuery<BlogDoc>({
    queryKey: ["blog", slug],
    queryFn: async () => {
      const response = await api.get(`/blogs/${slug}`);
      return response.data.data;
    },
    enabled: !!slug,
  });

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return <LoadingState message="DECOMPRESSING_BULLETIN_PACKETS..." />;
  }

  if (error || !blog) {
    return (
      <EmptyState 
        title="Bulletin Missing" 
        message="Requested bulletin is either missing or the index query was denied." 
      />
    );
  }

  const shareUrl = window.location.href;
  const tweetText = `Check out Mercer's technical deep dive: "${blog.title}"`;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500 font-mono text-sm">
      <div>
        <Link to="/blogs">
          <Button
            variant="ghost"
            size="sm"
            icon={<ArrowLeft size={14} />}
            className="text-text-muted hover:text-accent-finance"
          >
            Back to index
          </Button>
        </Link>
      </div>

      {/* Blog Header */}
      <section className="bg-bg-surface border border-border p-8 rounded-2xl space-y-4 shadow-lg">
        <div className="flex justify-between items-center text-[10px] text-text-muted">
          <span className="uppercase bg-accent-finance/10 text-accent-finance border border-accent-finance/20 px-2.5 py-0.5 rounded font-mono font-bold">
            {blog.category}
          </span>
          <span className="flex items-center gap-1 font-mono">
            <Clock size={12} /> {blog.readingTime} MIN READ
          </span>
        </div>

        <h1 className="text-h2 font-bold text-text-primary tracking-tight font-display">{blog.title}</h1>
        
        <div className="flex justify-between items-center border-t border-divider pt-4 flex-wrap gap-4">
          <span className="text-[10px] text-text-muted font-mono">
            PUBLISHED // {new Date(blog.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long" })}
          </span>

          {/* Share buttons */}
          <div className="flex items-center gap-2">
            <Button
              onClick={handleCopyLink}
              variant="outline"
              size="sm"
              title="Copy link"
              className="p-2 border-border hover:border-accent-finance"
              icon={copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            />
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(tweetText)}`}
              target="_blank"
              rel="noreferrer"
              title="Share on Twitter/X"
            >
              <Button
                variant="outline"
                size="sm"
                className="p-2 border-border hover:border-accent-finance"
                icon={<Twitter size={14} />}
              />
            </a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noreferrer"
              title="Share on LinkedIn"
            >
              <Button
                variant="outline"
                size="sm"
                className="p-2 border-border hover:border-accent-finance"
                icon={<Linkedin size={14} />}
              />
            </a>
          </div>
        </div>
      </section>

      {/* Markdown Content */}
      <section className="bg-bg-surface/30 border border-border p-6 md:p-8 rounded-2xl shadow-md" data-color-mode="dark">
        <div className="prose prose-invert max-w-none font-sans text-text-secondary leading-relaxed">
          <MDEditor.Markdown
            source={blog.markdownContent}
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

      {/* Related Blogs Block */}
      {blog.relatedBlogSlugs && blog.relatedBlogSlugs.length > 0 && (
        <section className="bg-bg-surface border border-border p-6 rounded-2xl space-y-4 shadow-md">
          <h3 className="text-xs font-bold text-accent-finance uppercase tracking-widest font-mono">// Related Bulletins</h3>
          <div className="space-y-3 font-mono">
            {blog.relatedBlogSlugs.map((refSlug) => (
              <div key={refSlug}>
                <Link
                  to={`/blog/${refSlug}`}
                  className="text-xs text-text-secondary hover:text-accent-finance transition-colors flex items-center gap-1.5"
                >
                  <span className="text-accent-finance">&rarr;</span>
                  {refSlug.replace(/-/g, " ").toUpperCase()}
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
