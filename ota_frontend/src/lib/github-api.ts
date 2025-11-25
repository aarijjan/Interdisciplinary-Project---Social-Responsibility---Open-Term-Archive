// GitHub API service for OTA repositories
const GITHUB_API_BASE = "https://api.github.com/repos";

export interface GitHubFile {
  name: string;
  path: string;
  type: "file" | "dir";
  download_url: string | null;
}

/**
 * Fetch files from a GitHub repository directory
 */
export const fetchGitHubDirectory = async (
  repo: string,
  path: string = ""
): Promise<GitHubFile[]> => {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/${repo}/contents/${path}`);

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch from GitHub:", error);
    throw error;
  }
};

/**
 * Fetch specific file content from GitHub
 */
export const fetchGitHubFile = async (
  repo: string,
  path: string
): Promise<string> => {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/${repo}/contents/${path}`);

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();

    // GitHub returns base64 encoded content for files
    if (data.content && data.encoding === "base64") {
      const bytes = Uint8Array.from(atob(data.content), (c) => c.charCodeAt(0));

      return new TextDecoder("utf-8").decode(bytes);
    }

    return data.content || "";
  } catch (error) {
    console.error("Failed to fetch file from GitHub:", error);
    throw error;
  }
};
