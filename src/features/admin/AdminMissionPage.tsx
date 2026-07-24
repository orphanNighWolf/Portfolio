import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { AlertCircle, CheckCircle } from "lucide-react";

export default function AdminMissionPage() {
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [careerMission, setCareerMission] = useState("");
  const [vision, setVision] = useState("");
  const [longTermGoalsStr, setLongTermGoalsStr] = useState("");
  const [valuesStr, setValuesStr] = useState("");
  const [currentLearningStr, setCurrentLearningStr] = useState("");
  const [futureRoadmapJson, setFutureRoadmapJson] = useState("[]");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-mission"],
    queryFn: async () => {
      const response = await api.get("/mission");
      return response.data.data;
    },
  });

  useEffect(() => {
    if (data) {
      setCareerMission(data.careerMission || "");
      setVision(data.vision || "");
      setLongTermGoalsStr(data.longTermGoals ? data.longTermGoals.join("\n") : "");
      setValuesStr(data.values ? data.values.join("\n") : "");
      setCurrentLearningStr(data.currentLearning ? data.currentLearning.join(", ") : "");
      setFutureRoadmapJson(JSON.stringify(data.futureRoadmap || [], null, 2));
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: async (payload: any) => {
      return api.put("/mission", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mission"] });
      queryClient.invalidateQueries({ queryKey: ["admin-mission"] });
      setSuccess(true);
      setError(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => setSuccess(false), 4000);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || err.response?.data?.error || "Failed to update mission parameters");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const payload = {
        careerMission,
        vision,
        longTermGoals: longTermGoalsStr.split("\n").map((s) => s.trim()).filter(Boolean),
        values: valuesStr.split("\n").map((s) => s.trim()).filter(Boolean),
        currentLearning: currentLearningStr.split(",").map((s) => s.trim()).filter(Boolean),
        futureRoadmap: JSON.parse(futureRoadmapJson),
      };

      updateMutation.mutate(payload);
    } catch (err: any) {
      setError(`JSON Parsing Error: ${err.message}. Verify the Future Roadmap JSON block format.`);
    }
  };

  if (isLoading) {
    return <div className="text-center py-20 text-xs text-cyan-400 font-mono">// RETRIEVING_MISSION_DATA...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-mono text-sm">
      <div className="border-b border-white/5 pb-4">
        <h1 className="text-xl font-bold text-cyan-400">// EDIT_MISSION_MODULE</h1>
        <p className="text-xs text-gray-400 mt-1">Configure professional alignments, vision declarations, and roadmap chronology</p>
      </div>

      {success && (
        <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs rounded-lg p-4">
          <CheckCircle size={16} />
          <span>Mission parameters saved successfully.</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 bg-red-950/40 border border-red-500/30 text-red-400 text-xs rounded-lg p-4">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-admin-bg-surface/30 border border-white/5 rounded-xl p-6">
        <div className="space-y-1">
          <label className="text-xs text-gray-400 uppercase">Career Mission Statement</label>
          <textarea
            required
            rows={3}
            value={careerMission}
            onChange={(e) => setCareerMission(e.target.value)}
            className="w-full bg-admin-bg-base border border-white/10 rounded px-3 py-2 text-admin-text focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-gray-400 uppercase">Future Vision Description</label>
          <textarea
            required
            rows={3}
            value={vision}
            onChange={(e) => setVision(e.target.value)}
            className="w-full bg-admin-bg-base border border-white/10 rounded px-3 py-2 text-admin-text focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-gray-400 uppercase">Long-Term Goals (one per line)</label>
            <textarea
              rows={4}
              value={longTermGoalsStr}
              onChange={(e) => setLongTermGoalsStr(e.target.value)}
              className="w-full bg-admin-bg-base border border-white/10 rounded px-3 py-2 text-admin-text focus:border-cyan-400 focus:outline-none"
              placeholder="Deploy edge intelligence solutions&#10;Lead machine learning researchers"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-400 uppercase">Core Values (one per line)</label>
            <textarea
              rows={4}
              value={valuesStr}
              onChange={(e) => setValuesStr(e.target.value)}
              className="w-full bg-admin-bg-base border border-white/10 rounded px-3 py-2 text-admin-text focus:border-cyan-400 focus:outline-none"
              placeholder="Open Source Advocacy&#10;Rigorous Validation"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-gray-400 uppercase">Current Learning Targets (comma separated)</label>
          <textarea
            rows={2}
            value={currentLearningStr}
            onChange={(e) => setCurrentLearningStr(e.target.value)}
            className="w-full bg-admin-bg-base border border-white/10 rounded px-3 py-2 text-admin-text focus:border-cyan-400 focus:outline-none"
            placeholder="Rust Compiler, CUDA kernels"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-400">
            <label className="uppercase">Roadmap Milestones (JSON Array)</label>
            <span>["Period: Description", ...]</span>
          </div>
          <textarea
            rows={6}
            value={futureRoadmapJson}
            onChange={(e) => setFutureRoadmapJson(e.target.value)}
            className="w-full bg-admin-bg-base border border-white/10 rounded p-3 text-cyan-400 text-xs font-mono focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-800 text-black font-semibold rounded py-2.5 cursor-pointer transition-colors uppercase tracking-widest text-xs"
        >
          {updateMutation.isPending ? "SAVING..." : "COMMIT_CHANGES"}
        </button>
      </form>
    </div>
  );
}

