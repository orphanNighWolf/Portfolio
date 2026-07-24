import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Trash2, Edit2, Plus, AlertCircle, CheckCircle } from "lucide-react";

interface Skill {
  _id: string;
  name: string;
  category: string;
  level: number;
  yearsExperience: number;
  icon?: string;
  description?: string;
  featured: boolean;
}

const CATEGORIES = ["Programming", "Frontend", "Backend", "Database", "DevOps", "AI", "Cloud", "Tools"];

export default function AdminSkillsPage() {
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Programming");
  const [level, setLevel] = useState(80);
  const [yearsExperience, setYearsExperience] = useState(2);
  const [icon, setIcon] = useState("");
  const [description, setDescription] = useState("");
  const [featured, setFeatured] = useState(false);

  // Query skills
  const { data: skills, isLoading } = useQuery<Skill[]>({
    queryKey: ["admin-skills"],
    queryFn: async () => {
      const response = await api.get("/skills");
      return response.data.data;
    },
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: async (payload: any) => api.post("/skills", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      queryClient.invalidateQueries({ queryKey: ["admin-skills"] });
      triggerSuccess("Skill created successfully.");
      resetForm();
    },
    onError: (err: any) => setError(err.response?.data?.message || err.response?.data?.error || "Creation failed"),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => api.put(`/skills/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      queryClient.invalidateQueries({ queryKey: ["admin-skills"] });
      triggerSuccess("Skill updated successfully.");
      resetForm();
    },
    onError: (err: any) => setError(err.response?.data?.message || err.response?.data?.error || "Update failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/skills/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      queryClient.invalidateQueries({ queryKey: ["admin-skills"] });
      triggerSuccess("Skill deleted successfully.");
    },
    onError: (err: any) => setError(err.response?.data?.message || "Delete failed"),
  });

  const triggerSuccess = (msg: string) => {
    setSuccess(msg);
    setError(null);
    setTimeout(() => setSuccess(null), 3000);
  };

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setCategory("Programming");
    setLevel(80);
    setYearsExperience(2);
    setIcon("");
    setDescription("");
    setFeatured(false);
  };

  const handleEditInit = (skill: Skill) => {
    setEditingId(skill._id);
    setName(skill.name);
    setCategory(skill.category);
    setLevel(skill.level);
    setYearsExperience(skill.yearsExperience);
    setIcon(skill.icon || "");
    setDescription(skill.description || "");
    setFeatured(skill.featured || false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload = {
      name,
      category,
      level,
      yearsExperience,
      icon,
      description,
      featured,
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
      <div className="border-b border-white/5 pb-4">
        <h1 className="text-xl font-bold text-cyan-400">// SKILLS_INVENTORY_MANAGER</h1>
        <p className="text-xs text-gray-400 mt-1">Manage core languages, frameworks, tool listings, and featured highlights</p>
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

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Side: Form Editor */}
        <div className="bg-[#0E0E13]/30 border border-white/5 rounded-xl p-6 h-fit space-y-4">
          <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
            {editingId ? <Edit2 size={12} /> : <Plus size={12} />}
            {editingId ? "Edit Skill" : "Create Skill"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-gray-400 uppercase">Skill Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#07070A] border border-white/10 rounded px-3 py-2 text-[#F7F5F0] focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-400 uppercase">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#07070A] border border-white/10 rounded px-3 py-2 text-[#F7F5F0] focus:border-cyan-400 focus:outline-none"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-gray-400 uppercase">Level (0-100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  required
                  value={level}
                  onChange={(e) => setLevel(Number(e.target.value))}
                  className="w-full bg-[#07070A] border border-white/10 rounded px-3 py-2 text-[#F7F5F0] focus:border-cyan-400 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-gray-400 uppercase">Years Exp</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(Number(e.target.value))}
                  className="w-full bg-[#07070A] border border-white/10 rounded px-3 py-2 text-[#F7F5F0] focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-gray-400 uppercase">Icon Identifier</label>
              <input
                type="text"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full bg-[#07070A] border border-white/10 rounded px-3 py-2 text-[#F7F5F0] focus:border-cyan-400 focus:outline-none"
                placeholder="e.g. Code, Terminal, Server"
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-400 uppercase">Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#07070A] border border-white/10 rounded px-3 py-2 text-[#F7F5F0] focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 py-1">
              <input
                type="checkbox"
                id="featured"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="rounded border-white/10 bg-[#07070A] text-cyan-500 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="featured" className="text-gray-400 uppercase cursor-pointer select-none">
                Featured Skill (Promo on Home)
              </label>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="flex-grow bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-800 text-black font-semibold rounded py-2 cursor-pointer transition-colors uppercase tracking-wider"
              >
                {editingId ? "SAVE_CHANGES" : "CREATE_ENTRY"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded px-3 py-2 cursor-pointer transition-colors"
                >
                  CANCEL
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Side: List Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="border border-white/5 bg-[#0E0E13]/20 rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/5 bg-white/5 text-gray-400 uppercase">
                  <th className="p-3">Skill Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Years Exp</th>
                  <th className="p-3">Proficiency</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {skills?.map((skill) => (
                  <tr key={skill._id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 font-bold text-[#F7F5F0]">
                      {skill.name}
                      {skill.featured && (
                        <span className="ml-1.5 text-[8px] bg-yellow-950/40 text-yellow-400 border border-yellow-500/25 px-1.5 py-0.5 rounded">
                          FEAT
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-cyan-400 uppercase">{skill.category}</td>
                    <td className="p-3 text-gray-300">{skill.yearsExperience} yrs</td>
                    <td className="p-3 text-gray-300">{skill.level}%</td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEditInit(skill)}
                          className="p-1.5 bg-[#07070A] hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 border border-white/10 rounded cursor-pointer transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete skill "${skill.name}"?`)) {
                              deleteMutation.mutate(skill._id);
                            }
                          }}
                          className="p-1.5 bg-[#07070A] hover:bg-red-500/20 text-gray-400 hover:text-red-400 border border-white/10 rounded cursor-pointer transition-colors"
                          title="Delete"
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
        </div>
      </div>
    </div>
  );
}
