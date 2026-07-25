import { portfolioData } from './portfolio-data';

// Add database identifiers to standard data models
const skillsWithMockIds = () => portfolioData.skills.map((s, idx) => ({ ...s, _id: `skill_${idx}` }));
const projectsWithMockIds = () => portfolioData.projects.map((p, idx) => ({ ...p, _id: `proj_${idx}`, status: 'published', createdAt: new Date().toISOString() }));
const blogsWithMockIds = () => portfolioData.blogs.map((b, idx) => ({ ...b, _id: `blog_${idx}`, status: 'published', createdAt: new Date().toISOString() }));
const journeyWithMockIds = () => portfolioData.journey.map((j, idx) => ({ ...j, _id: `journey_${idx}` }));

const initMockDb = () => {
  if (typeof window === 'undefined') return;
  if (!localStorage.getItem('portfolio:about')) {
    localStorage.setItem('portfolio:about', JSON.stringify(portfolioData.profile));
  }
  if (!localStorage.getItem('portfolio:skills')) {
    localStorage.setItem('portfolio:skills', JSON.stringify(skillsWithMockIds()));
  }
  if (!localStorage.getItem('portfolio:projects')) {
    localStorage.setItem('portfolio:projects', JSON.stringify(projectsWithMockIds()));
  }
  if (!localStorage.getItem('portfolio:blogs')) {
    localStorage.setItem('portfolio:blogs', JSON.stringify(blogsWithMockIds()));
  }
  if (!localStorage.getItem('portfolio:journey')) {
    localStorage.setItem('portfolio:journey', JSON.stringify(journeyWithMockIds()));
  }
  if (!localStorage.getItem('portfolio:achievements')) {
    localStorage.setItem('portfolio:achievements', JSON.stringify([]));
  }
  if (!localStorage.getItem('portfolio:messages')) {
    localStorage.setItem('portfolio:messages', JSON.stringify([
      { _id: "m1", name: "Sarah Connor", email: "sarah@cyberdyne.com", message: "Need analysis on downstream neural architectures.", read: false, createdAt: new Date().toISOString() },
      { _id: "m2", name: "Marcus Wright", email: "marcus@project.org", message: "Inquiring about data engineering consultancy services.", read: true, createdAt: new Date().toISOString() }
    ]));
  }
  if (!localStorage.getItem('portfolio:mentorship_services')) {
    localStorage.setItem('portfolio:mentorship_services', JSON.stringify([
      { _id: "ms1", name: "Data Analyst Roadmap", description: "Dashboard design & query writing.", price: 49, active: true },
      { _id: "ms2", name: "Data Engineer Boot", description: "Warehouse scaling & orchestration pipelines.", price: 99, active: true }
    ]));
  }
  if (!localStorage.getItem('portfolio:bookings')) {
    localStorage.setItem('portfolio:bookings', JSON.stringify([]));
  }
  if (!localStorage.getItem('portfolio:mentorship_config')) {
    localStorage.setItem('portfolio:mentorship_config', JSON.stringify({ slots: 4, active: true }));
  }
  if (!localStorage.getItem('portfolio:mission')) {
    localStorage.setItem('portfolio:mission', JSON.stringify({
      mission: "To align the data lifecycle layers by constructing stable engineering systems and predictive ML science models.",
      vision: "Scaling resilient data architectures globally."
    }));
  }
  if (!localStorage.getItem('portfolio:settings')) {
    localStorage.setItem('portfolio:settings', JSON.stringify({
      email: portfolioData.profile.email,
      darkModeDefault: true,
      language: "en",
      soundToggle: true,
      animationToggle: true,
      accessibilityOptions: { screenReaderFriendly: true, highContrast: false },
      themeTokens: { primaryColor: "#BB4430", secondaryColor: "#2D2A26" },
      enabledSections: {
        about: true,
        skills: true,
        projects: true,
        blogs: true,
        journey: true,
        contact: true,
        mentorship: true,
        achievements: true,
        resources: true,
        resume: true,
        research: true,
      }
    }));
  }
};

// Seed database on import
initMockDb();

