export interface Project {
  slug: string;
  title: string;
  description: string;
  tag: string;
  tagDetail: string;
  techPills: string[];
  links: { label: string; href: string; isPrimary: boolean }[];
  image?: string;
  featured: boolean;
  order: number;
  status: "SHIPPED" | "IN_PROGRESS" | "ARCHIVED";
  /** owner/repo for GitHub API stats lookup, e.g. "iWeslax83/prose". Omit if no public repo. */
  repo?: string;
}

export interface SkillCategory {
  key: string;
  items: string[];
}

export interface StratosUnit {
  name: string;
  detail: string;
}

export interface GitHubStats {
  publicRepos: number;
  contributions: number;
  languages: { name: string; percentage: number; color: string }[];
  contributionGraph: number[][]; // weeks x days, 0-4 activity level
}
