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

/**
 * A project's copy in another language, merged over the English record by
 * slug. `links` maps an English link label to its translated label; hrefs
 * never change.
 */
export type ProjectCopy = Partial<
  Pick<Project, "title" | "description" | "tagDetail" | "techPills">
> & { links?: Record<string, string> };

export interface StratosUnit {
  name: string;
  detail: string;
}

export interface GitHubStats {
  publicRepos: number;
  /** null means unknown (no token or API failure), never a stand-in zero. */
  contributions: number | null;
  languages: { name: string; percentage: number; color: string }[];
}