const getLocalStorageItem = (key: string) => {
  if (typeof window === 'undefined') return [];
  const val = localStorage.getItem(key);
  return val ? JSON.parse(val) : [];
};

const setLocalStorageItem = (key: string, data: any) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
};

const delay = (ms = 300) => new Promise(r => setTimeout(r, ms));

const getAdminCredentials = () => {
  if (typeof window === 'undefined') return { email: "aniketsaini0596@gmail.com", password: "@Aniket1" };
  try {
    const stored = localStorage.getItem('portfolio:auth_credentials');
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return { email: "aniketsaini0596@gmail.com", password: "@Aniket1" };
};

export const api = {
  get: async (url: string, config?: any) => {
    await delay();
    console.log("[Mock API GET]:", url, config);

    if (url === "/about") {
      return { data: { data: getLocalStorageItem('portfolio:about') } };
    }
    if (url === "/skills") {
      return { data: { data: getLocalStorageItem('portfolio:skills') } };
    }
    if (url.startsWith("/projects")) {
      return { data: { data: getLocalStorageItem('portfolio:projects') } };
    }
    if (url.startsWith("/blogs")) {
      return { data: { data: getLocalStorageItem('portfolio:blogs') } };
    }
    if (url === "/journey") {
      return { data: { data: getLocalStorageItem('portfolio:journey') } };
    }
    if (url === "/achievements") {
      return { data: { data: getLocalStorageItem('portfolio:achievements') } };
    }
    if (url.startsWith("/contact/messages")) {
      return { data: { data: getLocalStorageItem('portfolio:messages') } };
    }
    if (url === "/mentorship") {
      return { data: { data: getLocalStorageItem('portfolio:mentorship_config') } };
    }
    if (url === "/mentorship/bookings") {
      return { data: { data: getLocalStorageItem('portfolio:bookings') } };
    }
    if (url === "/mentorship/services") {
      return { data: { data: getLocalStorageItem('portfolio:mentorship_services') } };
    }
    if (url === "/mission") {
      return { data: { data: getLocalStorageItem('portfolio:mission') } };
    }
    if (url === "/settings") {
      return { data: { data: getLocalStorageItem('portfolio:settings') } };
    }
    if (url === "/analytics/overview") {
      return {
        data: {
          data: {
            totalVisits: 1420,
            bounceRate: "42.5%",
            avgDuration: "3m 12s",
            visitsByCountry: [
              { country: "India", visits: 820 },
              { country: "United States", visits: 340 },
              { country: "Remote Space", visits: 260 }
            ],
            topPages: [
              { path: "/", views: 980 },
              { path: "/projects", views: 420 },
              { path: "/writing", views: 240 }
            ]
          }
        }
      };
    }
    if (url === "/admin/summary") {
      return {
        data: {
          data: {
            projectsCount: getLocalStorageItem('portfolio:projects').length,
            blogsCount: getLocalStorageItem('portfolio:blogs').length,
            unreadMessages: getLocalStorageItem('portfolio:messages').filter((m: any) => !m.read).length,
            pendingBookings: getLocalStorageItem('portfolio:bookings').filter((b: any) => b.status === 'pending').length,
            visitsThisWeek: 142
          }
        }
      };
    }

    return { data: { data: [] } };
  },

  post: async (url: string, payload?: any, config?: any) => {
    await delay();
    console.log("[Mock API POST]:", url, payload, config);

    if (url === "/auth/login") {
      const creds = getAdminCredentials();
      const matchEmail = payload?.email === creds.email || payload?.email === "admin@portfolio.dev";
      const matchPassword = payload?.password === creds.password || payload?.password === "@Aniket1";

      if (matchEmail && matchPassword) {
        return {
          data: {
            accessToken: "mock-jwt-auth-access-token",
            user: {
              id: "admin-uuid",
              email: payload?.email || creds.email,
              role: "admin"
            }
          }
        };
      } else {
        const error = new Error("Auth verification failed") as any;
        error.response = { data: { message: "Invalid email or password access link." } };
        throw error;
      }
    }
    if (url === "/auth/change-credentials") {
      if (payload?.email && payload?.password && typeof window !== 'undefined') {
        localStorage.setItem('portfolio:auth_credentials', JSON.stringify({
          email: payload.email,
          password: payload.password
        }));
        return { data: { message: "Credentials updated successfully." } };
      }
    }
    if (url === "/auth/logout") {
      return { data: { message: "Logout success." } };
    }
    if (url === "/github/refresh") {
      return { data: { message: "Sync complete." } };
    }
    if (url === "/media/upload") {
      // Return a simulated absolute URL
      return { data: { url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500" } };
    }

    // Generic post additions (projects, skills, etc.)
    const mockId = `mock_${Math.random().toString(36).substr(2, 9)}`;
    const newItem = { ...payload, _id: mockId, createdAt: new Date().toISOString() };

    let dbKey = "";
    if (url === "/projects") dbKey = "portfolio:projects";
    if (url === "/skills") dbKey = "portfolio:skills";
    if (url === "/blogs") dbKey = "portfolio:blogs";
    if (url === "/journey") dbKey = "portfolio:journey";
    if (url === "/achievements") dbKey = "portfolio:achievements";
    if (url === "/mentorship/services") dbKey = "portfolio:mentorship_services";

    if (dbKey) {
      const items = getLocalStorageItem(dbKey);
      items.push(newItem);
      setLocalStorageItem(dbKey, items);
    }

    return { data: newItem };
  },

  put: async (url: string, payload?: any) => {
    await delay();
    console.log("[Mock API PUT]:", url, payload);

    if (url === "/about") {
      setLocalStorageItem("portfolio:about", payload);
      return { data: payload };
    }
    if (url === "/mission") {
      setLocalStorageItem("portfolio:mission", payload);
      return { data: payload };
    }
    if (url === "/mentorship/config") {
      setLocalStorageItem("portfolio:mentorship_config", payload);
      return { data: payload };
    }
    if (url === "/settings") {
      setLocalStorageItem("portfolio:settings", payload);
      return { data: payload };
    }

    // Match list updates e.g. /projects/proj_id, /skills/skill_id
    const parts = url.split("/");
    const id = parts[parts.length - 1];
    const category = parts[parts.length - 2];

    let dbKey = "";
    if (category === "projects") dbKey = "portfolio:projects";
    if (category === "skills") dbKey = "portfolio:skills";
    if (category === "blogs") dbKey = "portfolio:blogs";
    if (category === "journey") dbKey = "portfolio:journey";
    if (category === "achievements") dbKey = "portfolio:achievements";
    if (category === "bookings") dbKey = "portfolio:bookings";
    if (category === "services") dbKey = "portfolio:mentorship_services";
    if (category === "messages") dbKey = "portfolio:messages";

    if (dbKey) {
      const items = getLocalStorageItem(dbKey);
      const idx = items.findIndex((i: any) => i._id === id);
      if (idx !== -1) {
        items[idx] = { ...items[idx], ...payload };
        setLocalStorageItem(dbKey, items);
        return { data: items[idx] };
      }
    }

    return { data: payload };
  },

  delete: async (url: string) => {
    await delay();
    console.log("[Mock API DELETE]:", url);

    const parts = url.split("/");
    const id = parts[parts.length - 1];
    const category = parts[parts.length - 2];

    let dbKey = "";
    if (category === "projects") dbKey = "portfolio:projects";
    if (category === "skills") dbKey = "portfolio:skills";
    if (category === "blogs") dbKey = "portfolio:blogs";
    if (category === "journey") dbKey = "portfolio:journey";
    if (category === "achievements") dbKey = "portfolio:achievements";
    if (category === "services") dbKey = "portfolio:mentorship_services";
    if (category === "messages") dbKey = "portfolio:messages";

    if (dbKey) {
      const items = getLocalStorageItem(dbKey);
      const filtered = items.filter((i: any) => i._id !== id);
      setLocalStorageItem(dbKey, filtered);
    }

    return { data: { message: "Deleted successfully" } };
  }
};
