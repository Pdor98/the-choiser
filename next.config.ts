import type { NextConfig } from "next";

const isGitHubPagesBuild = process.env.GITHUB_PAGES === "true";
const githubPagesRepo = process.env.GITHUB_PAGES_REPOSITORY ?? "the-choiser";
const normalizedRepo = githubPagesRepo.replace(/^\/+|\/+$/g, "");
const basePath =
  isGitHubPagesBuild && normalizedRepo ? `/${normalizedRepo}` : "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  output: isGitHubPagesBuild ? "export" : undefined,
  trailingSlash: isGitHubPagesBuild,
  skipTrailingSlashRedirect: isGitHubPagesBuild,
  basePath,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
