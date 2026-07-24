import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Card from "@/components/Card";
import EmptyState from "@/components/EmptyState";

interface Blog {
  _id: string;
  title: string;
  category?: string;
  readingTime?: number;
  slug: string;
  createdAt: string;
}

interface GitHubActivity {
  repoName: string;
  message: string;
  createdAt: string;
}

interface BlogAndGitHubGridProps {
  latestBlog: Blog[];
  githubActivity: GitHubActivity[];
}

export default function BlogAndGitHubGrid({ latestBlog, githubActivity }: BlogAndGitHubGridProps) {
  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* Latest Blog Posts */}
      <section className="space-y-6">
        <div className="flex justify-between items-end border-b border-border pb-4">
          <div className="space-y-1">
            <h2 className="text-h3 font-bold text-text-primary tracking-tight">Latest Analysis Notes</h2>
            <span className="text-label text-text-muted font-mono block">// READING_KNOWLEDGE_INDEX</span>
          </div>
          <Link to="/blogs" className="text-label text-text-muted hover:text-accent-finance flex items-center gap-1.5 transition-colors">
            VIEW INDEX <ArrowRight size={12} />
          </Link>
        </div>
        
        {latestBlog && latestBlog.length > 0 ? (
          <div className="space-y-4">
            {latestBlog.slice(0, 2).map((blog: any) => (
              <Card
                key={blog._id}
                variant="blog"
                title={blog.title}
                category={blog.category || "FINANCE"}
                date={blog.createdAt}
                meta={blog.readingTime || 5}
                slug={blog.slug}
                actionLabel="READ POST"
              />
            ))}
          </div>
        ) : (
          <EmptyState title="No Articles Compiled" message="Check content settings or publish an article draft." />
        )}
      </section>

      {/* GitHub Contribution Logs */}
      <section className="space-y-6">
        <div className="flex justify-between items-end border-b border-border pb-4">
          <div className="space-y-1">
            <h2 className="text-h3 font-bold text-text-primary tracking-tight">Recent System Logs</h2>
            <span className="text-label text-text-muted font-mono block">// INTERCEPTING_GITHUB_SOCKETS</span>
          </div>
          <Link to="/github" className="text-label text-text-muted hover:text-accent-analytics flex items-center gap-1.5 transition-colors">
            SYNC METRICS <ArrowRight size={12} />
          </Link>
        </div>

        {githubActivity && githubActivity.length > 0 ? (
          <div className="bg-bg-surface border border-border rounded-xl p-6 space-y-4 shadow-none max-h-[310px] overflow-y-auto">
            {githubActivity.slice(0, 4).map((act: any, idx: number) => (
              <Card
                key={idx}
                variant="log"
                category={act.repoName.split("/")[1] || act.repoName}
                description={act.message}
                date={act.createdAt}
              />
            ))}
          </div>
        ) : (
          <EmptyState title="No Logs Syncing" message="Run the GitHub telemetry synchronization from dashboard settings." />
        )}
      </section>
    </div>
  );
}
