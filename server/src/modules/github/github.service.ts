import { GitHubCache } from "./github.model";
import pino from "pino";

const logger = pino({
  transport: {
    target: "pino-pretty",
  },
});

const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

export interface GitHubOverviewData {
  username: string;
  profile: {
    name: string;
    avatarUrl: string;
    followers: number;
    publicRepos: number;
    htmlUrl: string;
  };
  repos: Array<{
    name: string;
    description: string;
    htmlUrl: string;
    stars: number;
    forks: number;
    language: string;
    updatedAt: string;
  }>;
  languages: Record<string, number>;
  recentActivity: Array<{
    type: string;
    repoName: string;
    message: string;
    createdAt: string;
  }>;
}

export const defaultFallbackData = (username: string): GitHubOverviewData => ({
  username,
  profile: {
    name: "Alex Mercer",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
    followers: 128,
    publicRepos: 18,
    htmlUrl: `https://github.com/${username}`,
  },
  repos: [
    { name: "AlphaSearch AI", description: "Semantic vector indexer and LLM retrieval pipeline.", htmlUrl: "https://github.com/alex-mercer/asearch-ai", stars: 45, forks: 12, language: "Python", updatedAt: new Date().toISOString() },
    { name: "QuantFlow Engine", description: "High-frequency backtesting platform.", htmlUrl: "https://github.com/alex-mercer/quantflow", stars: 38, forks: 8, language: "Rust", updatedAt: new Date().toISOString() },
    { name: "Decentralized Scheduler Core", description: "Fault-tolerant agent orchestration scheduler.", htmlUrl: "https://github.com/alex-mercer/dscheduler", stars: 27, forks: 5, language: "Go", updatedAt: new Date().toISOString() },
  ],
  languages: { Python: 5, Rust: 3, Go: 2, TypeScript: 4 },
  recentActivity: [
    { type: "commit", repoName: "alex-mercer/asearch-ai", message: "Optimized model quantization loops", createdAt: new Date().toISOString() },
    { type: "commit", repoName: "alex-mercer/quantflow", message: "Resolved lock contention on ring buffers", createdAt: new Date(Date.now() - 3600000).toISOString() },
  ],
});

export async function fetchGitHubFromAPI(username: string): Promise<GitHubOverviewData> {
  const headers: Record<string, string> = {
    "User-Agent": "Portfolio-App-Service",
    Accept: "application/vnd.github+json",
  };

  const token = process.env.GITHUB_TOKEN;
  if (token && token !== "mock_github_personal_access_token") {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // 1. Fetch Profile
  const profileRes = await fetch(`https://api.github.com/users/${username}`, { headers });
  if (!profileRes.ok) {
    throw new Error(`GitHub Profile API responded with status ${profileRes.status}`);
  }
  const profileData = await profileRes.json() as any;

  // 2. Fetch Repositories
  const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers });
  if (!reposRes.ok) {
    throw new Error(`GitHub Repos API responded with status ${reposRes.status}`);
  }
  const rawRepos = await reposRes.json() as any[];

  // Map and sort repos by stars descending
  const repos = rawRepos
    .map((r: any) => ({
      name: r.name,
      description: r.description || "",
      htmlUrl: r.html_url,
      stars: r.stargazers_count || 0,
      forks: r.forks_count || 0,
      language: r.language || "",
      updatedAt: r.updated_at,
    }))
    .sort((a, b) => b.stars - a.stars);

  // Group languages from ALL repositories
  const languages: Record<string, number> = {};
  rawRepos.forEach((r: any) => {
    if (r.language) {
      languages[r.language] = (languages[r.language] || 0) + 1;
    }
  });

  // 3. Fetch Events for commit history
  const eventsRes = await fetch(`https://api.github.com/users/${username}/events`, { headers });
  const recentActivity: any[] = [];
  if (eventsRes.ok) {
    const events = await eventsRes.json() as any[];
    events
      .filter((e: any) => e.type === "PushEvent")
      .forEach((e: any) => {
        const commits = e.payload?.commits || [];
        const message = commits[0]?.message || "Pushed updates";
        recentActivity.push({
          type: "commit",
          repoName: e.repo?.name || "",
          message,
          createdAt: e.created_at,
        });
      });
  }

  return {
    username,
    profile: {
      name: profileData.name || profileData.login,
      avatarUrl: profileData.avatar_url || "",
      followers: profileData.followers || 0,
      publicRepos: profileData.public_repos || 0,
      htmlUrl: profileData.html_url,
    },
    repos: repos.slice(0, 10),
    languages,
    recentActivity: recentActivity.slice(0, 10),
  };
}

export async function getGitHubData(username: string, forceRefresh = false): Promise<GitHubOverviewData> {
  try {
    const cached = await GitHubCache.findOne({ username });

    if (cached && !forceRefresh) {
      const age = Date.now() - new Date((cached as any).updatedAt).getTime();
      if (age < CACHE_TTL_MS) {
        logger.info(`Serving fresh cached GitHub data for ${username}.`);
        return cached.toObject() as unknown as GitHubOverviewData;
      }
      logger.info(`Cached GitHub data for ${username} is expired. Re-fetching.`);
    }

    try {
      logger.info(`Querying GitHub REST API for ${username}...`);
      const freshData = await fetchGitHubFromAPI(username);
      
      await GitHubCache.findOneAndUpdate(
        { username },
        {
          username,
          profile: freshData.profile,
          repos: freshData.repos,
          languages: freshData.languages,
          recentActivity: freshData.recentActivity,
        },
        { upsert: true, new: true }
      );

      logger.info(`Successfully cached fresh GitHub data for ${username}.`);
      return freshData;
    } catch (apiError) {
      logger.warn({ err: apiError }, `GitHub API query failed for ${username}. Reverting to cached snapshot.`);
      if (cached) {
        return cached.toObject() as unknown as GitHubOverviewData;
      }
      logger.warn(`No cache exists for ${username}. Serving mock default structure.`);
      return defaultFallbackData(username);
    }
  } catch (dbError) {
    logger.error({ err: dbError }, "Database error in getGitHubData");
    return defaultFallbackData(username);
  }
}
