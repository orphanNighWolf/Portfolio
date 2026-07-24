import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Trash2, AlertCircle, CheckCircle, Mail, MailOpen, ChevronLeft, ChevronRight, CornerDownRight, X } from "lucide-react";

interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface MessagesResponse {
  data: Message[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export default function AdminMessagesPage() {
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const { data, isLoading } = useQuery<MessagesResponse>({
    queryKey: ["admin-messages", page],
    queryFn: async () => {
      const res = await api.get("/contact/messages", { params: { page, limit: 10 } });
      return res.data;
    },
  });

  const toggleReadMutation = useMutation({
    mutationFn: async ({ id, read }: { id: string; read: boolean }) =>
      api.put(`/contact/messages/${id}`, { read }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
      // Update selected message state if it's currently open
      if (selectedMessage && selectedMessage._id === variables.id) {
        setSelectedMessage({ ...selectedMessage, read: variables.read });
      }
      triggerSuccess(`Message marked as ${variables.read ? "read" : "unread"}.`);
    },
    onError: (err: any) => setError(err.response?.data?.message || "Status change failed"),
  });

  const deleteMessageMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/contact/messages/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
      setSelectedMessage(null);
      triggerSuccess("Message deleted successfully.");
    },
    onError: (err: any) => setError(err.response?.data?.message || "Deletion failed"),
  });

  const triggerSuccess = (msg: string) => {
    setSuccess(msg);
    setError(null);
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleSelectMessage = (msg: Message) => {
    setSelectedMessage(msg);
    // Mark as read automatically when opened if it is currently unread
    if (!msg.read) {
      toggleReadMutation.mutate({ id: msg._id, read: true });
    }
  };

  if (isLoading) {
    return <div className="text-center py-20 text-xs text-cyan-400 font-mono">// ACCESSING_SECURE_INBOX...</div>;
  }

  const messages = data?.data || [];
  const pagination = data?.pagination || { total: 0, page: 1, limit: 10, pages: 1 };

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-mono text-sm">
      <div className="border-b border-white/5 pb-4">
        <h1 className="text-xl font-bold text-cyan-400">// CONTACT_INBOX</h1>
        <p className="text-xs text-gray-400 mt-1">Review incoming transmissions, manage read indicators, and trace client proposals</p>
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

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* Messages List Panel */}
        <section className={`lg:col-span-2 space-y-4 ${selectedMessage ? "hidden lg:block" : ""}`}>
          <div className="border border-white/5 bg-admin-bg-surface/20 rounded-xl overflow-hidden">
            <div className="divide-y divide-white/5">
              {messages.length === 0 ? (
                <div className="p-8 text-center text-gray-500 italic">
                  No transmissions archived in inbox repository.
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg._id}
                    onClick={() => handleSelectMessage(msg)}
                    className={`p-4 flex justify-between items-start gap-4 cursor-pointer hover:bg-white/5 transition-colors ${
                      !msg.read ? "bg-cyan-500/3 border-l-2 border-cyan-500" : ""
                    }`}
                  >
                    <div className="space-y-1.5 min-w-0 flex-grow">
                      <div className="flex justify-between items-center flex-wrap gap-2 text-[10px] text-gray-500">
                        <strong className={`${!msg.read ? "text-cyan-400 font-bold" : "text-gray-300"}`}>
                          {msg.name} &bull; {msg.email}
                        </strong>
                        <span>
                          {new Date(msg.createdAt).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <h4 className={`text-xs truncate ${!msg.read ? "text-admin-text font-bold" : "text-gray-400"}`}>
                        {msg.subject}
                      </h4>
                      <p className="text-[11px] text-gray-500 truncate leading-normal">
                        {msg.message}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1.5 self-center shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleReadMutation.mutate({ id: msg._id, read: !msg.read });
                        }}
                        className="p-1.5 bg-admin-bg-base hover:bg-white/5 text-gray-400 hover:text-cyan-400 border border-white/10 rounded cursor-pointer transition-colors"
                        title={msg.read ? "Mark as unread" : "Mark as read"}
                      >
                        {msg.read ? <MailOpen size={12} /> : <Mail size={12} />}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete message from "${msg.name}"?`)) {
                            deleteMessageMutation.mutate(msg._id);
                          }
                        }}
                        className="p-1.5 bg-admin-bg-base hover:bg-red-500/20 text-gray-400 hover:text-red-400 border border-white/10 rounded cursor-pointer transition-colors"
                        title="Delete message"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center items-center gap-4 pt-4 text-xs">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 px-3 py-1.5 border border-white/10 rounded disabled:opacity-40 hover:border-cyan-400/40 text-gray-300 cursor-pointer transition-colors"
              >
                <ChevronLeft size={14} /> PREV
              </button>
              <span className="text-gray-400">
                PAGE {page} OF {pagination.pages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
                className="flex items-center gap-1 px-3 py-1.5 border border-white/10 rounded disabled:opacity-40 hover:border-cyan-400/40 text-gray-300 cursor-pointer transition-colors"
              >
                NEXT <ChevronRight size={14} />
              </button>
            </div>
          )}
        </section>

        {/* Message Details Panel */}
        {selectedMessage && (
          <section className="bg-admin-bg-surface/30 border border-white/5 p-6 rounded-xl space-y-4 lg:col-span-1">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">// VIEW_TRANSMISSION</h3>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-gray-500 hover:text-cyan-400 cursor-pointer transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] text-gray-500 block uppercase font-bold">From</span>
                <span className="text-admin-text font-bold block">{selectedMessage.name}</span>
                <span className="text-cyan-400 break-all">{selectedMessage.email}</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-gray-500 block uppercase font-bold">Subject</span>
                <span className="text-admin-text font-bold block">{selectedMessage.subject}</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-gray-500 block uppercase font-bold">Message Content</span>
                <div className="bg-admin-bg-base border border-white/10 p-4 rounded-lg text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.message}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                    selectedMessage.subject
                  )}`}
                  className="flex-grow flex justify-center items-center gap-1.5 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded py-2 transition-colors uppercase tracking-wider text-[10px]"
                >
                  <CornerDownRight size={12} /> Reply Email
                </a>
                <button
                  onClick={() => {
                    if (confirm("Delete this transmission?")) {
                      deleteMessageMutation.mutate(selectedMessage._id);
                    }
                  }}
                  className="p-2 bg-red-950/40 hover:bg-red-900/40 border border-red-500/30 text-red-400 rounded cursor-pointer transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

