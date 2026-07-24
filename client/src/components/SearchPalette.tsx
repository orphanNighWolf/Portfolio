import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/axios";
import { Search, X, FolderGit2, BookOpen, Layers, Newspaper, Award } from "lucide-react";

interface SearchResultItem {
  _id: string;
  title?: string;
  name?: string;
  slug?: string;
  category?: string;
  description?: string;
  shortDescription?: string;
}

interface GroupedResults {
  projects: SearchResultItem[];
  blogs: SearchResultItem[];
  research: SearchResultItem[];
  resources: SearchResultItem[];
  skills: SearchResultItem[];
}

export default function SearchPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GroupedResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  // Toggle palette on Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Autofocus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setResults(null);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Debounced search query dispatcher
  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      try {
        setIsLoading(true);
        const res = await api.get("/search", { params: { q: query } });
        setResults(res.data.data);
        setSelectedIndex(0);
      } catch (err) {
        console.error("Search query failed:", err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Flatten results for keyboard navigation indices
  const getFlatList = (): { item: SearchResultItem; type: string; url: string }[] => {
    if (!results) return [];
    const list: { item: SearchResultItem; type: string; url: string }[] = [];

    results.projects.forEach((x) => list.push({ item: x, type: "Project", url: `/project/${x.slug}` }));
    results.research.forEach((x) => list.push({ item: x, type: "Research", url: `/research/${x.slug}` }));
    results.blogs.forEach((x) => list.push({ item: x, type: "Blog", url: `/blog/${x.slug}` }));
    results.resources.forEach((x) => list.push({ item: x, type: "Resource", url: `/resource/${x.slug}` }));
    results.skills.forEach((x) => list.push({ item: x, type: "Skill", url: `/skills?search=${x.name}` }));

    return list;
  };

  const flatList = getFlatList();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || flatList.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % flatList.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + flatList.length) % flatList.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = flatList[selectedIndex];
      if (target) {
        handleNavigate(target.url);
      }
    }
  };

  const handleNavigate = (url: string) => {
    setIsOpen(false);
    navigate(url);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-between bg-[#0E0E13]/60 hover:bg-[#0E0E13]/90 border border-white/5 hover:border-cyan-400/25 px-3 py-1.5 rounded-lg text-xs text-gray-500 hover:text-gray-300 w-44 font-mono transition-colors cursor-pointer select-none"
      >
        <span className="flex items-center gap-1.5"><Search size={12} /> Search...</span>
        <kbd className="text-[10px] bg-white/5 border border-white/10 rounded px-1 font-bold">⌘K</kbd>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-[15vh]">
      <div className="absolute inset-0" onClick={() => setIsOpen(false)} />
      
      {/* Modal Dialog */}
      <div
        className="bg-[#0E0E13]/95 border border-white/10 rounded-xl w-full max-w-lg shadow-2xl relative z-10 overflow-hidden font-mono flex flex-col max-h-[60vh]"
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center border-b border-white/5 px-4 py-3 gap-3 shrink-0">
          <Search size={16} className="text-gray-500" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type query to scan index..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-[#F7F5F0] focus:outline-none placeholder-gray-600"
          />
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-cyan-400 cursor-pointer transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Results Body */}
        <div className="overflow-y-auto p-2 divide-y divide-white/5">
          {isLoading && (
            <div className="text-center py-8 text-xs text-cyan-400 font-bold animate-pulse">
              // SCANNING_INDEXES...
            </div>
          )}

          {!isLoading && query.trim() && flatList.length === 0 && (
            <div className="text-center py-8 text-xs text-gray-500 italic">
              No matching records found.
            </div>
          )}

          {!isLoading && !query.trim() && (
            <div className="p-4 text-center text-xs text-gray-500">
              Type a term (e.g. "rust", "wasm") to find matched modules.
            </div>
          )}

          {!isLoading && results && flatList.length > 0 && (
            <div className="space-y-4 pt-2">
              {/* Group Rendering */}
              {Object.entries({
                Projects: { data: results.projects, icon: <FolderGit2 size={12} />, getUrl: (x: any) => `/project/${x.slug}` },
                Research: { data: results.research, icon: <BookOpen size={12} />, getUrl: (x: any) => `/research/${x.slug}` },
                Blogs: { data: results.blogs, icon: <Newspaper size={12} />, getUrl: (x: any) => `/blog/${x.slug}` },
                Resources: { data: results.resources, icon: <Layers size={12} />, getUrl: (x: any) => `/resource/${x.slug}` },
                Skills: { data: results.skills, icon: <Award size={12} />, getUrl: (x: any) => `/skills?search=${x.name}` },
              }).map(([title, group]) => {
                if (group.data.length === 0) return null;
                return (
                  <div key={title} className="space-y-1.5">
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold px-2 flex items-center gap-1.5">
                      {group.icon} {title}
                    </div>
                    
                    <div className="space-y-0.5">
                      {group.data.map((item) => {
                        const targetUrl = group.getUrl(item);
                        const listIndex = flatList.findIndex((x) => x.url === targetUrl);
                        const isFocused = selectedIndex === listIndex;

                        return (
                          <div
                            key={item._id}
                            onClick={() => handleNavigate(targetUrl)}
                            onMouseEnter={() => setSelectedIndex(listIndex)}
                            className={`px-3 py-2 rounded-lg text-xs cursor-pointer flex flex-col gap-0.5 transition-colors ${
                              isFocused ? "bg-cyan-500 text-black" : "text-gray-300 hover:bg-white/5"
                            }`}
                          >
                            <div className="flex justify-between items-center font-bold">
                              <span>{item.title || item.name}</span>
                              {item.category && (
                                <span className={`text-[9px] uppercase px-1.5 rounded ${isFocused ? "bg-black/10 text-black" : "bg-white/5 text-gray-500"}`}>
                                  {item.category}
                                </span>
                              )}
                            </div>
                            <p className={`text-[10px] truncate leading-normal ${isFocused ? "text-black/75" : "text-gray-500"}`}>
                              {item.description || item.shortDescription || ""}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info */}
        {flatList.length > 0 && (
          <div className="border-t border-white/5 p-2 bg-white/2 flex justify-between text-[9px] text-gray-500 shrink-0">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
            <span>esc to close</span>
          </div>
        )}
      </div>
    </div>
  );
}
