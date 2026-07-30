import { Link } from "@tanstack/react-router";
import { Sparkles, Zap, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useReducedMotion, useReducedMotionOverride } from "../../hooks/use-reduced-motion";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

interface ShellProps {
  children: React.ReactNode;
}

export function Shell({ children }: ShellProps) {
  const isReduced = useReducedMotion();
  const [override, setOverride] = useReducedMotionOverride();
  const [liveAnnouncement, setLiveAnnouncement] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    window.addEventListener("contextmenu", handleContextMenu);
    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  const { data: serverSettings } = useQuery({
    queryKey: ["global-settings"],
    queryFn: async () => {
      const res = await api.get("/settings");
      return res.data.data;
    },
    staleTime: 30 * 1000,
  });

  const enabledSections = serverSettings?.enabledSections || {};

  const allNavItems = [
    { label: "Home", path: "/", key: "home" },
    { label: "About", path: "/about", key: "about" },
    { label: "Skills", path: "/skills", key: "skills" },
    { label: "Projects", path: "/projects", key: "projects" },
    { label: "Writing", path: "/writing", key: "blogs" },
    { label: "Journey", path: "/journey", key: "journey" },
    { label: "Tools", path: "/tools", key: "tools" },
  ];

  const navItems = allNavItems.filter((item) => {
    if (item.key === "home") return true;
    return enabledSections[item.key] ?? true;
  });

  const isContactEnabled = enabledSections["contact"] ?? true;

  return (
    <div className={`min-h-screen flex flex-col font-sans ${isReduced ? "motion-disabled" : ""}`}>
      {/* Floating Pill Nav fixed top center */}
      <header className="fixed top-6 left-0 right-0 z-50 px-4 max-w-4xl mx-auto">
        <div className="paper-elevated rounded-full h-14 px-6 flex items-center justify-between shadow-[0_12px_40px_rgba(23,23,23,0.04)] border border-border/80">
          
          {/* Left Brand Mark */}
          <Link to="/" className="flex items-center gap-1.5 font-serif text-lg font-semibold text-text-primary hover:opacity-90 transition-opacity">
            <span className="w-2 h-2 rounded-full bg-accent-terracotta shrink-0" />
            Aniket<span className="text-accent-terracotta">.</span>
          </Link>

          {/* Center (Desktop nav links) */}
          <nav className="hidden lg:flex items-center gap-1 bg-black/5 p-1 rounded-full">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                activeProps={{ 
                  className: "bg-accent-terracotta text-white font-medium" 
                }}
                inactiveProps={{ 
                  className: "text-text-secondary hover:text-text-primary hover:bg-black/5" 
                }}
                className="px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all"
                end={item.path === "/"}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Motion toggle button in the nav */}
            <button
              onClick={() => {
                const nextVal = isReduced ? "off" : "on";
                setOverride(nextVal);
                setLiveAnnouncement(nextVal === "on" ? "Animations reduced" : "Animations enabled");
              }}
              aria-pressed={isReduced}
              aria-label={isReduced ? "Enable animations" : "Reduce animations"}
              className="motion-toggle p-2 rounded-full hover:bg-black/[0.04] text-text-secondary hover:text-text-primary transition-colors cursor-pointer focus:outline-none"
            >
              <span aria-hidden="true">
                {isReduced ? <Zap size={16} /> : <Sparkles size={16} />}
              </span>
            </button>
            <span className="sr-only" aria-live="polite" aria-atomic="true">
              {liveAnnouncement}
            </span>

            {/* Terracotta "Say hi" CTA button */}
            {isContactEnabled && (
              <Link
                to="/contact"
                className="px-4.5 py-2 rounded-full bg-accent-terracotta hover:opacity-90 text-white text-xs font-mono uppercase tracking-wider transition-opacity shadow-sm hidden sm:inline-block"
              >
                Say hi
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden p-2 rounded-full hover:bg-black/5 text-text-secondary hover:text-text-primary cursor-pointer"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        {menuOpen && (
          <div className="mt-2 paper-elevated rounded-3xl p-4 shadow-xl lg:hidden border border-border/80 stagger-container">
            <nav className="flex flex-col gap-1.5">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  activeProps={{ className: "bg-accent-terracotta text-white font-medium" }}
                  inactiveProps={{ className: "text-text-secondary hover:text-text-primary hover:bg-black/5" }}
                  className="px-4 py-2.5 rounded-2xl text-xs font-mono uppercase tracking-wider transition-all"
                  end={item.path === "/"}
                >
                  {item.label}
                </Link>
              ))}
              {isContactEnabled && (
                <>
                  <div className="h-px bg-border/40 my-2" />
                  <Link
                    to="/contact"
                    onClick={() => setMenuOpen(false)}
                    className="w-full text-center py-3 rounded-2xl bg-accent-terracotta hover:opacity-90 text-white text-xs font-mono uppercase tracking-wider transition-opacity"
                  >
                    Say hi
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content Area centered */}
      <main className="flex-grow pt-28 pb-20 px-4 max-w-6xl mx-auto w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/80 bg-bg-surface py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-text-primary">
              Let's build<span className="text-accent-terracotta">.</span>
            </h2>
            <div className="text-xs font-mono text-text-secondary">
              Available · Remote / India
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 text-right">
            <div className="text-[10px] font-mono text-text-muted">
              © {new Date().getFullYear()} ANIKET SAINI · V2.0.0
            </div>
            <div className="flex gap-4 text-xs font-mono">
              <a href="https://github.com/orphanNighWolf" target="_blank" rel="noreferrer" className="text-text-secondary hover:text-accent-terracotta transition-colors">
                GITHUB
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-text-secondary hover:text-accent-terracotta transition-colors">
                LINKEDIN
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
export default Shell;
