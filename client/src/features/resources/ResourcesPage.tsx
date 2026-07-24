import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Link } from "react-router-dom";
import { Search, Download, ChevronLeft, ChevronRight } from "lucide-react";
import LoadingState from "@/components/LoadingState";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { FormInput } from "@/components/FormElements";

interface ResourceDoc {
  _id: string;
  type: "note" | "pdf" | "template" | "cheatsheet" | "roadmap";
  title: string;
  slug: string;
  category: string;
  description: string;
  fileUrl: string;
  downloadCount: number;
  createdAt: string;
}

interface ResourcesResponse {
  data: ResourceDoc[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

const CATEGORIES = ["All", "Deep Learning", "Systems Engineering", "Backend"];

export default function ResourcesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery<ResourcesResponse>({
    queryKey: ["resources", selectedCategory, search, page],
    queryFn: async () => {
      const params: any = { page, limit: 8 };
      if (selectedCategory !== "All") {
        params.category = selectedCategory;
      }
      if (search.trim()) {
        params.search = search;
      }
      const response = await api.get("/resources", { params });
      return response.data;
    },
  });

  const downloadMutation = useMutation({
    mutationFn: async ({ id, fileUrl }: { id: string; fileUrl: string }) => {
      await api.post(`/resources/${id}/download`);
      return fileUrl;
    },
    onSuccess: (fileUrl) => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      window.open(fileUrl, "_blank");
    },
    onError: (_err, variables) => {
      // Fallback download if track fails
      window.open(variables.fileUrl, "_blank");
    },
  });

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setPage(1);
  };

  const resources = data?.data || [];
  const pagination = data?.pagination || { total: 0, page: 1, limit: 8, pages: 1 };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-500">
      <div className="border-b border-border pb-4">
        <h1 className="text-h2 font-bold text-text-primary font-display">Resource Depot</h1>
        <p className="text-xs text-text-muted mt-1 font-mono">// Downloadable roadmaps, reference cheat sheets, and architectural templates</p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "primary" : "outline"}
              size="sm"
              onClick={() => handleCategoryChange(cat)}
              className={selectedCategory === cat ? "bg-accent-analytics hover:bg-accent-analytics/90 text-bg-base border-accent-analytics/10" : ""}
            >
              {cat}
            </Button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search size={14} className="absolute left-3.5 top-3 text-text-muted" />
          <FormInput
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search resources..."
            className="pl-9"
          />
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <LoadingState message="RECONSTRUCTING_RESOURCES..." />
      ) : error ? (
        <ErrorState title="Telemetry Error" message="Resource catalog loading failed. Check server log files." />
      ) : resources.length === 0 ? (
        <EmptyState title="No Resources Archived" message="No matching resource guides found in database indices." />
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {resources.map((item) => (
            <Card
              key={item._id}
              variant="resource"
              title={item.title}
              description={item.description}
              category={`${item.type} // ${item.category}`}
              meta={`${item.downloadCount} DOWNLOADS`}
              actionButton={
                <div className="flex items-center gap-4">
                  <Link
                    to={`/resource/${item.slug}`}
                    className="text-[10px] uppercase font-bold tracking-widest font-mono text-text-secondary hover:text-accent-analytics transition-colors"
                  >
                    View Info
                  </Link>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => downloadMutation.mutate({ id: item._id, fileUrl: item.fileUrl })}
                    disabled={downloadMutation.isPending}
                    icon={<Download size={11} />}
                    className="bg-accent-analytics hover:bg-accent-analytics/90 border-accent-analytics/10"
                  >
                    Download
                  </Button>
                </div>
              }
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center gap-4 pt-8 border-t border-border text-xs">
          <Button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            variant="outline"
            size="sm"
            icon={<ChevronLeft size={13} />}
          >
            PREV
          </Button>
          <span className="text-text-muted font-mono uppercase tracking-wider text-[10px]">
            PAGE {page} OF {pagination.pages}
          </span>
          <Button
            onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
            disabled={page === pagination.pages}
            variant="outline"
            size="sm"
            icon={<ChevronRight size={13} />}
            iconPosition="right"
          >
            NEXT
          </Button>
        </div>
      )}
    </div>
  );
}
