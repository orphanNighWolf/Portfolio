import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import MDEditor from "@uiw/react-md-editor";
import { Trash2, Edit2, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";

interface ResearchDoc {
  _id: string;
  title: string;
  category: string;
  tags: string[];
  readingTime: number;
  markdownContent: string;
  bookmarked: boolean;
  status: "draft" | "published";
  createdAt: string;
}

export default function AdminResearchPage() {
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Deep Learning Research");
  const [tagsStr, setTagsStr] = useState("");
  const [readingTime, setReadingTime] = useState(5);
  const [markdownContent, setMarkdownContent] = useState("");
  const [bookmarked, setBookmarked] = useState(false);
  const [status, setStatus] = useState<"draft" | "published">("draft");

  const { data: researchItems, isLoading } = useQuery<ResearchDoc[]>({
    queryKey: ["admin-research"],
    queryFn: async () => {
      const response = await api.get("/research", { params: { status: "all" } });
      return response.data.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: any) => api.post("/research", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["research"] });
      queryClient.invalidateQueries({ queryKey: ["admin-research"] });
      triggerSuccess("Research paper created successfully.");
      closeAndResetForm();
    },
    onError: (err: any) => setError(err.response?.data?.message || err.response?.data?.error || "Creation failed"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => api.put(`/research/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["research"] });
      queryClient.invalidateQueries({ queryKey: ["admin-research"] });
      triggerSuccess("Research paper updated successfully.");
      closeAndResetForm();
    },
    onError: (err: any) => setError(err.response?.data?.message || err.response?.data?.error || "Update failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/research/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["research"] });
      queryClient.invalidateQueries({ queryKey: ["admin-research"] });
      triggerSuccess("Research paper deleted successfully.");
    },
    onError: (err: any) => setError(err.response?.data?.message || "Delete failed"),
  });

  const triggerSuccess = (msg: string) => {
    setSuccess(msg);
    setError(null);
    setTimeout(() => setSuccess(null), 3000);
  };

  const closeAndResetForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    setTitle("");
    setCategory("Deep Learning Research");
    setTagsStr("");
    setReadingTime(5);
    setMarkdownContent("");
    setBookmarked(false);
    setStatus("draft");
  };

  const handleEditInit = (doc: ResearchDoc) => {
    setEditingId(doc._id);
    setTitle(doc.title);
    setCategory(doc.category);
    setTagsStr(doc.tags ? doc.tags.join(", ") : "");
    setReadingTime(doc.readingTime);
    setMarkdownContent(doc.markdownContent);
    setBookmarked(doc.bookmarked || false);
    setStatus(doc.status);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload = {
      title,
      category,
      tags: tagsStr.split(",").map((s) => s.trim()).filter(Boolean),
      readingTime,
      markdownContent,
      bookmarked,
      status,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  if (isLoading) {
    return <div className="text-center py-20 text-xs text-cyan-400 font-mono">// COMPILING_RESEARCH_TREE...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-mono text-sm">
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <h1 className="text-xl font-bold text-cyan-400">// RESEARCH_REGISTRY</h1>
          <p className="text-xs text-gray-400 mt-1">Configure whitepapers and edit theoretical frameworks</p>
        </div>
        {!isFormOpen && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-1 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded px-4 py-2 text-xs uppercase tracking-wider cursor-pointer transition-colors"
          >
            + Add Paper
          </button>
        )}
      </div>

      {success && (
        <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs rounded p-3">
          <CheckCircle size={14} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 bg-red-950/40 border border-red-500/30 text-red-400 text-xs rounded p-3">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      {isFormOpen ? (
        <div className="bg-[#0E0E13]/30 border border-white/5 rounded-xl p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
              {editingId ? "Edit Research Details" : "Create Research Paper"}
            </h2>
            <button
              onClick={closeAndResetForm}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-cyan-400 transition-colors uppercase cursor-pointer"
            >
              <ArrowLeft size={14} /> Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-gray-400 uppercase">Paper Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#07070A] border border-white/10 rounded px-3 py-2 text-[#F7F5F0] focus:border-cyan-400 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-gray-400 uppercase">Category</label>
                <input
                  type="text"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#07070A] border border-white/10 rounded px-3 py-2 text-[#F7F5F0] focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-gray-400 uppercase">Tags (comma separated)</label>
                <input
                  type="text"
                  value={tagsStr}
                  onChange={(e) => setTagsStr(e.target.value)}
                  className="w-full bg-[#07070A] border border-white/10 rounded px-3 py-2 text-[#F7F5F0] focus:border-cyan-400 focus:outline-none"
                  placeholder="LLM, Attention"
                />
              </div>
              <div className="space-y-1">
                <label className="text-gray-400 uppercase">Reading Time (Minutes)</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={readingTime}
                  onChange={(e) => setReadingTime(Number(e.target.value))}
                  className="w-full bg-[#07070A] border border-white/10 rounded px-3 py-2 text-[#F7F5F0] focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1" data-color-mode="dark">
              <label className="text-gray-400 uppercase">Content (Markdown)</label>
              <MDEditor value={markdownContent} onChange={(val) => setMarkdownContent(val || "")} />
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="bookmarked-paper"
                  checked={bookmarked}
                  onChange={(e) => setBookmarked(e.target.checked)}
                  className="rounded border-white/10 bg-[#07070A] text-cyan-500 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="bookmarked-paper" className="text-gray-400 uppercase cursor-pointer select-none">
                  Bookmarked
                </label>
              </div>

              <div className="flex items-center gap-3 justify-end">
                <span className="text-gray-400 uppercase">Status:</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "draft" | "published")}
                  className="bg-[#07070A] border border-white/10 rounded px-3 py-1.5 text-[#F7F5F0] focus:border-cyan-400 focus:outline-none"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-800 text-black font-semibold rounded py-2.5 cursor-pointer transition-colors uppercase tracking-widest text-xs"
            >
              Commit Paper
            </button>
          </form>
        </div>
      ) : (
        <div className="border border-white/5 bg-[#0E0E13]/20 rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-white/5 text-gray-400 uppercase">
                <th className="p-3">Paper Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {researchItems?.map((doc) => (
                <tr key={doc._id} className="hover:bg-white/5 transition-colors">
                  <td className="p-3 font-bold text-[#F7F5F0]">{doc.title}</td>
                  <td className="p-3 text-cyan-400 uppercase">{doc.category}</td>
                  <td className="p-3">
                    <span
                      className={`text-[9px] border px-2 py-0.5 rounded uppercase ${
                        doc.status === "published"
                          ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/25"
                          : "bg-gray-950/40 text-gray-400 border-white/10"
                      }`}
                    >
                      {doc.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEditInit(doc)}
                        className="p-1.5 bg-[#07070A] hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 border border-white/10 rounded cursor-pointer transition-colors"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete research paper "${doc.title}"?`)) {
                            deleteMutation.mutate(doc._id);
                          }
                        }}
                        className="p-1.5 bg-[#07070A] hover:bg-red-500/20 text-gray-400 hover:text-red-400 border border-white/10 rounded cursor-pointer transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
