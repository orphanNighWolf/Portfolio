import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Trash2, Edit2, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";

interface JourneyEntry {
  _id: string;
  type: "school" | "college" | "internship" | "project" | "learning" | "achievement" | "futureGoal";
  title: string;
  description: string;
  dateRange: string;
  icon: string;
}

export default function AdminJourneyPage() {
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [type, setType] = useState<JourneyEntry["type"]>("learning");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [icon, setIcon] = useState("Cpu");

  const { data: journeyItems, isLoading } = useQuery<JourneyEntry[]>({
    queryKey: ["admin-journey"],
    queryFn: async () => {
      const response = await api.get("/journey");
      return response.data.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: any) => api.post("/journey", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journey"] });
      queryClient.invalidateQueries({ queryKey: ["admin-journey"] });
      triggerSuccess("Milestone created successfully.");
      closeAndResetForm();
    },
    onError: (err: any) => setError(err.response?.data?.message || err.response?.data?.error || "Creation failed"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => api.put(`/journey/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journey"] });
      queryClient.invalidateQueries({ queryKey: ["admin-journey"] });
      triggerSuccess("Milestone updated successfully.");
      closeAndResetForm();
    },
    onError: (err: any) => setError(err.response?.data?.message || err.response?.data?.error || "Update failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/journey/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journey"] });
      queryClient.invalidateQueries({ queryKey: ["admin-journey"] });
      triggerSuccess("Milestone deleted successfully.");
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
    setType("learning");
    setTitle("");
    setDescription("");
    setDateRange("");
    setIcon("Cpu");
  };

  const handleEditInit = (entry: JourneyEntry) => {
    setEditingId(entry._id);
    setType(entry.type);
    setTitle(entry.title);
    setDescription(entry.description);
    setDateRange(entry.dateRange);
    setIcon(entry.icon);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload = {
      type,
      title,
      description,
      dateRange,
      icon,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  if (isLoading) {
    return <div className="text-center py-20 text-xs text-cyan-400 font-mono">// READING_MILESTONE_LOGS...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-mono text-sm">
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <h1 className="text-xl font-bold text-cyan-400">// JOURNEY_TIMELINE_ADMIN</h1>
          <p className="text-xs text-gray-400 mt-1">Configure chronological records for vertical timeline displaying</p>
        </div>
        {!isFormOpen && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-1 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded px-4 py-2 text-xs uppercase tracking-wider cursor-pointer transition-colors"
          >
            + Add Milestone
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
              {editingId ? "Edit Milestone Details" : "Create Milestone Entry"}
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
                <label className="text-gray-400 uppercase">Entry Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as JourneyEntry["type"])}
                  className="w-full bg-[#07070A] border border-white/10 rounded px-3 py-2 text-[#F7F5F0] focus:border-cyan-400 focus:outline-none"
                >
                  <option value="school">School</option>
                  <option value="college">College / University</option>
                  <option value="internship">Internship</option>
                  <option value="project">Project Launch</option>
                  <option value="learning">Active Learning</option>
                  <option value="achievement">Achievement</option>
                  <option value="futureGoal">Future Goal</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-gray-400 uppercase">Milestone Title</label>
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
                <label className="text-gray-400 uppercase">Date Range / Duration</label>
                <input
                  type="text"
                  required
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="w-full bg-[#07070A] border border-white/10 rounded px-3 py-2 text-[#F7F5F0] focus:border-cyan-400 focus:outline-none"
                  placeholder="e.g. 2020 - 2022"
                />
              </div>
              <div className="space-y-1">
                <label className="text-gray-400 uppercase">Lucide Icon Name</label>
                <input
                  type="text"
                  required
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-full bg-[#07070A] border border-white/10 rounded px-3 py-2 text-[#F7F5F0] focus:border-cyan-400 focus:outline-none"
                  placeholder="GraduationCap, Briefcase, Cpu, Terminal"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-gray-400 uppercase">Description Details</label>
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
              disabled={createMutation.isPending || updateMutation.isPending}
              className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-800 text-black font-semibold rounded py-2.5 cursor-pointer transition-colors uppercase tracking-widest text-xs"
            >
              Commit Entry
            </button>
          </form>
        </div>
      ) : (
        <div className="border border-white/5 bg-[#0E0E13]/20 rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-white/5 text-gray-400 uppercase">
                <th className="p-3">Title</th>
                <th className="p-3">Type</th>
                <th className="p-3">Duration</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {journeyItems?.map((entry) => (
                <tr key={entry._id} className="hover:bg-white/5 transition-colors">
                  <td className="p-3 font-bold text-[#F7F5F0]">{entry.title}</td>
                  <td className="p-3 text-cyan-400 uppercase">{entry.type}</td>
                  <td className="p-3 text-gray-400">{entry.dateRange}</td>
                  <td className="p-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEditInit(entry)}
                        className="p-1.5 bg-[#07070A] hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 border border-white/10 rounded cursor-pointer transition-colors"
                      >
                        <Edit2 size={12} />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete milestone "${entry.title}"?`)) {
                            deleteMutation.mutate(entry._id);
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
