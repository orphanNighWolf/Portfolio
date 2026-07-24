import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Link } from "react-router-dom";
import { Search, ChevronLeft, ChevronRight, Menu } from "lucide-react";
import LoadingState from "@/components/LoadingState";
import EmptyState from "@/components/EmptyState";
import ErrorState from "@/components/ErrorState";

interface Project {
  _id: string;
  title: string;
  slug: string;
  category: string;
  tags: string[];
  shortDescription: string;
  techStack: string[];
  featured: boolean;
  gallery?: string[];
  createdAt: string;
}

interface ProjectsResponse {
  data: Project[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

const CATEGORIES = ["All", "Artificial Intelligence", "Quantitative Solutions", "System Architectures"];

export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTag, setSelectedTag] = useState("");
  const [page, setPage] = useState(1);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);



  const { data, isLoading, error } = useQuery<ProjectsResponse>({
    queryKey: ["projects", selectedCategory, selectedTag, search, page],
    queryFn: async () => {
      const limit = 6;
      const params: any = { page, limit };
      if (selectedCategory !== "All") params.category = selectedCategory;
      if (selectedTag) params.tag = selectedTag;
      if (search.trim()) params.search = search;
      
      const response = await api.get("/projects", { params });
      return response.data;
    },
  });

  const projects = data?.data || [];
  const pagination = data?.pagination || { total: 0, page: 1, limit: 6, pages: 1 };
  const tagsList = ["Vector Search", "LLM", "Trading", "Rust", "Distributed Systems", "Go", "Kubernetes", "TypeScript", "React"];

  useEffect(() => {
    setActiveProjectIndex(0);
  }, [projects.length, selectedCategory, selectedTag, search, page]);

  const handleCategoryChange = (cat: string) => {
    setSelectedCategory(cat);
    setPage(1);
  };

  const handleTagClick = (tag: string) => {
    setSelectedTag(tag === selectedTag ? "" : tag);
    setPage(1);
  };

  return (
    <div className="relative font-sans text-sm min-h-screen bg-[#F8FAFC] text-[#0F172A] pt-4">
      {/* Flat Grid View Fallback (Static List Mode) */}
      <div className="max-w-6xl mx-auto space-y-8 font-sans text-sm pt-8 text-[#0F172A]">
        <div className="flex justify-between items-center border-b border-[#E2E8F0] pb-4">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A] font-sans tracking-tight">Source Code Portals</h1>
            <p className="text-xs text-[#64748B] mt-1 font-mono tracking-wider uppercase font-medium">// Compiled list of research implementations, system architectures, and production packages</p>
          </div>
          
          {/* Menu */}
          <Link to="/">
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] uppercase font-bold tracking-wider transition-colors duration-150 cursor-pointer bg-white border border-[#E2E8F0] text-[#0F172A] hover:border-[#2563EB]/40 font-mono">
              <Menu size={12} /> MENU
            </button>
          </Link>
        </div>

        {/* Filters Bar */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`px-4 py-2 rounded-lg text-[10px] uppercase font-mono tracking-wider font-medium transition-colors duration-150 ${
                      isActive
                        ? "bg-[#2563EB] text-white"
                        : "bg-white border border-[#E2E8F0] text-[#64748B] hover:border-[#2563EB]/40"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-64">
              <Search size={14} className="absolute left-3 top-2.5 text-[#64748B]" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search projects..."
                className="w-full pl-8 pr-3 py-2 bg-white border border-[#E2E8F0] text-[#0F172A] rounded-lg text-xs placeholder-[#64748B]/60 focus:outline-none focus:border-[#2563EB] transition-colors duration-150 font-mono uppercase tracking-wider"
              />
            </div>
          </div>

          {/* Tag Filters */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#E2E8F0]">
            <span className="text-[10px] text-[#64748B] uppercase mr-2 font-mono tracking-wider font-medium">Filter Tag:</span>
            {tagsList.map((tag) => {
              const isActive = selectedTag === tag;
              return (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`px-2.5 py-0.5 rounded-lg text-[9px] cursor-pointer transition-colors duration-150 border font-mono uppercase tracking-wider ${
                    isActive
                      ? "bg-[#EFF6FF] text-[#2563EB] border-[#2563EB]/40 font-semibold"
                      : "bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#2563EB]/30"
                  }`}
                >
                  #{tag}
                </button>
              );
            })}
            {selectedTag && (
              <button
                onClick={() => setSelectedTag("")}
                className="text-[9px] text-[#2563EB] hover:underline ml-2 cursor-pointer font-mono uppercase tracking-wider font-semibold"
              >
                Clear filter
              </button>
            )}
          </div>
        </div>

        {/* Grid Layout list */}
        {isLoading ? (
          <LoadingState />
        ) : error ? (
          <ErrorState title="System Exception" message="Strategy loading failed. Verify client port endpoints." />
        ) : projects.length === 0 ? (
          <EmptyState title="No Projects Found" message="No projects matching parameters found in compilation history." />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Project Sector Table List */}
            <div className="lg:col-span-5 bg-white border border-[#E2E8F0] rounded-xl p-4 flex flex-col justify-between shadow-none">
              <div>
                <div className="grid grid-cols-3 text-[10px] font-mono text-[#64748B] uppercase border-b border-[#E2E8F0] pb-3 mb-2 px-3 tracking-wider font-bold">
                  <div>Project</div>
                  <div>Domain</div>
                  <div className="text-right">Key Focus</div>
                </div>
                
                <div className="space-y-1">
                  {projects.map((project, index) => {
                    const isActive = activeProjectIndex === index;
                    return (
                      <div
                        key={project._id}
                        onClick={() => setActiveProjectIndex(index)}
                        className={`grid grid-cols-3 items-center py-3.5 px-3 cursor-pointer transition-colors duration-150 border-l-[3px] select-none ${
                          isActive 
                            ? 'bg-[#EFF6FF] border-l-[#2563EB] rounded-r-lg border-y border-r border-[#E2E8F0]/50 shadow-none' 
                            : 'border-l-transparent hover:bg-[#F1F5F9]/60 rounded-lg'
                        }`}
                      >
                        <div className={`text-xs font-semibold font-sans ${isActive ? 'text-[#0F172A]' : 'text-[#64748B]'}`}>
                          {project.title}
                        </div>
                        <div className="text-[10px] font-mono text-[#64748B] truncate uppercase tracking-wider font-medium">
                          {project.category}
                        </div>
                        <div className="text-[10px] font-mono text-[#64748B] text-right truncate uppercase tracking-wider font-medium">
                          {project.tags && project.tags.length > 0 ? project.tags[0] : 'Engineering'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="border-t border-[#E2E8F0] pt-4 mt-4 px-3 flex justify-between items-center text-[10px] font-mono text-[#64748B] uppercase tracking-wider font-medium">
                <span>ACTIVE_RECORD // 0{activeProjectIndex + 1}_OF_0{projects.length}</span>
                <span className="text-[#2563EB]">SELECT_TO_SPECIFY</span>
              </div>
            </div>

            {/* Right Column: Dynamic details card preview */}
            {(() => {
              const activeProject = projects[activeProjectIndex] || projects[0];
              if (!activeProject) return null;

              const getProjectAccent = (category: string) => {
                const cat = category.toLowerCase();
                if (cat.includes("ai") || cat.includes("ml") || cat.includes("agent") || cat.includes("intelligence")) {
                  return { 
                    accent: "text-[#2563EB]", 
                    border: "border-[#2563EB]/25", 
                    bg: "bg-[#EFF6FF]",
                    svg: "text-[#2563EB]/40",
                    node: "#2563EB"
                  };
                }
                if (cat.includes("data") || cat.includes("analytics") || cat.includes("dashboard")) {
                  return { 
                    accent: "text-[#16A34A]", 
                    border: "border-[#16A34A]/25", 
                    bg: "bg-[#F0FDF4]",
                    svg: "text-[#16A34A]/40",
                    node: "#16A34A"
                  };
                }
                return { 
                  accent: "text-[#B45309]", 
                  border: "border-[#F59E0B]/25", 
                  bg: "bg-[#FFFBEB]",
                  svg: "text-[#F59E0B]/40",
                  node: "#2563EB"
                };
              };
              
              const activeProjectColors = getProjectAccent(activeProject.category);

              return (
                <div className="lg:col-span-7 bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-none flex flex-col justify-between min-h-[380px] relative overflow-hidden">
                  <div className="space-y-6 relative z-10">
                    <div className="flex justify-between items-center">
                      <span className={`text-[9px] font-mono font-bold tracking-wider px-2.5 py-0.5 rounded-lg uppercase border ${activeProjectColors.accent} ${activeProjectColors.border} ${activeProjectColors.bg}`}>
                        {activeProject.category}
                      </span>
                      <span className="text-[10px] font-mono text-[#64748B] uppercase tracking-wider font-medium">
                        {new Date(activeProject.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short" })}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-[#0F172A] font-sans tracking-tight leading-none">
                        {activeProject.title}
                      </h3>
                      <p className="text-xs text-[#64748B] leading-relaxed max-w-xl font-sans">
                        {activeProject.shortDescription}
                      </p>
                    </div>

                    {/* Decorative category-based SVG visualization */}
                    <div className="w-full h-32 bg-[#F1F5F9] border border-[#E2E8F0] rounded-lg flex items-center justify-center relative overflow-hidden p-4">
                      {activeProject.category.toLowerCase().includes("ai") || activeProject.category.toLowerCase().includes("machine") ? (
                        <svg viewBox="0 0 200 100" className={`w-full h-full ${activeProjectColors.svg}`}>
                          <circle cx="40" cy="50" r="4" fill={activeProjectColors.node} />
                          <circle cx="100" cy="30" r="4" fill={activeProjectColors.node} className="opacity-70" />
                          <circle cx="100" cy="70" r="4" fill={activeProjectColors.node} className="opacity-70" />
                          <circle cx="160" cy="50" r="4" fill={activeProjectColors.node} />
                          <line x1="40" y1="50" x2="100" y2="30" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                          <line x1="40" y1="50" x2="100" y2="70" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                          <line x1="100" y1="30" x2="160" y2="50" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                          <line x1="100" y1="70" x2="160" y2="50" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                        </svg>
                      ) : activeProject.category.toLowerCase().includes("data") || activeProject.category.toLowerCase().includes("analytics") ? (
                        <svg viewBox="0 0 200 100" className={`w-full h-full ${activeProjectColors.svg}`}>
                          <rect x="20" y="60" width="12" height="30" fill={activeProjectColors.node} className="opacity-40" rx="1" />
                          <rect x="50" y="40" width="12" height="50" fill={activeProjectColors.node} className="opacity-60" rx="1" />
                          <rect x="80" y="70" width="12" height="20" fill="var(--accent-analytics)" className="opacity-40" rx="1" />
                          <rect x="110" y="30" width="12" height="60" fill={activeProjectColors.node} className="opacity-80" rx="1" />
                          <rect x="140" y="50" width="12" height="40" fill={activeProjectColors.node} className="opacity-60" rx="1" />
                          <rect x="170" y="20" width="12" height="70" fill={activeProjectColors.node} rx="1" />
                          <line x1="10" y1="90" x2="190" y2="90" stroke="currentColor" strokeWidth="1" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 200 100" className={`w-full h-full ${activeProjectColors.svg}`}>
                          <path d="M 20,80 Q 70,60 120,40 T 180,20" fill="none" stroke={activeProject.category.toLowerCase().includes("finance") ? "#F59E0B" : "currentColor"} strokeWidth="2" strokeLinecap="round" />
                          <circle cx="180" cy="20" r="4" fill={activeProjectColors.node} />
                          <line x1="10" y1="90" x2="190" y2="90" stroke="currentColor" strokeWidth="1" />
                        </svg>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6 border-t border-[#E2E8F0] pt-4 relative z-10">
                    {activeProject.tags && activeProject.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {activeProject.tags.slice(0, 3).map((tag: string) => (
                          <span key={tag} className="text-[9px] font-mono text-[#64748B] bg-white px-2 py-0.5 rounded border border-[#E2E8F0] uppercase tracking-wider font-medium">
                            #{tag.toLowerCase()}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <Link
                      to={`/project/${activeProject.slug}`}
                      className="inline-flex items-center justify-center gap-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[10px] font-mono font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg shadow-none transition-colors duration-150 select-none whitespace-nowrap self-end sm:self-auto border-none"
                    >
                      COMPILE SPEC &rarr;
                    </Link>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* List Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center items-center gap-4 pt-8 border-t border-[#E2E8F0] text-xs font-mono">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="inline-flex items-center justify-center gap-1 bg-white border border-[#E2E8F0] text-[#0F172A] disabled:opacity-40 disabled:cursor-not-allowed text-[10px] font-mono font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-lg hover:border-[#2563EB]/40 transition-colors duration-150 cursor-pointer"
            >
              <ChevronLeft size={13} /> PREV
            </button>
            <span className="text-[#64748B] uppercase tracking-wider text-[10px] font-medium">
              PAGE {page} OF {pagination.pages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
              disabled={page === pagination.pages}
              className="inline-flex items-center justify-center gap-1 bg-white border border-[#E2E8F0] text-[#0F172A] disabled:opacity-40 disabled:cursor-not-allowed text-[10px] font-mono font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-lg hover:border-[#2563EB]/40 transition-colors duration-150 cursor-pointer"
            >
              NEXT <ChevronRight size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
