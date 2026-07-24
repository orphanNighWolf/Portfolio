import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { ArrowLeft, Download, FileDown, Calendar, Database } from "lucide-react";

interface ResourceDoc {
  _id: string;
  type: "note" | "pdf" | "template" | "cheatsheet" | "roadmap";
  title: string;
  category: string;
  description: string;
  fileUrl: string;
  downloadCount: number;
  createdAt: string;
}

export default function ResourceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const queryClient = useQueryClient();

  const { data: resource, isLoading, error } = useQuery<ResourceDoc>({
    queryKey: ["resource-item", slug],
    queryFn: async () => {
      const response = await api.get(`/resources/${slug}`);
      return response.data.data;
    },
    enabled: !!slug,
  });

  const downloadMutation = useMutation({
    mutationFn: async ({ id, fileUrl }: { id: string; fileUrl: string }) => {
      await api.post(`/resources/${id}/download`);
      return fileUrl;
    },
    onSuccess: (fileUrl) => {
      queryClient.invalidateQueries({ queryKey: ["resource-item"] });
      window.open(fileUrl, "_blank");
    },
    onError: (_err, variables) => {
      window.open(variables.fileUrl, "_blank");
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20 font-mono text-xs text-cyan-400">
        // DECRYPTING_RESOURCE_METADATA...
      </div>
    );
  }

  if (error || !resource) {
    return (
      <div className="text-center py-20 font-mono text-xs text-red-400">
        Error: Resource missing or download link corrupted.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 font-mono text-sm">
      <div>
        <Link
          to="/resources"
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-cyan-400 transition-colors uppercase"
        >
          <ArrowLeft size={14} /> Back to index
        </Link>
      </div>

      {/* Main card */}
      <section className="bg-[#0E0E13]/50 border border-white/5 p-8 rounded-xl space-y-6">
        <div className="flex justify-between items-center text-[10px] text-gray-500">
          <span className="uppercase bg-cyan-950/40 text-cyan-400 border border-cyan-500/25 px-2.5 py-0.5 rounded">
            {resource.type} // {resource.category}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={12} /> ADDED // {new Date(resource.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short" })}
          </span>
        </div>

        <h1 className="text-xl md:text-2xl font-bold text-[#F7F5F0] tracking-wide leading-snug">
          {resource.title}
        </h1>

        <p className="text-xs text-gray-400 leading-relaxed bg-[#0E0E13]/25 border border-white/5 p-5 rounded-lg">
          {resource.description}
        </p>

        {/* Action Panel */}
        <div className="flex justify-between items-center border-t border-white/5 pt-6 flex-wrap gap-4">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <FileDown size={14} className="text-cyan-400" />
              <strong className="text-[#F7F5F0]">{resource.downloadCount}</strong> downloads
            </span>
            <span className="text-gray-600">|</span>
            <span className="flex items-center gap-1 text-[10px]">
              <Database size={12} /> STORAGE: Cloudinary Raw
            </span>
          </div>

          <button
            onClick={() => downloadMutation.mutate({ id: resource._id, fileUrl: resource.fileUrl })}
            disabled={downloadMutation.isPending}
            className="flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-600 text-black text-xs font-semibold uppercase tracking-wider rounded px-6 py-3 cursor-pointer transition-colors"
          >
            <Download size={14} /> Download Resource
          </button>
        </div>
      </section>
    </div>
  );
}
