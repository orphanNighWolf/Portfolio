import { createFileRoute } from '@tanstack/react-router'
import { portfolioData } from '../lib/portfolio-data'
import { Mail, Github, Linkedin, Send } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/contact')({ component: ContactPage })

function ContactPage() {
  const { profile } = portfolioData;
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.email && form.message) {
      setSubmitted(true);
      setForm({ name: "", email: "", message: "" });
    }
  };

  return (
    <div className="space-y-12 page-transition">
      {/* Header */}
      <section className="space-y-4">
        <div className="space-y-1 border-b border-border/40 pb-4">
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">Say hello</h1>
          <span className="text-xs font-mono text-text-muted block">// OPENING_COMMUNICATION_CHANNELS</span>
        </div>
        <p className="text-text-secondary text-sm max-w-2xl leading-relaxed">
          Have an idea to collaborate, want to discuss database architectures, or looking for a candidate with data tracks? Drop a message.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Contact Form */}
        <div className="md:col-span-7 bg-bg-surface border border-border/60 rounded-3xl p-6 shadow-sm">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-accent-terracotta/10 text-accent-terracotta flex items-center justify-center mx-auto">
                <Send size={20} />
              </div>
              <h3 className="text-lg font-bold text-text-primary">Message Dispatched</h3>
              <p className="text-xs text-text-secondary max-w-xs mx-auto">
                Your message has been captured. I will get back to you shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 px-4 py-2 rounded-xl border border-border text-xs font-mono hover:bg-bg-elevated transition-colors"
              >
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-text-muted uppercase">// Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your Name"
                  className="w-full bg-bg-elevated border border-border/60 rounded-xl px-4 py-3 text-sm text-text-primary focus:border-accent-terracotta focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-text-muted uppercase">// Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="your.email@example.com"
                  className="w-full bg-bg-elevated border border-border/60 rounded-xl px-4 py-3 text-sm text-text-primary focus:border-accent-terracotta focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-text-muted uppercase">// Message</label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell me about your project..."
                  className="w-full bg-bg-elevated border border-border/60 rounded-xl px-4 py-3 text-sm text-text-primary focus:border-accent-terracotta focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-accent-terracotta hover:opacity-90 text-white text-xs font-mono uppercase tracking-wider transition-opacity shadow-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send size={14} /> Send Message
              </button>
            </form>
          )}
        </div>

        {/* Contact Info */}
        <div className="md:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl border border-border/60 bg-bg-elevated/40 space-y-4">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-text-primary border-b border-border/40 pb-2">
              // contact_coordinates
            </h3>
            <div className="space-y-4 text-xs">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-accent-terracotta" />
                <div>
                  <span className="text-text-muted block font-mono">EMAIL</span>
                  <a href={`mailto:${profile.email}`} className="text-text-primary hover:text-accent-terracotta transition-colors font-medium">
                    {profile.email}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Github size={16} className="text-accent-terracotta" />
                <div>
                  <span className="text-text-muted block font-mono">GITHUB</span>
                  <a href={profile.github} target="_blank" rel="noreferrer" className="text-text-primary hover:text-accent-terracotta transition-colors font-medium">
                    github.com/orphanNighWolf
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Linkedin size={16} className="text-accent-terracotta" />
                <div>
                  <span className="text-text-muted block font-mono">LINKEDIN</span>
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
