import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import LoadingState from "@/components/LoadingState";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { FormInput } from "@/components/FormElements";

interface ResearchDoc {
  _id: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  readingTime: number;
  bookmarked: boolean;
  createdAt: string;
}

interface ResearchResponse {
  data: ResearchDoc[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

const CATEGORIES = ["All", "Deep Learning Research", "Distributed Systems", "Systems & Security"];

export default function ResearchPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery<ResearchResponse>({
    queryKey: ["research", selectedCategory, search, page],
    queryFn: async () => {
      const params: any = { page, limit: 6 };
      if (selectedCategory !== "All") {
        params.category = selectedCategory;
      }
      if (search.trim()) {
        params.search = search;
      }
      const response = await api.get("/research", { params });
      return response.data;
    },
  });

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setPage(1);
  };

  const researchItems = data?.data || [];
  const pagination = data?.pagination || { total: 0, page: 1, limit: 6, pages: 1 };

  return (
    <div className="max-w-5xl mx-auto space-y-12 page-transition font-mono text-sm">
      <div className="border-b border-border pb-4">
        <h1 className="text-h2 font-bold text-text-primary font-display">Research Papers</h1>
        <p className="text-xs text-text-muted mt-1">// Exploratory logs, mathematical proofs, and system designs compiled from research sprints</p>
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
            placeholder="Search papers..."
            className="pl-9"
          />
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <LoadingState message="COMPILING_THEORIES..." />
      ) : error ? (
        <ErrorState title="Theory Error" message="Research matrix loading failed. Verify server index states." />
      ) : researchItems.length === 0 ? (
        <EmptyState title="No Research Located" message="No matching research articles found in index vaults." />
      ) : (
        <div className="grid md:grid-cols-2 gap-6 stagger-container">
          {researchItems.map((paper) => (
            <div key={paper._id} className="stagger-item">
              <Card
                variant="research"
                title={paper.title}
                category={paper.category}
                date={paper.createdAt}
                meta={paper.readingTime}
                tags={paper.tags}
                slug={paper.slug}
              />
            </div>
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
          <span className="text-text-muted uppercase tracking-wider text-[10px]">
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
