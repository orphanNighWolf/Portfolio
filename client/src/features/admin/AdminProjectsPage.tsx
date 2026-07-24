import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import MDEditor from "@uiw/react-md-editor";
import { Plus, Trash2, Edit2, AlertCircle, CheckCircle, ArrowLeft, Image } from "lucide-react";

interface Project {
  _id: string;
  title: string;
  category: string;
  tags: string[];
  shortDescription: string;
  problemStatement: string;
  solution: string;
  challenges: string;
  futureImprovements: string;
  techStack: string[];
  githubUrl?: string;
  liveDemoUrl?: string;
  gallery: string[];
  videos: string[];
  architectureImages: string[];
  featured: boolean;
  status: "draft" | "published";
  createdAt: string;
}

export default function AdminProjectsPage() {
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Form toggles
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Artificial Intelligence");
  const [tagsStr, setTagsStr] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [problemStatement, setProblemStatement] = useState("");
  const [solution, setSolution] = useState("");
  const [challenges, setChallenges] = useState("");
  const [futureImprovements, setFutureImprovements] = useState("");
  const [techStackStr, setTechStackStr] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveDemoUrl, setLiveDemoUrl] = useState("");
  const [gallery, setGallery] = useState<string[]>([]);
  const [architectureImages, setArchitectureImages] = useState<string[]>([]);
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<"draft" | "published">("draft");

  // Fetch projects list (admins get all projects including drafts)
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["admin-projects"],
    queryFn: async () => {
      const response = await api.get("/projects", { params: { status: "all" } });
      return response.data.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: any) => api.post("/projects", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      triggerSuccess("Project created successfully.");
      closeAndResetForm();
    },
    onError: (err: any) => setError(err.response?.data?.message || err.response?.data?.error || "Creation failed"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => api.put(`/projects/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      triggerSuccess("Project updated successfully.");
      closeAndResetForm();
    },
    onError: (err: any) => setError(err.response?.data?.message || err.response?.data?.error || "Update failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/projects/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["admin-projects"] });
      triggerSuccess("Project deleted successfully.");
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
    setCategory("Artificial Intelligence");
    setTagsStr("");
    setShortDescription("");
    setProblemStatement("");
    setSolution("");
    setChallenges("");
    setFutureImprovements("");
    setTechStackStr("");
    setGithubUrl("");
    setLiveDemoUrl("");
    setGallery([]);
    setArchitectureImages([]);
    setFeatured(false);
    setStatus("draft");
  };

  const handleEditInit = (project: Project) => {
    setEditingId(project._id);
    setTitle(project.title);
    setCategory(project.category);
    setTagsStr(project.tags ? project.tags.join(", ") : "");
    setShortDescription(project.shortDescription);
    setProblemStatement(project.problemStatement);
    setSolution(project.solution);
    setChallenges(project.challenges);
    setFutureImprovements(project.futureImprovements);
    setTechStackStr(project.techStack ? project.techStack.join(", ") : "");
    setGithubUrl(project.githubUrl || "");
    setLiveDemoUrl(project.liveDemoUrl || "");
    setGallery(project.gallery || []);
    setArchitectureImages(project.architectureImages || []);
    setFeatured(project.featured || false);
    setStatus(project.status);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: "gallery" | "architectureImages") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post("/media/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const { url } = response.data;
      if (targetField === "gallery") {
        setGallery((prev) => [...prev, url]);
      } else {
        setArchitectureImages((prev) => [...prev, url]);
      }
      triggerSuccess("Media uploaded successfully.");
    } catch (err: any) {
      setError(err.response?.data?.message || "File upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload = {
      title,
      category,
      tags: tagsStr.split(",").map((s) => s.trim()).filter(Boolean),
      shortDescription,
      problemStatement,
      solution,
      challenges,
      futureImprovements,
      techStack: techStackStr.split(",").map((s) => s.trim()).filter(Boolean),
      githubUrl,
      liveDemoUrl,
      gallery,
      architectureImages,
      featured,
      status,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  if (isLoading) {
    return <div className="text-center py-20 text-xs text-cyan-400 font-mono">// RETRIEVING_INVENTORY...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-mono text-sm">
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <h1 className="text-xl font-bold text-cyan-400">// PROJECT_REGISTRY_MANAGER</h1>
          <p className="text-xs text-gray-400 mt-1">Configure core portfolios, compile roadmaps, and publish project instances</p>
        </div>
        {!isFormOpen && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-1 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded px-4 py-2 text-xs uppercase tracking-wider cursor-pointer transition-colors"
          >
            <Plus size={14} /> Add Project
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
        /* Form Panel */
        <div className="bg-[#0E0E13]/30 border border-white/5 rounded-xl p-6 space-y-6">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
              {editingId ? "Edit Project Details" : "Create New Project"}
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
                <label className="text-gray-400 uppercase">Project Title</label>
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
                  placeholder="e.g. Artificial Intelligence"
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
                  placeholder="LLM, Vector Search"
                />
              </div>
              <div className="space-y-1">
                <label className="text-gray-400 uppercase">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  required
                  value={techStackStr}
                  onChange={(e) => setTechStackStr(e.target.value)}
                  className="w-full bg-[#07070A] border border-white/10 rounded px-3 py-2 text-[#F7F5F0] focus:border-cyan-400 focus:outline-none"
                  placeholder="Python, PyTorch, Docker"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-gray-400 uppercase">GitHub Repository URL</label>
                <input
                  type="text"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full bg-[#07070A] border border-white/10 rounded px-3 py-2 text-[#F7F5F0] focus:border-cyan-400 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-gray-400 uppercase">Live Demo Link</label>
                <input
                  type="text"
                  value={liveDemoUrl}
                  onChange={(e) => setLiveDemoUrl(e.target.value)}
                  className="w-full bg-[#07070A] border border-white/10 rounded px-3 py-2 text-[#F7F5F0] focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-gray-400 uppercase">Short Description summary</label>
              <textarea
                required
                rows={2}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="w-full bg-[#07070A] border border-white/10 rounded px-3 py-2 text-[#F7F5F0] focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-400 uppercase">Problem Statement</label>
              <textarea
                required
                rows={3}
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                className="w-full bg-[#07070A] border border-white/10 rounded px-3 py-2 text-[#F7F5F0] focus:border-cyan-400 focus:outline-none"
              />
            </div>

            {/* Markdown Editors */}
            <div className="space-y-4 border-t border-white/5 pt-4" data-color-mode="dark">
              <div className="space-y-1">
                <label className="text-gray-400 uppercase">Solution (Markdown)</label>
                <MDEditor value={solution} onChange={(val) => setSolution(val || "")} />
              </div>
              <div className="space-y-1">
                <label className="text-gray-400 uppercase">Challenges & Resolutions (Markdown)</label>
                <MDEditor value={challenges} onChange={(val) => setChallenges(val || "")} />
              </div>
              <div className="space-y-1">
                <label className="text-gray-400 uppercase">Future Improvements (Markdown)</label>
                <MDEditor value={futureImprovements} onChange={(val) => setFutureImprovements(val || "")} />
              </div>
            </div>

            {/* Media Upload Fields */}
            <div className="border-t border-white/5 pt-4 space-y-4">
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1">
                <Image size={14} /> Media Assets (Cloudinary)
              </h3>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Gallery uploads */}
                <div className="space-y-2">
                  <span className="text-gray-400 uppercase block">Screenshot Gallery</span>
                  <input
                    type="file"
                    disabled={isUploading}
                    onChange={(e) => handleFileUpload(e, "gallery")}
                    className="block text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-cyan-950/40 file:text-cyan-400 hover:file:bg-cyan-900/40 file:cursor-pointer"
                  />
                  {gallery.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {gallery.map((url, idx) => (
                        <div key={idx} className="relative group w-16 h-16 border border-white/10 rounded overflow-hidden">
                          <img src={url} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setGallery((prev) => prev.filter((_, i) => i !== idx))}
                            className="absolute inset-0 bg-red-900/80 text-white text-[9px] uppercase hidden group-hover:flex items-center justify-center cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Architecture uploads */}
                <div className="space-y-2">
                  <span className="text-gray-400 uppercase block">System Architecture Diagrams</span>
                  <input
                    type="file"
                    disabled={isUploading}
                    onChange={(e) => handleFileUpload(e, "architectureImages")}
                    className="block text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-cyan-950/40 file:text-cyan-400 hover:file:bg-cyan-900/40 file:cursor-pointer"
                  />
                  {architectureImages.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {architectureImages.map((url, idx) => (
                        <div key={idx} className="relative group w-16 h-16 border border-white/10 rounded overflow-hidden">
                          <img src={url} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setArchitectureImages((prev) => prev.filter((_, i) => i !== idx))}
                            className="absolute inset-0 bg-red-900/80 text-white text-[9px] uppercase hidden group-hover:flex items-center justify-center cursor-pointer"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured-proj"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="rounded border-white/10 bg-[#07070A] text-cyan-500 focus:ring-0 cursor-pointer"
                />
                <label htmlFor="featured-proj" className="text-gray-400 uppercase cursor-pointer select-none">
                  Featured Project (Home Slider)
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
              disabled={createMutation.isPending || updateMutation.isPending || isUploading}
              className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-800 text-black font-semibold rounded py-2.5 cursor-pointer transition-colors uppercase tracking-widest text-xs"
            >
              {createMutation.isPending || updateMutation.isPending ? "SAVING..." : "COMMIT_ENTRY"}
            </button>
          </form>
        </div>
      ) : (
        /* List Table View */
        <div className="border border-white/5 bg-[#0E0E13]/20 rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-white/5 text-gray-400 uppercase">
                <th className="p-3">Project Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date Created</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {projects?.map((project) => (
                <tr key={project._id} className="hover:bg-white/5 transition-colors">
                  <td className="p-3 font-bold text-[#F7F5F0]">
                    {project.title}
                    {project.featured && (
                      <span className="ml-1.5 text-[8px] bg-yellow-950/40 text-yellow-400 border border-yellow-500/25 px-1.5 py-0.5 rounded">
                        FEAT
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-cyan-400 uppercase">{project.category}</td>
                  <td className="p-3">
                    <span
                      className={`text-[9px] border px-2 py-0.5 rounded uppercase ${
                        project.status === "published"
                          ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/25"
                          : "bg-gray-950/40 text-gray-400 border-white/10"
                      }`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="p-3 text-gray-400">
                    {new Date(project.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short" })}
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEditInit(project)}
                        className="p-1.5 bg-[#07070A] hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 border border-white/10 rounded cursor-pointer transition-colors"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete project "${project.title}"?`)) {
                            deleteMutation.mutate(project._id);
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
