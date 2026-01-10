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

export const decodeText = (data: any) => {
  if (data.content && data.encoding === "base64") {
    const bytes = Uint8Array.from(atob(data.content), (c) => c.charCodeAt(0));
    return new TextDecoder("utf-8").decode(bytes);
  }
};

/**
 * Fetch specific file content from GitHub
 * Updated to handle submodules gracefully
 */
export const fetchGitHubFile = async (
  repo: string,
  path: string
): Promise<string> => {
  try {
    console.log(`Fetching file: ${repo}/contents/${path}`);

    const response = await fetch(`${GITHUB_API_BASE}/${repo}/contents/${path}`);

    if (!response.ok) {
      // If file not found, it might be a submodule or symlink
      console.warn(
        `GitHub API error (${response.status}): File not found at ${path}, might be a submodule`
      );

      // Try alternative approach for submodules
      try {
        // Try to get the file content using git trees API
        const commitsResponse = await fetch(
          `${GITHUB_API_BASE}/${repo}/commits?path=${path}&per_page=1`
        );

        if (commitsResponse.ok) {
          const commits = await commitsResponse.json();
          if (commits.length > 0) {
            const treeUrl = commits[0].commit.tree.url + `?recursive=1`;
            const treeResponse = await fetch(treeUrl);

            if (treeResponse.ok) {
              const treeData = await treeResponse.json();
              const fileInTree = treeData.tree.find(
                (item: any) => item.path === path
              );

              if (fileInTree && fileInTree.type === "blob") {
                const blobResponse = await fetch(fileInTree.url);
                if (blobResponse.ok) {
                  const blobData = await blobResponse.json();
                  if (blobData.content && blobData.encoding === "base64") {
                    const bytes = Uint8Array.from(atob(blobData.content), (c) =>
                      c.charCodeAt(0)
                    );
                    return new TextDecoder("utf-8").decode(bytes);
                  }
                }
              }
            }
          }
        }
      } catch (submoduleError) {
        console.error("Alternative fetch also failed:", submoduleError);
      }

      return "";
    }

    const data = await response.json();

    // Check if it's a submodule
    if (data.type === "submodule" || data.submodule_git_url) {
      console.log(`File ${path} is a submodule, cannot fetch content directly`);
      return "";
    }

    // Check if it's a symlink
    if (data.type === "symlink") {
      console.log(`File ${path} is a symlink, target: ${data.target}`);
      // Try to follow symlink
      if (data.target) {
        return fetchGitHubFile(repo, data.target);
      }
      return "";
    }

    // GitHub returns base64 encoded content for files
    return decodeText(data) || "";
    return data.content || "";
  } catch (error) {
    console.error("Failed to fetch file from GitHub:", error);
    // Return empty string instead of throwing to prevent app crashes
    return "";
  }
};
