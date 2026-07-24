import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import MDEditor from "@uiw/react-md-editor";
import { Trash2, Edit2, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";

interface BlogDoc {
  _id: string;
  title: string;
  category: string;
  tags: string[];
  readingTime: number;
  markdownContent: string;
  featured: boolean;
  relatedBlogSlugs: string[];
  status: "draft" | "published";
  createdAt: string;
}

export default function AdminBlogsPage() {
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Systems Engineering");
  const [tagsStr, setTagsStr] = useState("");
  const [readingTime, setReadingTime] = useState(5);
  const [markdownContent, setMarkdownContent] = useState("");
  const [featured, setFeatured] = useState(false);
  const [relatedBlogsStr, setRelatedBlogsStr] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");

  const { data: blogs, isLoading } = useQuery<BlogDoc[]>({
    queryKey: ["admin-blogs"],
    queryFn: async () => {
      const response = await api.get("/blogs", { params: { status: "all" } });
      return response.data.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: any) => api.post("/blogs", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      triggerSuccess("Blog post created successfully.");
      closeAndResetForm();
    },
    onError: (err: any) => setError(err.response?.data?.message || err.response?.data?.error || "Creation failed"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => api.put(`/blogs/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      triggerSuccess("Blog post updated successfully.");
      closeAndResetForm();
    },
    onError: (err: any) => setError(err.response?.data?.message || err.response?.data?.error || "Update failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/blogs/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      triggerSuccess("Blog post deleted successfully.");
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
    setCategory("Systems Engineering");
    setTagsStr("");
    setReadingTime(5);
    setMarkdownContent("");
    setFeatured(false);
    setRelatedBlogsStr("");
    setStatus("draft");
  };

  const handleEditInit = (blog: BlogDoc) => {
    setEditingId(blog._id);
    setTitle(blog.title);
    setCategory(blog.category);
    setTagsStr(blog.tags ? blog.tags.join(", ") : "");
    setReadingTime(blog.readingTime);
    setMarkdownContent(blog.markdownContent);
    setFeatured(blog.featured || false);
    setRelatedBlogsStr(blog.relatedBlogSlugs ? blog.relatedBlogSlugs.join(", ") : "");
    setStatus(blog.status);
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
      featured,
      relatedBlogSlugs: relatedBlogsStr.split(",").map((s) => s.trim()).filter(Boolean),
      status,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  if (isLoading) {
    return <div className="text-center py-20 text-xs text-cyan-400 font-mono">// ACCESSING_BULLETIN_METADATA...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-mono text-sm">
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <h1 className="text-xl font-bold text-cyan-400">// BULLETIN_REGISTRY</h1>
          <p className="text-xs text-gray-400 mt-1">Configure and manage technical blog posts and documentation bulletins</p>
        </div>
        {!isFormOpen && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-1 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded px-4 py-2 text-xs uppercase tracking-wider cursor-pointer transition-colors"
          >
            + Add Post
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
              {editingId ? "Edit Post Details" : "Create Blog Post"}
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
                <label className="text-gray-400 uppercase">Post Title</label>
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
                  placeholder="Rust, Threads"
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

            <div className="space-y-1">
              <label className="text-gray-400 uppercase">Related Blog Slugs (comma separated)</label>
              <input
                type="text"
                value={relatedBlogsStr}
                onChange={(e) => setRelatedBlogsStr(e.target.value)}
                className="w-full bg-[#07070A] border border-white/10 rounded px-3 py-2 text-[#F7F5F0] focus:border-cyan-400 focus:outline-none"
                placeholder="why-we-swapped-pytorch-for-rust-kernels-in-tick-databases"
              />
            </div>

            <div className="space-y-1" data-color-mode="dark">
              <label className="text-gray-400 uppercase">Content (Markdown)</label>
              <MDEditor value={markdownContent} onChange={(val) => setMarkdownContent(val || "")} />
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured-blog"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded border-white/10 bg-[#07070A] text-cyan-500 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="featured-blog" className="text-gray-400 uppercase cursor-pointer select-none">
                  Featured Article
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
              Commit Post
            </button>
          </form>
        </div>
      ) : (
        <div className="border border-white/5 bg-[#0E0E13]/20 rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-white/5 text-gray-400 uppercase">
                <th className="p-3">Post Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {blogs?.map((blog) => (
                <tr key={blog._id} className="hover:bg-white/5 transition-colors">
                  <td className="p-3 font-bold text-[#F7F5F0]">
                    {blog.title}
                    {blog.featured && (
                      <span className="ml-1.5 text-[8px] bg-yellow-950/40 text-yellow-400 border border-yellow-500/25 px-1.5 py-0.5 rounded">
                        FEAT
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-cyan-400 uppercase">{blog.category}</td>
                  <td className="p-3">
                    <span
                      className={`text-[9px] border px-2 py-0.5 rounded uppercase ${
                        blog.status === "published"
                          ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/25"
                          : "bg-gray-950/40 text-gray-400 border-white/10"
                      }`}
                    >
                      {blog.status}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEditInit(blog)}
                        className="p-1.5 bg-[#07070A] hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 border border-white/10 rounded cursor-pointer transition-colors"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete blog post "${blog.title}"?`)) {
                            deleteMutation.mutate(blog._id);
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
