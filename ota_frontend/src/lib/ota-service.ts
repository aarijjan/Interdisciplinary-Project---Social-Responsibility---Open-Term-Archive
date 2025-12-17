// lib/ota-service.ts
import { decodeText, fetchGitHubDirectory } from "./github-api";

// OTA repository mapping for all collections
export const OTARepositories = {
  contrib: "OpenTermsArchive/contrib-versions",
  "p2b-compliance": "OpenTermsArchive/p2b-compliance-versions",
  france: "OpenTermsArchive/france-versions",
  "generative-ai": "OpenTermsArchive/genai-versions",
  "platform-governance": "OpenTermsArchive/pga-versions",
  dating: "OpenTermsArchive/dating-versions",
  kenya: "OpenTermsArchive/kenya-versions",
  "france-public": "iroco-co/france-public-versions",
  "france-elections": "OpenTermsArchive/france-elections-versions",
  demo: "OpenTermsArchive/demo-versions",
} as const;

// Format service name from folder name
const formatServiceName = (folderName: string): string => {
  return folderName.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

// Fetch real services from OTA repository
export const fetchOTAServices = async (
  collectionId: string
): Promise<Service[]> => {
  try {
    const repo = OTARepositories[collectionId as keyof typeof OTARepositories];

    if (!repo) {
      console.warn(
        `No repository mapping found for collection: ${collectionId}`
      );
      return [];
    }

    console.log(`🔍 Fetching services from: ${repo}`);

    const items = await fetchGitHubDirectory(repo, "");
    console.log("📁 GitHub API response received:", items);

    // Filter for directories only (services)
    const serviceFolders = items.filter((item) => item.type === "dir");

    console.log(
      `📁 Found ${serviceFolders.length} service folders for ${collectionId}`
    );

    // Convert to Service objects
    const services: Service[] = serviceFolders.map((folder) => ({
      id: folder.name,
      name: formatServiceName(folder.name),
      collection: collectionId,
    }));

    console.log(
      `✅ Successfully loaded ${services.length} services for ${collectionId}`
    );
    return services;
  } catch (error) {
    console.error(
      `❌ Failed to fetch OTA services for ${collectionId}:`,
      error
    );
    return [];
  }
};

// Local type definition
interface Service {
  id: string;
  name: string;
  collection: string;
}

// Fetch documents for a specific service
export const fetchServiceDocuments = async (
  collectionId: string,
  serviceId: string
): Promise<Array<{ name: string; path: string }>> => {
  try {
    const repo = OTARepositories[collectionId as keyof typeof OTARepositories];

    if (!repo) {
      console.warn(
        `No repository mapping found for collection: ${collectionId}`
      );
      return [];
    }

    console.log(`🔍 Fetching documents for service: ${serviceId} from ${repo}`);

    const items = await fetchGitHubDirectory(repo, serviceId);
    console.log("📁 Documents response:", items);

    // Filter for .md files only
    const documentFiles = items.filter(
      (item) => item.type === "file" && item.name.endsWith(".md")
    );

    console.log(`📄 Found ${documentFiles.length} documents for ${serviceId}`);

    // Convert to document objects
    const documents = documentFiles.map((file) => ({
      name: file.name,
      path: file.path,
    }));

    return documents;
  } catch (error) {
    console.error(`❌ Failed to fetch documents for ${serviceId}:`, error);
    return [];
  }
};

// Re-export GitHub API functions
export { fetchGitHubFile } from "./github-api";

// Fetch commit history for a specific file
export const fetchFileHistory = async (
  repo: string,
  filePath: string
): Promise<
  Array<{
    sha: string;
    date: string;
    message: string;
    author: string;
  }>
> => {
  try {
    console.log(`🔍 Fetching commit history for: ${filePath} in ${repo}`);

    const response = await fetch(
      `https://api.github.com/repos/${repo}/commits?path=${filePath}`
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const commits = await response.json();
    console.log(`📜 Found ${commits.length} commits for ${filePath}`);

    return commits.map((commit: any) => ({
      sha: commit.sha,
      date: new Date(commit.commit.author.date).toLocaleDateString(),
      message: commit.commit.message,
      author: commit.commit.author.name,
    }));
  } catch (error) {
    console.error(`❌ Failed to fetch commit history for ${filePath}:`, error);
    return [];
  }
};

export const normalizeText = (text: string): string => {
  return text
    .normalize("NFKC")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[ââ]/g, '"')
    .replace(/[ââ]/g, "'")
    .replace(/â¦/g, "...")
    .replace(/â/g, "-")
    .trim();
};

// Get file content from specific commit
export const getFileFromCommit = async (
  repo: string,
  filePath: string,
  commitSha?: string
): Promise<string> => {
  try {
    const url = commitSha
      ? `https://api.github.com/repos/${repo}/contents/${filePath}?ref=${commitSha}`
      : `https://api.github.com/repos/${repo}/contents/${filePath}`;

    console.log(`🔍 Fetching file from: ${url}`);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();

    return decodeText(data) || "";
  } catch (error) {
    console.error(`❌ Failed to get file from commit ${commitSha}:`, error);
    return "";
  }
};
