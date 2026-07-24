import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Save, AlertCircle, CheckCircle, RefreshCw } from "lucide-react";

export default function AdminSocialsPage() {
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [jsonText, setJsonText] = useState("");
  const [isValidJson, setIsValidJson] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-socials-data"],
    queryFn: async () => {
      const res = await api.get("/socials");
      return res.data.data;
    },
  });

  useEffect(() => {
    if (data) {
      const { _id, createdAt, updatedAt, __v, ...cleanData } = data;
      setJsonText(JSON.stringify(cleanData, null, 2));
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: async (payload: any) => api.put("/socials", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-socials-data"] });
      queryClient.invalidateQueries({ queryKey: ["socials"] });
      triggerSuccess("Socials configuration successfully updated.");
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || err.response?.data?.error || "Update operation failed.");
    },
  });

  const triggerSuccess = (msg: string) => {
    setSuccess(msg);
    setError(null);
    setTimeout(() => setSuccess(null), 3500);
  };

  const handleJsonChange = (val: string) => {
    setJsonText(val);
    try {
      if (val.trim() === "") {
        setIsValidJson(false);
        setValidationError("JSON configuration cannot be empty");
        return;
      }
      JSON.parse(val);
      setIsValidJson(true);
      setValidationError(null);
    } catch (e: any) {
      setIsValidJson(false);
      setValidationError(e.message);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!isValidJson) {
      setError("Please fix errors in the JSON configuration.");
      return;
    }

    try {
      const parsed = JSON.parse(jsonText);
      updateMutation.mutate(parsed);
    } catch (e: any) {
      setError(`Failed to parse configuration: ${e.message}`);
    }
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setJsonText(JSON.stringify(parsed, null, 2));
      setIsValidJson(true);
      setValidationError(null);
    } catch (e: any) {
      setValidationError(`Failed to format: ${e.message}`);
    }
  };

  if (isLoading) {
    return <div className="text-center py-20 text-xs text-cyan-400 font-mono">// COMPILING_SOCIALS_MANIFEST...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-mono text-sm">
      <div className="border-b border-white/5 pb-4">
        <h1 className="text-xl font-bold text-cyan-400">// EDIT_SOCIALS_MANIFEST</h1>
        <p className="text-xs text-gray-400 mt-1">Configure profile external URLs, user handles, and manual connections counts</p>
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

      <form onSubmit={handleSave} className="space-y-4">
        <div className="flex justify-between items-center text-xs">
          <span className="flex items-center gap-1.5 font-bold">
            STATUS:{" "}
            {isValidJson ? (
              <span className="text-emerald-400 font-bold">// VALID_SYNTAX</span>
            ) : (
              <span className="text-red-400 font-bold">// ERROR: {validationError}</span>
            )}
          </span>
          <button
            type="button"
            onClick={handleFormat}
            className="flex items-center gap-1 text-[10px] text-cyan-400 hover:underline uppercase font-bold cursor-pointer"
          >
            <RefreshCw size={12} /> Format Document
          </button>
        </div>

        <div className="bg-admin-bg-base border border-white/10 rounded-xl overflow-hidden shadow-inner">
          <textarea
            rows={16}
            value={jsonText}
            onChange={(e) => handleJsonChange(e.target.value)}
            className="w-full bg-transparent p-5 font-mono text-xs text-gray-300 focus:outline-none leading-relaxed resize-y select-text"
            style={{ tabSize: 2 }}
          />
        </div>

        <button
          type="submit"
          disabled={updateMutation.isPending || !isValidJson}
          className="w-full flex justify-center items-center gap-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-800 text-black font-semibold rounded py-2.5 cursor-pointer transition-colors uppercase tracking-widest text-xs"
        >
          <Save size={14} /> Commit Changes
        </button>
      </form>
    </div>
  );
}

