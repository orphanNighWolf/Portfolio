import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Trash2, Edit2, AlertCircle, CheckCircle, ArrowLeft, Check, X } from "lucide-react";

interface Service {
  _id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
}

interface Booking {
  _id: string;
  name: string;
  email: string;
  service: string;
  preferredDate: string;
  time: string;
  message: string;
  status: "pending" | "confirmed" | "declined";
  createdAt: string;
}

interface Testimonial {
  name: string;
  role: string;
  text: string;
  avatarUrl?: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface MentorshipDetails {
  services: Service[];
  config: {
    testimonials: Testimonial[];
    faqs: FAQ[];
  };
}

export default function AdminMentorshipPage() {
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"bookings" | "services" | "config">("bookings");

  // Service Form State
  const [isServiceFormOpen, setIsServiceFormOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceTitle, setServiceTitle] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [servicePrice, setServicePrice] = useState(100);
  const [serviceDuration, setServiceDuration] = useState("60 Min");

  // FAQs & Testimonials Config State
  const [configTestimonials, setConfigTestimonials] = useState<Testimonial[]>([]);
  const [configFaqs, setConfigFaqs] = useState<FAQ[]>([]);
  const [isConfigLoaded, setIsConfigLoaded] = useState(false);

  // Queries
  const { data: details, isLoading: isDetailsLoading } = useQuery<MentorshipDetails>({
    queryKey: ["admin-mentorship-details"],
    queryFn: async () => {
      const res = await api.get("/mentorship");
      const fetched = res.data.data;
      if (!isConfigLoaded) {
        setConfigTestimonials(fetched.config?.testimonials || []);
        setConfigFaqs(fetched.config?.faqs || []);
        setIsConfigLoaded(true);
      }
      return fetched;
    },
  });

  const { data: bookings, isLoading: isBookingsLoading } = useQuery<Booking[]>({
    queryKey: ["admin-mentorship-bookings"],
    queryFn: async () => {
      const res = await api.get("/mentorship/bookings");
      return res.data.data;
    },
  });

  // Booking Mutations
  const updateBookingStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Booking["status"] }) =>
      api.put(`/mentorship/bookings/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-mentorship-bookings"] });
      triggerSuccess("Booking status updated successfully.");
    },
    onError: (err: any) => setError(err.response?.data?.message || "Status update failed"),
  });

  // Services Mutations
  const createServiceMutation = useMutation({
    mutationFn: async (payload: any) => api.post("/mentorship/services", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-mentorship-details"] });
      triggerSuccess("Service created successfully.");
      closeServiceForm();
    },
    onError: (err: any) => setError(err.response?.data?.message || "Service creation failed"),
  });

  const updateServiceMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) =>
      api.put(`/mentorship/services/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-mentorship-details"] });
      triggerSuccess("Service updated successfully.");
      closeServiceForm();
    },
    onError: (err: any) => setError(err.response?.data?.message || "Service update failed"),
  });

  const deleteServiceMutation = useMutation({
    mutationFn: async (id: string) => api.delete(`/mentorship/services/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-mentorship-details"] });
      triggerSuccess("Service deleted successfully.");
    },
    onError: (err: any) => setError(err.response?.data?.message || "Service delete failed"),
  });

  // Config Mutation
  const updateConfigMutation = useMutation({
    mutationFn: async (payload: any) => api.put("/mentorship/config", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-mentorship-details"] });
      triggerSuccess("Mentorship settings updated successfully.");
    },
    onError: (err: any) => setError(err.response?.data?.message || "Settings update failed"),
  });

  const triggerSuccess = (msg: string) => {
    setSuccess(msg);
    setError(null);
    setTimeout(() => setSuccess(null), 3000);
  };

  const closeServiceForm = () => {
    setIsServiceFormOpen(false);
    setEditingServiceId(null);
    setServiceTitle("");
    setServiceDescription("");
    setServicePrice(100);
    setServiceDuration("60 Min");
  };

  const initEditService = (service: Service) => {
    setEditingServiceId(service._id);
    setServiceTitle(service.title);
    setServiceDescription(service.description);
    setServicePrice(service.price);
    setServiceDuration(service.duration);
    setIsServiceFormOpen(true);
  };

  const handleServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: serviceTitle,
      description: serviceDescription,
      price: servicePrice,
      duration: serviceDuration,
    };

    if (editingServiceId) {
      updateServiceMutation.mutate({ id: editingServiceId, payload });
    } else {
      createServiceMutation.mutate(payload);
    }
  };

  const handleConfigSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfigMutation.mutate({
      testimonials: configTestimonials,
      faqs: configFaqs,
    });
  };

  const addTestimonialRow = () => {
    setConfigTestimonials([...configTestimonials, { name: "", role: "", text: "", avatarUrl: "" }]);
  };

  const removeTestimonialRow = (idx: number) => {
    setConfigTestimonials(configTestimonials.filter((_, i) => i !== idx));
  };

  const addFaqRow = () => {
    setConfigFaqs([...configFaqs, { question: "", answer: "" }]);
  };

  const removeFaqRow = (idx: number) => {
    setConfigFaqs(configFaqs.filter((_, i) => i !== idx));
  };

  if (isDetailsLoading || isBookingsLoading) {
    return <div className="text-center py-20 text-xs text-cyan-400 font-mono">// GATHERING_PORTAL_DETAILS...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-mono text-sm">
      <div className="flex justify-between items-center border-b border-white/5 pb-4 flex-wrap gap-4">
        <div>
          <h1 className="text-xl font-bold text-cyan-400">// MENTORSHIP_PROGRAM_ADMIN</h1>
          <p className="text-xs text-gray-400 mt-1">Review strategy booking slots, manage services packages, or configure FAQs</p>
        </div>

        {/* Tab switch */}
        <div className="flex gap-2 bg-[#0E0E13]/60 p-1 border border-white/5 rounded">
          {(["bookings", "services", "config"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setError(null);
                setSuccess(null);
              }}
              className={`px-3 py-1.5 rounded text-[10px] uppercase font-bold tracking-wider cursor-pointer transition-colors ${
                activeTab === tab ? "bg-cyan-500 text-black" : "text-gray-400 hover:text-cyan-400"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
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

      {/* Bookings View */}
      {activeTab === "bookings" && (
        <div className="border border-white/5 bg-[#0E0E13]/20 rounded-xl overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/5 bg-white/5 text-gray-400 uppercase">
                <th className="p-3">Client</th>
                <th className="p-3">Service Channel</th>
                <th className="p-3">Schedule Time</th>
                <th className="p-3">Agenda Message</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {bookings?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500 italic">
                    No bookings logged yet.
                  </td>
                </tr>
              ) : (
                bookings?.map((book) => (
                  <tr key={book._id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3">
                      <strong className="text-[#F7F5F0] block">{book.name}</strong>
                      <span className="text-[10px] text-gray-500">{book.email}</span>
                    </td>
                    <td className="p-3 text-cyan-400 uppercase">{book.service}</td>
                    <td className="p-3">
                      <span className="block font-bold">{book.preferredDate}</span>
                      <span className="text-[10px] text-gray-500">{book.time}</span>
                    </td>
                    <td className="p-3 max-w-xs truncate" title={book.message}>
                      {book.message || <span className="text-gray-600 font-bold">// NO_AGENDA</span>}
                    </td>
                    <td className="p-3">
                      <span
                        className={`text-[9px] border px-2 py-0.5 rounded uppercase font-bold ${
                          book.status === "confirmed"
                            ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/25"
                            : book.status === "declined"
                            ? "bg-red-950/40 text-red-400 border-red-500/25"
                            : "bg-yellow-950/40 text-yellow-400 border-yellow-500/25"
                        }`}
                      >
                        {book.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {book.status === "pending" && (
                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() =>
                              updateBookingStatusMutation.mutate({ id: book._id, status: "confirmed" })
                            }
                            className="p-1 bg-[#07070A] hover:bg-emerald-500/25 text-gray-400 hover:text-emerald-400 border border-white/10 rounded cursor-pointer transition-colors"
                          >
                            <Check size={12} />
                          </button>
                          <button
                            onClick={() =>
                              updateBookingStatusMutation.mutate({ id: book._id, status: "declined" })
                            }
                            className="p-1 bg-[#07070A] hover:bg-red-500/25 text-gray-400 hover:text-red-400 border border-white/10 rounded cursor-pointer transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Services View */}
      {activeTab === "services" && (
        <div className="space-y-6">
          {isServiceFormOpen ? (
            <div className="bg-[#0E0E13]/30 border border-white/5 rounded-xl p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                  {editingServiceId ? "Edit Mentorship Service" : "Add Mentorship Service"}
                </h2>
                <button
                  onClick={closeServiceForm}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-cyan-400 transition-colors uppercase cursor-pointer"
                >
                  <ArrowLeft size={14} /> Cancel
                </button>
              </div>

              <form onSubmit={handleServiceSubmit} className="space-y-4 text-xs">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-gray-400 uppercase">Service Title</label>
                    <input
                      type="text"
                      required
                      value={serviceTitle}
                      onChange={(e) => setServiceTitle(e.target.value)}
                      className="w-full bg-[#07070A] border border-white/10 rounded px-3 py-2 text-[#F7F5F0] focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-gray-400 uppercase">Duration Description</label>
                    <input
                      type="text"
                      required
                      value={serviceDuration}
                      onChange={(e) => setServiceDuration(e.target.value)}
                      className="w-full bg-[#07070A] border border-white/10 rounded px-3 py-2 text-[#F7F5F0] focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-gray-400 uppercase">Price ($ USD)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={servicePrice}
                      onChange={(e) => setServicePrice(Number(e.target.value))}
                      className="w-full bg-[#07070A] border border-white/10 rounded px-3 py-2 text-[#F7F5F0] focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-gray-400 uppercase">Description Details</label>
                  <textarea
                    required
                    rows={3}
                    value={serviceDescription}
                    onChange={(e) => setServiceDescription(e.target.value)}
                    className="w-full bg-[#07070A] border border-white/10 rounded px-3 py-2 text-[#F7F5F0] focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded py-2.5 cursor-pointer transition-colors uppercase tracking-widest text-xs"
                >
                  Commit Service Package
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button
                  onClick={() => setIsServiceFormOpen(true)}
                  className="flex items-center gap-1 bg-cyan-500 hover:bg-cyan-600 text-black font-semibold rounded px-4 py-2 text-xs uppercase tracking-wider cursor-pointer transition-colors"
                >
                  + Add Package
                </button>
              </div>

              <div className="border border-white/5 bg-[#0E0E13]/20 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/5 text-gray-400 uppercase">
                      <th className="p-3">Package Title</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Duration</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {details?.services.map((svc) => (
                      <tr key={svc._id} className="hover:bg-white/5 transition-colors">
                        <td className="p-3 font-bold text-[#F7F5F0]">{svc.title}</td>
                        <td className="p-3 text-cyan-400 font-bold">${svc.price}</td>
                        <td className="p-3 text-gray-400">{svc.duration}</td>
                        <td className="p-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => initEditService(svc)}
                              className="p-1.5 bg-[#07070A] hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-400 border border-white/10 rounded cursor-pointer transition-colors"
                            >
                              <Edit2 size={12} />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete mentorship package "${svc.title}"?`)) {
                                  deleteServiceMutation.mutate(svc._id);
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
            </div>
          )}
        </div>
      )}

      {/* Config Editor View */}
      {activeTab === "config" && (
        <form onSubmit={handleConfigSubmit} className="space-y-8 bg-[#0E0E13]/30 border border-white/5 rounded-xl p-6">
          
          {/* Testimonials */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">// EDIT_TESTIMONIALS</h3>
              <button
                type="button"
                onClick={addTestimonialRow}
                className="text-[10px] uppercase font-bold text-cyan-400 hover:underline cursor-pointer"
              >
                + Add Testimonial
              </button>
            </div>
            
            <div className="space-y-4">
              {configTestimonials.map((t, idx) => (
                <div key={idx} className="border border-white/5 bg-[#07070A]/50 p-4 rounded-lg space-y-3 relative">
                  <button
                    type="button"
                    onClick={() => removeTestimonialRow(idx)}
                    className="absolute right-3 top-3 text-red-500 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>

                  <div className="grid sm:grid-cols-3 gap-3 text-xs">
                    <div className="space-y-1">
                      <label className="text-gray-500 text-[10px] uppercase">Client Name</label>
                      <input
                        type="text"
                        required
                        value={t.name}
                        onChange={(e) => {
                          const updated = [...configTestimonials];
                          updated[idx].name = e.target.value;
                          setConfigTestimonials(updated);
                        }}
                        className="w-full bg-[#07070A] border border-white/10 rounded px-2.5 py-1.5 text-gray-300 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-500 text-[10px] uppercase">Client Role / Company</label>
                      <input
                        type="text"
                        required
                        value={t.role}
                        onChange={(e) => {
                          const updated = [...configTestimonials];
                          updated[idx].role = e.target.value;
                          setConfigTestimonials(updated);
                        }}
                        className="w-full bg-[#07070A] border border-white/10 rounded px-2.5 py-1.5 text-gray-300 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-gray-500 text-[10px] uppercase">Avatar Image URL (Optional)</label>
                      <input
                        type="text"
                        value={t.avatarUrl || ""}
                        onChange={(e) => {
                          const updated = [...configTestimonials];
                          updated[idx].avatarUrl = e.target.value;
                          setConfigTestimonials(updated);
                        }}
                        className="w-full bg-[#07070A] border border-white/10 rounded px-2.5 py-1.5 text-gray-300 focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="space-y-1 text-xs">
                    <label className="text-gray-500 text-[10px] uppercase">Quote Text</label>
                    <textarea
                      required
                      rows={2}
                      value={t.text}
                      onChange={(e) => {
                        const updated = [...configTestimonials];
                        updated[idx].text = e.target.value;
                        setConfigTestimonials(updated);
                      }}
                      className="w-full bg-[#07070A] border border-white/10 rounded px-2.5 py-1.5 text-gray-300 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div className="space-y-4 border-t border-white/5 pt-6">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">// EDIT_FAQS</h3>
              <button
                type="button"
                onClick={addFaqRow}
                className="text-[10px] uppercase font-bold text-cyan-400 hover:underline cursor-pointer"
              >
                + Add FAQ
              </button>
            </div>

            <div className="space-y-4">
              {configFaqs.map((faq, idx) => (
                <div key={idx} className="border border-white/5 bg-[#07070A]/50 p-4 rounded-lg space-y-3 relative">
                  <button
                    type="button"
                    onClick={() => removeFaqRow(idx)}
                    className="absolute right-3 top-3 text-red-500 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <Trash2 size={14} />
                  </button>

                  <div className="space-y-1 text-xs">
                    <label className="text-gray-500 text-[10px] uppercase">Question</label>
                    <input
                      type="text"
                      required
                      value={faq.question}
                      onChange={(e) => {
                        const updated = [...configFaqs];
                        updated[idx].question = e.target.value;
                        setConfigFaqs(updated);
                      }}
                      className="w-full bg-[#07070A] border border-white/10 rounded px-2.5 py-1.5 text-gray-300 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1 text-xs">
                    <label className="text-gray-500 text-[10px] uppercase">Answer</label>
                    <textarea
                      required
                      rows={2}
                      value={faq.answer}
                      onChange={(e) => {
                        const updated = [...configFaqs];
                        updated[idx].answer = e.target.value;
                        setConfigFaqs(updated);
                      }}
                      className="w-full bg-[#07070A] border border-white/10 rounded px-2.5 py-1.5 text-gray-300 focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={updateConfigMutation.isPending}
            className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-800 text-black font-semibold rounded py-2.5 cursor-pointer transition-colors uppercase tracking-widest text-xs"
          >
            Save Mentorship Settings
          </button>
        </form>
      )}
    </div>
  );
}
