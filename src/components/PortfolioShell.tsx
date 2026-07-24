import { Link } from "@tanstack/react-router";
import { Cpu, Github, Linkedin, Menu, X, Database, Terminal, BarChart2 } from "lucide-react";
import { useState } from "react";

interface PortfolioShellProps {
  children: React.ReactNode;
}

export function PortfolioShell({ children }: PortfolioShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Projects", path: "/projects" },
    { label: "Experience", path: "/experience" },
    { label: "Blogs", path: "/blogs" },
    { label: "Journey", path: "/journey" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-bg-base text-text-primary">
      {/* Floating Header */}
      <header className="fixed top-4 left-0 right-0 z-50 px-4 max-w-5xl mx-auto">
        <div className="glass-panel rounded-2xl px-6 h-14 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight hover:opacity-90 transition-opacity">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-engineer to-accent-scientist flex items-center justify-center text-white">
              <Cpu size={16} />
            </div>
            <span className="font-mono text-xs font-bold uppercase tracking-wider hidden sm:inline text-text-primary">
              ANIKET SAINI // CS_DATA
            </span>
            <span className="font-mono text-xs font-bold uppercase tracking-wider inline sm:hidden text-text-primary">
              AS // DATA
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                activeProps={{ className: "text-accent-engineer font-semibold" }}
                inactiveProps={{ className: "text-text-secondary hover:text-text-primary" }}
                className="text-xs uppercase font-mono tracking-wider transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Section: Socials & Menu Toggle */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/orphanNighWolf"
              target="_blank"
              rel="noreferrer"
              className="text-text-secondary hover:text-text-primary transition-colors hidden sm:block"
            >
              <Github size={18} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="text-text-secondary hover:text-text-primary transition-colors hidden sm:block"
            >
              <Linkedin size={18} />
            </a>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-text-secondary hover:text-text-primary focus:outline-none cursor-pointer"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {menuOpen && (
          <div className="mt-2 glass-panel rounded-2xl p-4 shadow-xl md:hidden border border-border/40 stagger-container">
            <nav className="flex flex-col gap-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  activeProps={{ className: "text-accent-engineer font-semibold bg-bg-elevated" }}
                  inactiveProps={{ className: "text-text-secondary hover:text-text-primary hover:bg-bg-elevated/40" }}
                  className="px-3 py-2 rounded-lg text-xs uppercase font-mono tracking-wider transition-all"
                >
                  {item.label}
                </Link>
              ))}
              <div className="h-px bg-border/40 my-1" />
              <div className="flex gap-4 px-3 py-1">
                <a href="https://github.com/orphanNighWolf" target="_blank" rel="noreferrer" className="text-text-secondary hover:text-text-primary">
                  <Github size={18} />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-text-secondary hover:text-text-primary">
                  <Linkedin size={18} />
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-grow pt-24 pb-16 px-4 max-w-5xl mx-auto w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 px-4 bg-bg-surface mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-text-muted">
          <div>
            © {new Date().getFullYear()} ANIKET SAINI. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-accent-analyst">
              <BarChart2 size={12} /> Analyst
            </div>
            <div className="flex items-center gap-1 text-accent-engineer">
              <Database size={12} /> Engineer
            </div>
            <div className="flex items-center gap-1 text-accent-scientist">
              <Terminal size={12} /> Scientist
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
