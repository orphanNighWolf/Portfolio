import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import LoginPage from "./features/auth/LoginPage";
import AdminDashboard from "./features/admin/AdminDashboard";
import AdminLayout from "./features/admin/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import HomePage from "./features/home/HomePage";
import AboutPage from "./features/about/AboutPage";
import MissionPage from "./features/mission/MissionPage";
import SkillsPage from "./features/skills/SkillsPage";
import ProjectsPage from "./features/projects/ProjectsPage";
import ProjectDetailPage from "./features/projects/ProjectDetailPage";
import ResearchPage from "./features/research/ResearchPage";
import ResearchDetailPage from "./features/research/ResearchDetailPage";
import BlogsPage from "./features/blogs/BlogsPage";
import BlogDetailPage from "./features/blogs/BlogDetailPage";
import JourneyPage from "./features/journey/JourneyPage";
import AchievementsPage from "./features/achievements/AchievementsPage";
import ResourcesPage from "./features/resources/ResourcesPage";
import ResourceDetailPage from "./features/resources/ResourceDetailPage";
import GitHubPage from "./features/github/GitHubPage";
import MentorshipPage from "./features/mentorship/MentorshipPage";
import ContactPage from "./features/contact/ContactPage";
import ResumePage from "./features/resume/ResumePage";
import SocialsPage from "./features/socials/SocialsPage";
import SettingsPage from "./features/settings/SettingsPage";
import AssistantPage from "./features/assistant/AssistantPage";

import SectionGuard from "./components/SectionGuard";

// Admin Page Imports
import AdminAboutPage from "./features/admin/AdminAboutPage";
import AdminMissionPage from "./features/admin/AdminMissionPage";
import AdminSkillsPage from "./features/admin/AdminSkillsPage";
import AdminProjectsPage from "./features/admin/AdminProjectsPage";
import AdminResearchPage from "./features/admin/AdminResearchPage";
import AdminBlogsPage from "./features/admin/AdminBlogsPage";
import AdminJourneyPage from "./features/admin/AdminJourneyPage";
import AdminAchievementsPage from "./features/admin/AdminAchievementsPage";
import AdminResourcesPage from "./features/admin/AdminResourcesPage";
import AdminMentorshipPage from "./features/admin/AdminMentorshipPage";
import AdminMessagesPage from "./features/admin/AdminMessagesPage";
import AdminResumePage from "./features/admin/AdminResumePage";
import AdminSocialsPage from "./features/admin/AdminSocialsPage";
import AdminAnalyticsPage from "./features/admin/AdminAnalyticsPage";



export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // ── Public routes ──
      { path: "", element: <HomePage /> },
      { path: "about", element: <SectionGuard section="about"><AboutPage /></SectionGuard> },
      { path: "mission", element: <MissionPage /> },
      { path: "skills", element: <SectionGuard section="skills"><SkillsPage /></SectionGuard> },
      { path: "projects", element: <SectionGuard section="projects"><ProjectsPage /></SectionGuard> },
      { path: "project/:slug", element: <SectionGuard section="projects"><ProjectDetailPage /></SectionGuard> },
      { path: "research", element: <SectionGuard section="research"><ResearchPage /></SectionGuard> },
      { path: "research/:slug", element: <SectionGuard section="research"><ResearchDetailPage /></SectionGuard> },
      { path: "github", element: <GitHubPage /> },
      { path: "journey", element: <SectionGuard section="journey"><JourneyPage /></SectionGuard> },
      { path: "achievements", element: <SectionGuard section="achievements"><AchievementsPage /></SectionGuard> },
      { path: "blogs", element: <SectionGuard section="blogs"><BlogsPage /></SectionGuard> },
      { path: "blog/:slug", element: <SectionGuard section="blogs"><BlogDetailPage /></SectionGuard> },
      { path: "mentorship", element: <SectionGuard section="mentorship"><MentorshipPage /></SectionGuard> },
      { path: "resources", element: <SectionGuard section="resources"><ResourcesPage /></SectionGuard> },
      { path: "resource/:slug", element: <SectionGuard section="resources"><ResourceDetailPage /></SectionGuard> },
      { path: "assistant", element: <SectionGuard section="assistant"><AssistantPage /></SectionGuard> },
      { path: "resume", element: <SectionGuard section="resume"><ResumePage /></SectionGuard> },
      { path: "socials", element: <SocialsPage /> },
      { path: "contact", element: <SectionGuard section="contact"><ContactPage /></SectionGuard> },
      { path: "settings", element: <SettingsPage /> },
      { path: "login", element: <LoginPage /> },

      // ── Admin layout shell (all admin routes nested under sidebar) ──
      {
        path: "admin",
        element: (
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "analytics", element: <AdminAnalyticsPage /> },
          { path: "about", element: <AdminAboutPage /> },
          { path: "mission", element: <AdminMissionPage /> },
          { path: "skills", element: <AdminSkillsPage /> },
          { path: "projects", element: <AdminProjectsPage /> },
          { path: "research", element: <AdminResearchPage /> },
          { path: "blogs", element: <AdminBlogsPage /> },
          { path: "journey", element: <AdminJourneyPage /> },
          { path: "achievements", element: <AdminAchievementsPage /> },
          { path: "resources", element: <AdminResourcesPage /> },
          { path: "mentorship", element: <AdminMentorshipPage /> },
          { path: "messages", element: <AdminMessagesPage /> },
          { path: "resume", element: <AdminResumePage /> },
          { path: "socials", element: <AdminSocialsPage /> },
          { path: "settings", element: <SettingsPage /> },
        ],
      },
    ],
  },
]);
