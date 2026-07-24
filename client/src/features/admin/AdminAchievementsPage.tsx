import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Trash2, Edit2, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";

interface AchievementDoc {
  _id: string;
  type: "certificate" | "hackathon" | "competition" | "award" | "badge" | "conference";
  title: string;
  organization: string;
  date: string;
  description: string;
  imageUrl?: string;
  link?: string;
}

export default function AdminAchievementsPage() {
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [type, setType] = useState<AchievementDoc["type"]>("certificate");
  const [title, setTitle] = useState("");
  const [organization, setOrganization] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [link, setLink] = useState("");

  const { data: achievements, isLoading } = useQuery<AchievementDoc[]>({
    queryKey: ["admin-achievements"],
    queryFn: async () => {
      const response = await api.get("/achievements");
      return response.data.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: any) => api.post("/achievements", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["achievements"] });
      queryClient.invalidateQueries({ queryKey: ["admin-achievements"] });
      triggerSuccess("Achievement logged successfully.");
      closeAndResetForm();
    },
    onError: (err: any) => setError(err.response?.data?.message || err.response?.data?.error || "Creation failed"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => api.put(`/achievements/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["achievements"] });
      queryClient.invalidateQueries({ queryKey: ["admin-achievements"] });
      triggerSuccess("Achievement updated successfully.");
      closeAndResetForm();
    },
    onError: (err: any) => setError(err.response?.data?.message || err.response?.data?.error || "Update failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/achievements/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["achievements"] });
      queryClient.invalidateQueries({ queryKey: ["admin-achievements"] });
      triggerSuccess("Achievement deleted successfully.");
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
    setType("certificate");
    setTitle("");
    setOrganization("");
    setDate("");
    setDescription("");
    setImageUrl("");
    setLink("");
  };

  const handleEditInit = (item: AchievementDoc) => {
    setEditingId(item._id);
    setType(item.type);
    setTitle(item.title);
    setOrganization(item.organization);
    // Date input type="date" expects YYYY-MM-DD
    const formattedDate = item.date ? new Date(item.date).toISOString().split("T")[0] : "";
    setDate(formattedDate);
    setDescription(item.description);
    setImageUrl(item.imageUrl || "");
    setLink(item.link || "");
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setImageUrl(response.data.url);
      triggerSuccess("Image uploaded successfully.");
    } catch (err: any) {
      setError(err.response?.data?.message || "Image upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload = {
      type,
      title,
      organization,
      date: new Date(date).toISOString(),
      description,
      imageUrl,
      link,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  if (isLoading) {
    return <div className="text-center py-20 text-xs text-cyan-400 font-mono">// READING_ACCOMPLISHMENTS...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-mono text-sm">
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <h1 className="text-xl font-bold text-cyan-400">// CREDENTIALS_ADMIN</h1>
          <p className="text-xs text-gray-400 mt-1">Orchestrate awards, certs, and hackathon records</p>
        </div>
        {!isFormOpen && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-1 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded px-4 py-2 text-xs uppercase tracking-wider cursor-pointer transition-colors"
          >
            + Add Award
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
              {editingId ? "Edit Award Details" : "Create Award Entry"}
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
                <label className="text-gray-400 uppercase">Award Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as AchievementDoc["type"])}
                  className="w-full bg-[#07070A] border border-white/10 rounded px-3 py-2 text-[#F7F5F0] focus:border-cyan-400 focus:outline-none"
                >
                  <option value="certificate">Certificate</option>
                  <option value="hackathon">Hackathon</option>
                  <option value="competition">Competition</option>
                  <option value="award">Award / Recognition</option>
                  <option value="badge">Badge</option>
                  <option value="conference">Conference Talk / Attendee</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-gray-400 uppercase">Title / Name</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#07070A] border border-white/10 rounded px-3 py-2 text-[#F7F5F0] focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-gray-400 uppercase">Issuing Organization</label>
                <input
                  type="text"
                  required
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full bg-[#07070A] border border-white/10 rounded px-3 py-2 text-[#F7F5F0] focus:border-cyan-400 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-gray-400 uppercase">Date Issued</label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-[#07070A] border border-white/10 rounded px-3 py-2 text-[#F7F5F0] focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-gray-400 uppercase">Credentials URL Link</label>
                <input
                  type="text"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full bg-[#07070A] border border-white/10 rounded px-3 py-2 text-[#F7F5F0] focus:border-cyan-400 focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <span className="text-gray-400 uppercase block">Credentials Image Badge</span>
                <input
                  type="file"
                  disabled={isUploading}
                  onChange={handleFileUpload}
                  className="block text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-cyan-950/40 file:text-cyan-400 hover:file:bg-cyan-900/40 file:cursor-pointer"
                />
                {imageUrl && (
                  <div className="relative group w-16 h-16 border border-white/10 rounded overflow-hidden mt-1">
                    <img src={imageUrl} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImageUrl("")}
                      className="absolute inset-0 bg-red-900/80 text-white text-[9px] uppercase hidden group-hover:flex items-center justify-center cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-gray-400 uppercase">Description</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#07070A] border border-white/10 rounded px-3 py-2 text-[#F7F5F0] focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending || isUploading}
              className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-800 text-black font-semibold rounded py-2.5 cursor-pointer transition-colors uppercase tracking-widest text-xs"
            >
              Commit Award
            </button>
          </form>
        </div>
      ) : (
        <div className="border border-white/5 bg-[#0E0E13]/20 rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-white/5 text-gray-400 uppercase">
                <th className="p-3">Title</th>
                <th className="p-3">Organization</th>
                <th className="p-3">Type</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {achievements?.map((item) => (
                <tr key={item._id} className="hover:bg-white/5 transition-colors">
                  <td className="p-3 font-bold text-[#F7F5F0]">{item.title}</td>
                  <td className="p-3 text-gray-400">{item.organization}</td>
                  <td className="p-3 text-cyan-400 uppercase">{item.type}</td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEditInit(item)}
                        className="p-1.5 bg-[#07070A] hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 border border-white/10 rounded cursor-pointer transition-colors"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete achievement "${item.title}"?`)) {
                            deleteMutation.mutate(item._id);
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
