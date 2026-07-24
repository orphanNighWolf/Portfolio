import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { ChevronDown, MessageSquare, AlertCircle, CheckCircle } from "lucide-react";
import LoadingState from "@/components/LoadingState";
import Button from "@/components/Button";
import Card from "@/components/Card";
import { FormInput, FormSelect, FormTextarea, FormLabel } from "@/components/FormElements";

interface Service {
  _id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
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

export default function MentorshipPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  // Booking Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useQuery<MentorshipDetails>({
    queryKey: ["mentorship-details"],
    queryFn: async () => {
      const res = await api.get("/mentorship");
      return res.data.data;
    },
  });

  const bookingMutation = useMutation({
    mutationFn: async (payload: any) => api.post("/mentorship/book", payload),
    onSuccess: () => {
      setSuccess("Booking requested successfully! Alex will review it shortly.");
      setError(null);
      setName("");
      setEmail("");
      setService("");
      setPreferredDate("");
      setTime("");
      setMessage("");
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || err.response?.data?.error || "Booking request failed.");
      setSuccess(null);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!service) {
      setError("Please select a service option.");
      return;
    }

    bookingMutation.mutate({
      name,
      email,
      service,
      preferredDate,
      time,
      message,
    });
  };

  if (isLoading) {
    return <LoadingState message="COMPILING_MENTORSHIP_PORTAL..." />;
  }

  const services = data?.services || [];
  const testimonials = data?.config?.testimonials || [];
  const faqs = data?.config?.faqs || [];

  return (
    <div className="max-w-5xl mx-auto space-y-16 animate-in fade-in duration-500">
      <div className="border-b border-border pb-4">
        <h1 className="text-h2 font-bold text-text-primary font-display">Mentorship Program</h1>
        <p className="text-xs text-text-muted mt-1 font-mono">// Accelerate your engineering or financial strategies through targeted 1:1 sessions</p>
      </div>

      {/* Services Grid */}
      <section className="space-y-6">
        <h2 className="text-xs font-bold text-accent-finance uppercase tracking-widest font-mono border-b border-divider pb-2">// Channels Available</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((item) => (
            <Card
              key={item._id}
              variant="service"
              title={item.title}
              description={item.description}
              category={item.duration}
              price={item.price}
              actionButton={
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setService(item.title)}
                  className="w-full mt-2 border-accent-finance/20 text-accent-finance hover:border-accent-finance hover:bg-accent-finance/10 hover:text-accent-finance"
                >
                  Select Channel
                </Button>
              }
            />
          ))}
        </div>
      </section>

      {/* Form & Testimonials Layout */}
      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Booking Form */}
        <section className="bg-bg-surface border border-border rounded-2xl p-6 space-y-5 shadow-lg">
          <h3 className="text-xs font-bold text-accent-finance uppercase tracking-widest font-mono border-b border-divider pb-2">// Book Session</h3>
          
          {success && (
            <div className="flex items-center gap-2 bg-success/10 border border-success/20 text-success text-xs rounded-xl p-4 font-mono">
              <CheckCircle size={16} className="shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 bg-error/10 border border-error/20 text-error text-xs rounded-xl p-4 font-mono">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <FormLabel htmlFor="name" required>Your Name</FormLabel>
              <FormInput
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            
            <div className="space-y-1.5">
              <FormLabel htmlFor="email" required>Email Address</FormLabel>
              <FormInput
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
              />
            </div>

            <div className="space-y-1.5">
              <FormLabel htmlFor="service" required>Select Channel</FormLabel>
              <FormSelect
                id="service"
                value={service}
                onChange={(e) => setService(e.target.value)}
                options={[
                  { value: "", label: "-- Choose Services --" },
                  ...services.map((item) => ({
                    value: item.title,
                    label: `${item.title} ($${item.price})`,
                  })),
                ]}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <FormLabel htmlFor="preferredDate" required>Preferred Date</FormLabel>
                <FormInput
                  id="preferredDate"
                  type="date"
                  required
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <FormLabel htmlFor="time" required>Preferred Time</FormLabel>
                <FormInput
                  id="time"
                  type="text"
                  required
                  placeholder="e.g. 2:00 PM EST"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <FormLabel htmlFor="message">Agenda & Target Goals</FormLabel>
              <FormTextarea
                id="message"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="What challenges or architectures do you want to break down?"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              disabled={bookingMutation.isPending}
              className="w-full mt-2 bg-accent-finance hover:bg-accent-finance/90 border border-accent-finance/10 text-bg-base font-bold shadow-lg hover:shadow-accent-finance/20"
            >
              {bookingMutation.isPending ? "REQUESTING BOOKING..." : "DISPATCH BOOKING REQUEST"}
            </Button>
          </form>
        </section>

        {/* Testimonials */}
        <section className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-accent-finance uppercase tracking-widest font-mono border-b border-divider pb-2">// Alumni Testimonials</h3>
            <div className="space-y-4">
              {testimonials.map((t, idx) => (
                <div key={idx} className="bg-bg-surface border border-border p-5 rounded-2xl space-y-4 relative group shadow-md">
                  <MessageSquare className="absolute right-4 top-4 text-accent-finance/5" size={28} />
                  <p className="text-xs text-text-secondary italic leading-relaxed font-sans">"{t.text}"</p>
                  <div className="flex items-center gap-3 border-t border-divider pt-3.5">
                    {t.avatarUrl && (
                      <img src={t.avatarUrl} alt={t.name} className="w-8 h-8 rounded-full border border-border" />
                    )}
                    <div className="font-mono">
                      <strong className="text-[11px] text-text-primary block font-bold">{t.name}</strong>
                      <span className="text-[9px] text-text-muted">{t.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* FAQ Accordion */}
      {faqs.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-xs font-bold text-accent-finance tracking-widest font-mono border-b border-divider pb-2">// Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="bg-bg-surface border border-border rounded-xl overflow-hidden shadow-sm transition-all">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full flex justify-between items-center p-4 text-left font-mono font-bold text-xs hover:bg-bg-elevated transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown size={14} className={`text-accent-finance transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="p-4 pt-0 border-t border-divider bg-bg-base/20 text-xs text-text-secondary leading-relaxed font-sans">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
