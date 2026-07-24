import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { Activity, Menu, X, Cpu } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "./lib/axios";


export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  const { data: serverSettings } = useQuery({
    queryKey: ["global-settings"],
    queryFn: async () => {
      const res = await api.get("/settings");
      return res.data.data;
    },
    staleTime: 60 * 1000,
  });

  const enabledSections = serverSettings?.enabledSections || {};

  const isSectionEnabled = (section: string) => {
    return enabledSections[section] ?? true;
  };

  const navLinks = [
    { path: "/about", label: "About", key: "about" },
    { path: "/skills", label: "Skills", key: "skills" },
    { path: "/projects", label: "Projects", key: "projects" },
    { path: "/blogs", label: "Blogs", key: "blogs" },
    { path: "/contact", label: "Contact", key: "contact" },
    { path: "/assistant", label: "Assistant", key: "assistant" },
  ].filter(link => isSectionEnabled(link.key));

  return (
    <div className="min-h-screen flex flex-col bg-bg-base text-text-primary font-body antialiased selection:bg-accent-ai/20 selection:text-accent-ai relative overflow-x-hidden">
      {/* Vivid blue gradient radial top background glow behind floating navbar */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-[#2563EB]/35 to-transparent blur-[130px] pointer-events-none -z-10" />

      {/* Premium Apple Keynote Aesthetic Floating Navbar */}
      <header className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6 md:px-8 flex justify-center pointer-events-none">
        <div className="w-full max-w-5xl pointer-events-auto h-14 px-6 flex items-center justify-between rounded-[20px] border border-white/[0.08] bg-gradient-to-b from-[#17181C] to-[#0B0C0F] shadow-[0_20px_40px_rgba(0,0,0,0.45)] transition-all duration-300">
          
          {/* Logo Brand Link */}
          <Link 
            to="/" 
            className="flex items-center gap-2.5 font-display text-[15px] font-bold text-white tracking-tight hover:text-white/90 transition-colors"
          >
            <div className="relative flex items-center justify-center w-[34px] h-[34px] rounded-[10px] bg-gradient-to-br from-[#60A5FA] to-[#1D4ED8] overflow-hidden shrink-0">
              {/* Soft white glossy reflection highlight near the top */}
              <div className="absolute top-[2px] left-[2px] right-[2px] h-[10px] bg-gradient-to-b from-white/40 to-transparent rounded-[8px]" />
              <Cpu size={15} className="text-white relative z-10" />
            </div>
            <span className="hidden sm:inline">MERCER // INTELLIGENCE</span>
            <span className="inline sm:hidden">M // I</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink 
                key={link.path}
                to={link.path} 
                className={({ isActive }) => 
                  `text-[13px] font-medium transition-colors duration-150 ease-out ${
                    isActive 
                      ? "text-white" 
                      : "text-white/60 hover:text-white"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right CTA / Menu Toggle */}
          <div className="flex items-center gap-4">
            <Link 
              to="/admin" 
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-b from-[#FFFFFF] to-[#E4E6EA] text-[#0B0C0F] text-[13px] font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:opacity-95 transition-opacity"
            >
              {/* Apple Logo SVG */}
              <svg viewBox="0 0 170 170" className="w-3.5 h-3.5 fill-current text-[#0B0C0F]">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.37.13-9.13-1.9-14.27-6.07-2.81-2.38-6.59-6.83-11.35-13.37-5.59-7.7-10.23-16.82-13.92-27.36-3.7-10.53-5.56-20.48-5.56-29.83 0-14.12 3.61-25.56 10.82-34.34 7.21-8.77 16.11-13.21 26.7-13.33 5.37 0 10.88 1.51 16.53 4.54 5.65 3.03 9.4 4.54 11.26 4.54 1.68 0 5.48-1.51 11.41-4.54 5.92-3.03 11.25-4.49 15.99-4.39 12.3.13 22.34 4.63 30.13 13.51-10.07 6.13-15.02 14.7-14.86 25.71.17 8.78 3.32 15.97 9.47 21.56 6.15 5.59 13.37 8.7 21.68 9.32-2.24 6.78-5.16 13.43-8.78 19.98zm-19.46-97.16c0-7.37 2.62-14.2 7.87-20.5 5.25-6.3 11.66-9.97 19.23-11v.83c-.33 7.04-3.03 13.73-8.08 20.08-5.05 6.35-11.45 10.19-19.2 10.59-.11-1.01-.17-2.12-.17-3.33z" />
              </svg>
              <span className="hidden sm:inline">SYSTEM</span>
            </Link>

            {/* Mobile Menu Toggle Hamburger */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden text-white/70 hover:text-white focus:outline-none p-1.5 border border-white/5 rounded-lg focus-visible:border-white/20 cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Collapsible Mobile Navigation Overlay */}
        {mobileMenuOpen && (
          <div className="lg:hidden absolute top-16 left-4 right-4 mt-2 bg-[#17181C] border border-white/[0.08] rounded-2xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.45)] backdrop-blur-lg animate-in slide-in-from-top duration-200 z-50">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `py-2 text-[13px] font-medium transition-colors ${
                      isActive ? "text-white" : "text-white/60 hover:text-white"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <Link
                to="/admin"
                onClick={closeMobileMenu}
                className="w-full py-2.5 px-4 text-center rounded-full bg-gradient-to-b from-[#FFFFFF] to-[#E4E6EA] text-[#0B0C0F] text-[13px] font-semibold shadow-md block"
              >
                SYSTEM ACCESS
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content Area with max-width restriction */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-6 pt-24 md:pt-28 pb-12 flex flex-col justify-center">
        <Outlet />
      </main>

      {/* Rebuilt Visual Footer with Grid & Pulse indicator */}
      <footer className="border-t border-border bg-bg-base py-12 px-6 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-xs font-mono text-text-secondary">
          
          {/* Identity & Copyright */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 text-text-primary hover:text-accent-ai transition-colors font-display font-bold">
              <Activity size={16} className="text-accent-ai" />
              <span>MERCER // INTELLIGENCE</span>
            </Link>
            <p className="text-[11px] text-text-muted leading-relaxed font-sans max-w-xs">
              Premium personal intelligence platform tracking research implementations, data metrics, and system portfolios.
            </p>
            <div className="text-[10px] text-text-muted">
              &copy; {new Date().getFullYear()} MERCER. ALL RIGHTS RESERVED.
            </div>
          </div>

          {/* Links Column A (Content) */}
          <div className="flex flex-col space-y-3 md:pl-12">
            <span className="text-[9px] text-text-muted uppercase tracking-widest font-bold font-sans border-b border-divider pb-1.5 mb-1 max-w-[120px]">
              // Directory
            </span>
            {isSectionEnabled("about") && <Link to="/about" className="hover:text-accent-ai transition-colors">ABOUT PROFILE</Link>}
            {isSectionEnabled("skills") && <Link to="/skills" className="hover:text-accent-ai transition-colors">SKILLS GRID</Link>}
            {isSectionEnabled("projects") && <Link to="/projects" className="hover:text-accent-ai transition-colors">PROJECTS SPIRAL</Link>}
            {isSectionEnabled("blogs") && <Link to="/blogs" className="hover:text-accent-ai transition-colors">BLOG ARTICLES</Link>}
            {isSectionEnabled("contact") && <Link to="/contact" className="hover:text-accent-ai transition-colors">GET IN TOUCH</Link>}
          </div>

          {/* Links Column B (Identity & Configs) */}
          <div className="flex flex-col space-y-3 justify-between">
            <div className="flex flex-col space-y-3">
              <span className="text-[9px] text-text-muted uppercase tracking-widest font-bold font-sans border-b border-divider pb-1.5 mb-1 max-w-[120px]">
                // Identity
              </span>
              <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                <Link to="/socials" className="hover:text-accent-finance transition-colors">SOCIALS GRID</Link>
                <Link to="/mission" className="hover:text-accent-ai transition-colors">OUR MISSION</Link>
                {isSectionEnabled("journey") && <Link to="/journey" className="hover:text-accent-finance transition-colors">MY JOURNEY</Link>}
                <Link to="/settings" className="hover:text-accent-analytics transition-colors">SETTINGS</Link>
              </div>
            </div>

            {/* Pulser Diagnostic status bar */}
            <div className="flex items-center gap-2 pt-4 border-t border-divider md:border-transparent mt-4 md:mt-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
              </span>
              <span className="text-[10px] text-text-muted tracking-wider uppercase">
                SYSTEMS_OPERATIONAL // 200_OK
              </span>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
