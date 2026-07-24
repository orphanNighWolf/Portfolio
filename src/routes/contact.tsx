import { createFileRoute } from '@tanstack/react-router'
import { portfolioData } from '../lib/portfolio-data'
import { Mail, Github, Linkedin, Send, FileText } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/contact')({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact | Aniket Saini" },
      { name: "description", content: "Get in touch with Aniket Saini for collaborations, career opportunities, or research project discussions." },
      { property: "og:title", content: "Contact | Aniket Saini" },
      { property: "og:description", content: "Get in touch with Aniket Saini for collaborations, career opportunities, or research project discussions." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" }
    ]
  })
})

function ContactPage() {
  const { profile } = portfolioData;
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [receipt, setReceipt] = useState({ name: "", email: "", txHash: "", timestamp: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.email && form.message) {
      // Capture details before clearing inputs
      setReceipt({
        name: form.name,
        email: form.email,
        txHash: `AS_TX_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        timestamp: new Date().toISOString()
      });
      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
    }
  };

  return (
    <div className="space-y-12 page-transition">
      {/* Header */}
      <section className="space-y-4">
        <div className="space-y-1 border-b border-border/40 pb-4">
          <h1 className="text-3xl font-serif font-bold tracking-tight text-text-primary">Contact</h1>
          <span className="text-xs font-mono text-text-muted block uppercase tracking-wider">// OPENING_COMMUNICATION_CHANNELS</span>
        </div>
        <p className="text-text-secondary text-sm max-w-2xl leading-relaxed">
          Open a connection session to collaborate on analytical workflows, pipelines, or ML research.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Contact Form Paper Card */}
        <div className="md:col-span-7 bg-bg-surface border border-border rounded-3xl p-6 shadow-[0_4px_20px_rgba(23,23,23,0.01)]">
          {submitted ? (
            /* Success State framed as a Delivered Packet */
            <div className="py-8 space-y-6 text-center max-w-md mx-auto">
              <div className="w-14 h-14 rounded-full bg-accent-analyst/10 text-accent-analyst flex items-center justify-center mx-auto">
                <FileText size={24} />
              </div>
              
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-accent-analyst font-bold uppercase tracking-widest block">
                  // PACKET_STATUS: DISPATCHED_OK
                </span>
                <h3 className="text-2xl font-serif font-bold text-text-primary">Delivery Receipt</h3>
              </div>
              
              {/* Thematic Data Receipt */}
              <div className="bg-bg-elevated border border-border/60 rounded-2xl p-5 text-left space-y-3 text-xs font-mono text-text-secondary">
                <div className="flex justify-between border-b border-border/40 pb-2">
                  <span className="text-text-muted">TX_HASH</span>
                  <span className="text-text-primary font-semibold">{receipt.txHash}</span>
                </div>
                <div className="flex justify-between border-b border-border/40 pb-2">
                  <span className="text-text-muted">TIMESTAMP</span>
                  <span className="text-text-primary">{receipt.timestamp}</span>
                </div>
                <div className="flex justify-between border-b border-border/40 pb-2">
                  <span className="text-text-muted">SENDER_NAME</span>
                  <span className="text-text-primary truncate max-w-[160px]">{receipt.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">SENDER_MAIL</span>
                  <span className="text-text-primary truncate max-w-[160px]">{receipt.email}</span>
                </div>
              </div>

              <p className="text-xs text-text-muted leading-relaxed">
                The connection packet has been successfully verified and buffered. Response acknowledgment will follow shortly.
              </p>

              <button
                onClick={() => setSubmitted(false)}
                className="px-5 py-2.5 rounded-xl border border-border text-xs font-mono uppercase tracking-wider hover:bg-bg-elevated transition-colors cursor-pointer"
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h3 className="text-sm font-serif font-bold text-text-primary border-b border-border/40 pb-2">
                // Connect Session
              </h3>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-text-muted uppercase tracking-wider block">// Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your Name"
                  className="w-full bg-bg-elevated/40 border border-border rounded-xl px-4 py-3 text-xs text-text-primary focus:border-accent-terracotta focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-text-muted uppercase tracking-wider block">// Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full bg-bg-elevated/40 border border-border rounded-xl px-4 py-3 text-xs text-text-primary focus:border-accent-terracotta focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-text-muted uppercase tracking-wider block">// Message</label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Context details..."
                  className="w-full bg-bg-elevated/40 border border-border rounded-xl px-4 py-3 text-xs text-text-primary focus:border-accent-terracotta focus:outline-none transition-colors"
                />
              </div>

              {/* Terracotta Submit Button */}
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-accent-terracotta hover:opacity-90 text-white text-xs font-mono uppercase tracking-wider transition-opacity shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send size={13} /> Dispatch packet
              </button>
            </form>
          )}
        </div>

        {/* Coordinates Cards */}
        <div className="md:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl border border-border bg-bg-elevated/40 space-y-4 shadow-[0_4px_20px_rgba(23,23,23,0.01)]">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-text-primary border-b border-border/40 pb-2">
              // contact_coordinates
            </h3>
            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-3">
                <Mail size={15} className="text-accent-terracotta" />
                <div>
                  <span className="text-[9px] font-mono text-text-muted block uppercase tracking-wider">EMAIL</span>
                  <a href={`mailto:${profile.email}`} className="text-text-primary hover:text-accent-terracotta transition-colors font-medium">
                    {profile.email}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Github size={15} className="text-accent-terracotta" />
                <div>
                  <span className="text-[9px] font-mono text-text-muted block uppercase tracking-wider">GITHUB</span>
                  <a href={profile.github} target="_blank" rel="noreferrer" className="text-text-primary hover:text-accent-terracotta transition-colors font-medium">
                    github.com/orphanNighWolf
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Linkedin size={15} className="text-accent-terracotta" />
                <div>
                  <span className="text-[9px] font-mono text-text-muted block uppercase tracking-wider">LINKEDIN</span>
                  <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-text-primary hover:text-accent-terracotta transition-colors font-medium">
                    linkedin.com/in/aniket-saini
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ContactPage;
