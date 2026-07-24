import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { Send, CheckCircle2, AlertCircle, Mail, MapPin } from "lucide-react";
import Button from "@/components/Button";
import { FormInput, FormTextarea, FormLabel } from "@/components/FormElements";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState(""); // hidden field to catch automated spam bots

  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const contactMutation = useMutation({
    mutationFn: async (payload: any) => api.post("/contact", payload),
    onSuccess: () => {
      setSuccess("Message dispatched successfully! A secure link will establish contact shortly.");
      setError(null);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setHoneypot("");
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || err.response?.data?.error || "Failed to submit form.");
      setSuccess(null);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    contactMutation.mutate({
      name,
      email,
      subject,
      message,
      honeypot, // bots will automatically fill this input
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500">
      <div className="border-b border-border pb-4">
        <h1 className="text-h2 font-bold text-text-primary font-display">Connect Session</h1>
        <p className="text-xs text-text-muted mt-1 font-mono">// Open a secure messaging channel for AI consulting, data analytics, or advisory proposals</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 items-start">
        {/* Info Sidebar */}
        <section className="bg-bg-surface border border-border p-6 rounded-2xl space-y-6 md:col-span-1 shadow-md">
          <div className="space-y-4">
            <h2 className="text-[10px] font-bold text-accent-ai uppercase tracking-widest font-mono border-b border-divider pb-2">// Diagnostic Data</h2>
            
            <div className="flex items-start gap-3 text-xs">
              <Mail size={15} className="text-accent-ai mt-0.5 shrink-0" />
              <div className="space-y-0.5 font-mono">
                <span className="text-[9px] text-text-muted block">EMAIL_ENDPOINT</span>
                <a href="mailto:admin@portfolio.dev" className="text-text-primary hover:text-accent-ai transition-colors">
                  admin@portfolio.dev
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3 text-xs">
              <MapPin size={15} className="text-accent-ai mt-0.5 shrink-0" />
              <div className="space-y-0.5 font-mono">
                <span className="text-[9px] text-text-muted block">NODE_LOCATION</span>
                <span className="text-text-primary">San Francisco, CA</span>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="bg-bg-surface border border-border p-6 rounded-2xl space-y-5 md:col-span-2 shadow-md">
          <h2 className="text-[10px] font-bold text-accent-ai uppercase tracking-widest font-mono border-b border-divider pb-2">// Transmit Packets</h2>

          {success ? (
            <div className="bg-success/5 border border-success/20 rounded-xl p-6 flex items-start gap-3 text-success">
              <CheckCircle2 size={20} className="shrink-0 text-success mt-0.5" />
              <div className="space-y-1.5 font-mono">
                <strong className="text-xs uppercase tracking-wide block">Transmission Complete</strong>
                <p className="text-[11px] leading-relaxed text-text-secondary font-sans">
                  {success}
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="flex items-center gap-2 bg-error/10 border border-error/20 text-error text-xs rounded-xl p-4 font-mono">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Honeypot hidden field for bot protection */}
              <input
                type="text"
                name="honeypot"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                style={{ display: "none" }}
                tabIndex={-1}
                autoComplete="off"
              />

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <FormLabel htmlFor="name" required>Sender Name</FormLabel>
                  <FormInput
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter full name"
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
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <FormLabel htmlFor="subject" required>Subject</FormLabel>
                <FormInput
                  id="subject"
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Inquiry focus"
                />
              </div>

              <div className="space-y-1.5">
                <FormLabel htmlFor="message" required>Message Log</FormLabel>
                <FormTextarea
                  id="message"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Provide system descriptions, goals, or proposal criteria..."
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                disabled={contactMutation.isPending}
                icon={<Send size={12} />}
                className="self-start"
              >
                {contactMutation.isPending ? "TRANSMITTING..." : "DISPATCH PACKET"}
              </Button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
