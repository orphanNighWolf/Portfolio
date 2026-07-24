import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { AlertCircle, CheckCircle } from "lucide-react";

export default function AdminAboutPage() {
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [currentFocus, setCurrentFocus] = useState("");
  const [mentorshipCta, setMentorshipCta] = useState("");
  const [contactCta, setContactCta] = useState("");
  
  const [techStackStr, setTechStackStr] = useState("");
  const [interestsStr, setInterestsStr] = useState("");

  const [educationJson, setEducationJson] = useState("[]");
  const [experienceJson, setExperienceJson] = useState("[]");
  const [timelineJson, setTimelineJson] = useState("[]");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-about"],
    queryFn: async () => {
      const response = await api.get("/about");
      return response.data.data;
    },
  });

  useEffect(() => {
    if (data) {
      setName(data.name || "");
      setTitle(data.title || "");
      setBio(data.bio || "");
      setLocation(data.location || "");
      setAvatarUrl(data.avatarUrl || "");
      setCurrentFocus(data.currentFocus || "");
      setMentorshipCta(data.mentorshipCta || "");
      setContactCta(data.contactCta || "");
      setTechStackStr(data.techStack ? data.techStack.join(", ") : "");
      setInterestsStr(data.interests ? data.interests.join(", ") : "");
      setEducationJson(JSON.stringify(data.education || [], null, 2));
      setExperienceJson(JSON.stringify(data.experience || [], null, 2));
      setTimelineJson(JSON.stringify(data.timeline || [], null, 2));
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: async (payload: any) => {
      return api.put("/about", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["about"] });
      queryClient.invalidateQueries({ queryKey: ["admin-about"] });
      setSuccess(true);
      setError(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => setSuccess(false), 4000);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || err.response?.data?.error || "Failed to update profile info");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const payload = {
        name,
        title,
        bio,
        location,
        avatarUrl,
        currentFocus,
        mentorshipCta,
        contactCta,
        techStack: techStackStr.split(",").map((s) => s.trim()).filter(Boolean),
        interests: interestsStr.split(",").map((s) => s.trim()).filter(Boolean),
        education: JSON.parse(educationJson),
        experience: JSON.parse(experienceJson),
        timeline: JSON.parse(timelineJson),
      };

      updateMutation.mutate(payload);
    } catch (err: any) {
      setError(`JSON Parsing Error: ${err.message}. Please verify the format of Education, Experience, or Timeline JSON blocks.`);
    }
  };

  if (isLoading) {
    return <div className="text-center py-20 text-xs text-cyan-400 font-mono">// RETRIEVING_PROFILE_DATA...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 font-mono text-sm">
      <div className="border-b border-white/5 pb-4">
        <h1 className="text-xl font-bold text-cyan-400">// EDIT_ABOUT_MODULE</h1>
        <p className="text-xs text-gray-400 mt-1">Configure profile details and chronological summaries</p>
      </div>

      {success && (
        <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs rounded-lg p-4">
          <CheckCircle size={16} />
          <span>Profile configuration saved successfully.</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 bg-red-950/40 border border-red-500/30 text-red-400 text-xs rounded-lg p-4">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-admin-bg-surface/30 border border-white/5 rounded-xl p-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-gray-400 uppercase">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-admin-bg-base border border-white/10 rounded px-3 py-2 text-admin-text focus:border-cyan-400 focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-400 uppercase">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-admin-bg-base border border-white/10 rounded px-3 py-2 text-admin-text focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-gray-400 uppercase">Bio Summary</label>
          <textarea
            required
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full bg-admin-bg-base border border-white/10 rounded px-3 py-2 text-admin-text focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-gray-400 uppercase">Location</label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-admin-bg-base border border-white/10 rounded px-3 py-2 text-admin-text focus:border-cyan-400 focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-400 uppercase">Avatar Image URL</label>
            <input
              type="text"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full bg-admin-bg-base border border-white/10 rounded px-3 py-2 text-admin-text focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-gray-400 uppercase">Current Focus</label>
          <textarea
            required
            rows={2}
            value={currentFocus}
            onChange={(e) => setCurrentFocus(e.target.value)}
            className="w-full bg-admin-bg-base border border-white/10 rounded px-3 py-2 text-admin-text focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-gray-400 uppercase">Tech Stack (comma separated)</label>
            <textarea
              rows={2}
              value={techStackStr}
              onChange={(e) => setTechStackStr(e.target.value)}
              className="w-full bg-admin-bg-base border border-white/10 rounded px-3 py-2 text-admin-text focus:border-cyan-400 focus:outline-none"
              placeholder="React, TypeScript, PyTorch"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-400 uppercase">Interests (comma separated)</label>
            <textarea
              rows={2}
              value={interestsStr}
              onChange={(e) => setInterestsStr(e.target.value)}
              className="w-full bg-admin-bg-base border border-white/10 rounded px-3 py-2 text-admin-text focus:border-cyan-400 focus:outline-none"
              placeholder="Bouldering, Quantum physics"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-gray-400 uppercase">Mentorship CTA Text</label>
          <textarea
            required
            rows={2}
            value={mentorshipCta}
            onChange={(e) => setMentorshipCta(e.target.value)}
            className="w-full bg-admin-bg-base border border-white/10 rounded px-3 py-2 text-admin-text focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-gray-400 uppercase">Contact CTA Text</label>
          <textarea
            required
            rows={2}
            value={contactCta}
            onChange={(e) => setContactCta(e.target.value)}
            className="w-full bg-admin-bg-base border border-white/10 rounded px-3 py-2 text-admin-text focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div className="border-t border-white/5 pt-4 space-y-4">
          <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Complex Lists (JSON Mode)</h3>
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-400">
              <label className="uppercase">Education History</label>
              <span>Array of object fields</span>
            </div>
            <textarea
              rows={5}
              value={educationJson}
              onChange={(e) => setEducationJson(e.target.value)}
              className="w-full bg-admin-bg-base border border-white/10 rounded p-3 text-cyan-400 text-xs font-mono focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-400">
              <label className="uppercase">Professional Experience</label>
              <span>Array of object fields</span>
            </div>
            <textarea
              rows={5}
              value={experienceJson}
              onChange={(e) => setExperienceJson(e.target.value)}
              className="w-full bg-admin-bg-base border border-white/10 rounded p-3 text-cyan-400 text-xs font-mono focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-400">
              <label className="uppercase">Timeline Milestones</label>
              <span>Array of object fields</span>
            </div>
            <textarea
              rows={5}
              value={timelineJson}
              onChange={(e) => setTimelineJson(e.target.value)}
              className="w-full bg-admin-bg-base border border-white/10 rounded p-3 text-cyan-400 text-xs font-mono focus:border-cyan-400 focus:outline-none"
            />
          </div>
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

