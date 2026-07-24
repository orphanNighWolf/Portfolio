import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BarChart3,
  Mail,
  Newspaper,
  FolderGit2,
  BookOpen,
  Layers,
  GraduationCap,
  Users,
  FileText,
  Award,
  Settings,
  LogOut,
  Activity,
  ChevronLeft,
} from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { api } from "@/lib/axios";

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: "Dashboard", path: "/admin", icon: <LayoutDashboard size={16} /> },
  { label: "Analytics", path: "/admin/analytics", icon: <BarChart3 size={16} /> },
  { label: "Messages", path: "/admin/messages", icon: <Mail size={16} /> },
  { label: "Projects", path: "/admin/projects", icon: <FolderGit2 size={16} /> },
  { label: "Blogs", path: "/admin/blogs", icon: <Newspaper size={16} /> },
  { label: "Research", path: "/admin/research", icon: <BookOpen size={16} /> },
  { label: "Resources", path: "/admin/resources", icon: <Layers size={16} /> },
  { label: "Skills", path: "/admin/skills", icon: <GraduationCap size={16} /> },
  { label: "Mentorship", path: "/admin/mentorship", icon: <Users size={16} /> },
  { label: "Resume", path: "/admin/resume", icon: <FileText size={16} /> },
  { label: "Journey", path: "/admin/journey", icon: <Activity size={16} /> },
  { label: "Achievements", path: "/admin/achievements", icon: <Award size={16} /> },
  { label: "About", path: "/admin/about", icon: <Users size={16} /> },
  { label: "Mission", path: "/admin/mission", icon: <BookOpen size={16} /> },
  { label: "Socials", path: "/admin/socials", icon: <Users size={16} /> },
  { label: "Settings", path: "/admin/settings", icon: <Settings size={16} /> },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      logout();
      navigate("/login");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] gap-0 -mx-6 -my-12">
      {/* Sidebar */}
      <aside
        className={`bg-admin-bg-aside border-r border-white/5 flex flex-col shrink-0 transition-all duration-300 ${
          collapsed ? "w-14" : "w-56"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-3 py-4 border-b border-white/5">
          {!collapsed && (
            <span className="font-mono text-[10px] text-cyan-400 font-bold uppercase tracking-widest">
              // ADMIN_PANEL
            </span>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-500 hover:text-cyan-400 transition-colors cursor-pointer p-1"
          >
            <ChevronLeft
              size={14}
              className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto py-2 space-y-0.5 px-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-mono transition-all ${
                  isActive
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                    : "text-gray-500 hover:text-gray-300 hover:bg-white/3 border border-transparent"
                } ${collapsed ? "justify-center" : ""}`
              }
              title={collapsed ? item.label : undefined}
            >
              <span className="shrink-0">{item.icon}</span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="border-t border-white/5 p-2">
          <button
            onClick={handleLogout}
            className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-mono text-red-400/70 hover:text-red-400 hover:bg-red-500/5 transition-all w-full cursor-pointer ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LogOut size={14} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}

