import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import LoadingState from "@/components/LoadingState";
import EmptyState from "@/components/EmptyState";
import HeroSection from "./components/HeroSection";
import SkillsCarousel from "./components/SkillsCarousel";
import ProjectsSpotlight from "./components/ProjectsSpotlight";
import BlogAndGitHubGrid from "./components/BlogAndGitHubGrid";
import ResearchHighlights from "./components/ResearchHighlights";
import DomainCTAs from "./components/DomainCTAs";

interface Skill {
  _id: string;
  name: string;
  category: string;
  level: number;
}

interface HomeData {
  hero: {
    name: string;
    title: string;
    bio: string;
    location: string;
    avatarUrl?: string;
  };
  featuredSkills: Skill[];
  projects: any[];
  latestBlog: any[];
  research: any[];
  githubActivity: any[];
  mentorshipCta: string;
  contactCta: string;
}

export default function HomePage() {
  const { data, isLoading, error } = useQuery<HomeData>({
    queryKey: ["home-data"],
    queryFn: async () => {
      const response = await api.get("/home");
      return response.data.data;
    },
  });

  if (isLoading) {
    return <LoadingState message="BOOTING_PLATFORM_DASHBOARD..." />;
  }

  if (error || !data) {
    return (
      <EmptyState 
        title="Initialization Error" 
        message="Failed to retrieve home coordinates. Check system backend connectivity." 
      />
    );
  }

  return (
    <div className="space-y-24 page-transition">
      <HeroSection hero={data.hero} />
      <SkillsCarousel skills={data.featuredSkills} />
      <ProjectsSpotlight projects={data.projects} />
      <BlogAndGitHubGrid latestBlog={data.latestBlog} githubActivity={data.githubActivity} />
      <ResearchHighlights research={data.research} />
      <DomainCTAs mentorshipCta={data.mentorshipCta} contactCta={data.contactCta} />
    </div>
  );
}
