// components/ViewVersionsScreen.tsx
import { useState, useMemo, useEffect } from "react";
import {
  Box,
  Heading,
  Input,
  Text,
  Button,
  VStack,
  Flex,
  HStack,
  Select,
  Image,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { Search, FileText, GitCompare, ArrowUp } from "lucide-react";
import Pagination from "./Pagination";
import DocumentModal from "./DocumentModal";
import MarkdownViewer from "./MarkdownViewer";
import VersionSelector from "./VersionSelector";
import DiffViewer from "./DiffViewer";
import {
  fetchServiceDocuments,
  fetchGitHubFile,
  OTARepositories,
  fetchFileHistory,
  getFileFromCommit,
  normalizeText,
} from "../lib/ota-service";
import { useTranslation } from "react-i18next";
import otaLogo from "../assets/ota.svg";

// Define types locally
interface Service {
  id: string;
  name: string;
  collection: string;
}

interface Collection {
  id: string;
  name: string;
  description: string;
  serviceCount: number;
}

interface ViewVersionsScreenProps {
  services: Service[];
  collection: Collection;
  collections: Collection[];
  onCollectionChange: (collectionId: string) => void;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
  onPageChange: (page: number) => void;
}

export default function ViewVersionsScreen({
  services,
  collection,
  collections,
  onCollectionChange,
  pagination,
  onPageChange,
}: ViewVersionsScreenProps) {
  const { t } = useTranslation("translation", {
    keyPrefix: "view-version-screen",
  });
  const [query, setQuery] = useState("");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [documents, setDocuments] = useState<
    Array<{ name: string; path: string }>
  >([]);
  const [selectedDocument, setSelectedDocument] = useState<{
    name: string;
    content: string;
  } | null>(null);
  const [selectedDocumentForCompare, setSelectedDocumentForCompare] = useState<{
    name: string;
    path: string;
  } | null>(null);
  const [versions, setVersions] = useState<
    Array<{ sha: string; date: string; message: string; author: string }>
  >([]);
  const [oldVersion, setOldVersion] = useState<{
    content: string;
    date: string;
    sha: string;
  } | null>(null);
  const [newVersion, setNewVersion] = useState<{
    content: string;
    date: string;
    sha: string;
  } | null>(null);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [contentLoading, setContentLoading] = useState(false);
  const [versionsLoading, setVersionsLoading] = useState(false);
  const [diffLoading, setDiffLoading] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Modal controls
  const {
    isOpen: isDocumentsOpen,
    onOpen: onDocumentsOpen,
    onClose: onDocumentsClose,
  } = useDisclosure();
  const {
    isOpen: isContentViewerOpen,
    onOpen: onContentViewerOpen,
    onClose: onContentViewerClose,
  } = useDisclosure();
  const {
    isOpen: isVersionsOpen,
    onOpen: onVersionsOpen,
    onClose: onVersionsClose,
  } = useDisclosure();
  const {
    isOpen: isDiffOpen,
    onOpen: onDiffOpen,
    onClose: onDiffClose,
  } = useDisclosure();
  const [currentMode, setCurrentMode] = useState<"open" | "compare">("open");

  // Filter services based on search query
  const filteredServices = useMemo(() => {
    return services.filter((service) =>
      service.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [services, query]);

  // Get services for current page
  const paginatedServices = useMemo(() => {
    const startIndex = (pagination.page - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return filteredServices.slice(startIndex, endIndex);
  }, [filteredServices, pagination.page, pagination.pageSize]);

  // Reset to first page when search query changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onPageChange(1); // Reset to first page
  };

  // Open functionality
  const handleOpen = async (service: Service) => {
    setCurrentMode("open");
    setSelectedService(service);
    setDocumentsLoading(true);

    try {
      const serviceDocuments = await fetchServiceDocuments(
        collection.id,
        service.id
      );
      setDocuments(serviceDocuments);
      onDocumentsOpen();
    } catch (error) {
      console.error("Failed to load documents:", error);
      setDocuments([]);
      onDocumentsOpen();
    } finally {
      setDocumentsLoading(false);
    }
  };

  const handleDocumentSelect = async (documentPath: string) => {
    if (!selectedService) return;

    setContentLoading(true);
    onDocumentsClose();

    try {
      const content = await fetchGitHubFile(
        OTARepositories[collection.id as keyof typeof OTARepositories],
        documentPath
      );
      const documentName = documentPath.split("/").pop() || "Document";
      const normalizedContent = normalizeText(content);
      setSelectedDocument({ name: documentName, content: normalizedContent });
      onContentViewerOpen();
    } catch (error) {
      console.error("Failed to load document content:", error);
      setSelectedDocument({
        name: "Error",
        content: "Failed to load document",
      });
      onContentViewerOpen();
    } finally {
      setContentLoading(false);
    }
  };

  // Compare functionality
  const handleCompare = async (service: Service) => {
    setCurrentMode("compare");
    setSelectedService(service);
    setDocumentsLoading(true);

    try {
      const serviceDocuments = await fetchServiceDocuments(
        collection.id,
        service.id
      );
      setDocuments(serviceDocuments);
      onDocumentsOpen();
    } catch (error) {
      console.error("Failed to load documents:", error);
      setDocuments([]);
      onDocumentsOpen();
    } finally {
      setDocumentsLoading(false);
    }
  };

  const handleCompareDocumentSelect = async (documentPath: string) => {
    if (!selectedService) return;

    setSelectedDocumentForCompare({
      name: documentPath.split("/").pop() || "Document",
      path: documentPath,
    });

    setVersionsLoading(true);
    onDocumentsClose();

    try {
      const repo =
        OTARepositories[collection.id as keyof typeof OTARepositories];
      const fileVersions = await fetchFileHistory(repo, documentPath);
      setVersions(fileVersions);
      onVersionsOpen();
    } catch (error) {
      console.error("Failed to load versions:", error);
      setVersions([]);
      onVersionsOpen();
    } finally {
      setVersionsLoading(false);
    }
  };

  const handleVersionSelect = async (commitSha: string, commitDate: string) => {
    if (!selectedDocumentForCompare) return;

    setDiffLoading(true);
    onVersionsClose();

    try {
      const repo =
        OTARepositories[collection.id as keyof typeof OTARepositories];

      const [oldContent, newContent] = await Promise.all([
        getFileFromCommit(repo, selectedDocumentForCompare.path, commitSha),
        getFileFromCommit(repo, selectedDocumentForCompare.path), // HEAD версия
      ]);

      setOldVersion({
        content: oldContent,
        date: commitDate,
        sha: commitSha,
      });
      setNewVersion({
        content: newContent,
        date: t("current"),
        sha: "HEAD",
      });

      onDiffOpen();
    } catch (error) {
      console.error("Failed to load versions for comparison:", error);
      setOldVersion(null);
      setNewVersion(null);
      onDiffOpen();
    } finally {
      setDiffLoading(false);
    }
  };

  return (
    <>
      {/* Black Header Bar */}
      <Box
        bg="black"
        color="white"
        py={6}
        px={8}
        mx={-10}
        mt={-3}
        mb={8}
      >
        <Flex justify="space-between" align="center">
          <Heading size="lg" fontWeight="semibold">
            {t("collection-of")} {collection.name}
          </Heading>
          
          <Flex gap={3} align="center">
            {/* Collection selector */}
            <Select
              value={collection.id}
              onChange={(e) => onCollectionChange(e.target.value)}
              width="300px"
              bg="white"
              color="black"
              borderColor="gray.200"
              borderRadius="lg"
            >
              {collections.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.name}
                </option>
              ))}
            </Select>
          </Flex>
        </Flex>
      </Box>

      <Box
        bg="white"
        p={8}
        borderRadius="xl"
        boxShadow="md"
        border="1px"
        borderColor="gray.200"
      >
      <Flex
        mb={6}
        align="start"
        justify="space-between"
        direction={["column", "row"]}
        gap={4}
      >
        <Box>
          <HStack gap={3} mb={3}>
            <Box p={2} bg="blue.50" borderRadius="md" color="blue.600">
              <Search size={20} />
            </Box>
            <Heading size="lg" color="gray.900" fontWeight="bold">
              {t("title", { collectionName: collection.name })}
            </Heading>
          </HStack>
          <Text color="gray.600" fontSize="sm">
            {t(`collection-description.${collection.id}`)}
          </Text>
          <Text color="gray.500" fontSize="sm">
            {t("services-shown", {
              totalServices: services.length,
              filteredServices: filteredServices.length,
            })}
          </Text>
        </Box>

        <Input
          placeholder={t("search-placeholder")}
          value={query}
          onChange={handleSearchChange}
          width={["100%", "320px"]}
          size="lg"
          bg="gray.50"
          border="1px"
          borderColor="gray.200"
          _hover={{ borderColor: "gray.300", bg: "white" }}
          _focus={{
            borderColor: "blue.500",
            boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
            bg: "white",
          }}
          borderRadius="md"
        />
      </Flex>

      <Box>
        {filteredServices.length === 0 ? (
          <Flex
            direction="column"
            align="center"
            justify="center"
            py={16}
            bg="gray.50"
            borderRadius="lg"
            border="1px dashed"
            borderColor="gray.300"
          >
            <Search size={48} color="#CBD5E1" strokeWidth={1.5} />
            <Text color="gray.500" fontSize="lg" mt={4} fontWeight="medium">
              {t("no-services")}
            </Text>
            <Text color="gray.400" fontSize="sm" mt={1}>
              {t("try-adjusting-search")}
            </Text>
          </Flex>
        ) : (
          <>
            <VStack gap={4} align="stretch">
              {paginatedServices.map((service) => (
                <Flex
                  key={service.id}
                  justify="space-between"
                  align="center"
                  p={6}
                  bg="white"
                  borderRadius="lg"
                  border="1px"
                  borderColor="gray.200"
                  transition="all 0.2s"
                  _hover={{
                    borderColor: "blue.300",
                    shadow: "md",
                    transform: "translateY(-2px)",
                  }}
                >
                  <Box>
                    <Text fontWeight="bold" fontSize="lg" color="gray.900" mb={1}>
                      {service.name}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {`${t("collection")} ${service.collection}`}
                    </Text>
                  </Box>
                  <Flex gap={2}>
                    <Button
                      variant="outline"
                      size="sm"
                      borderColor="gray.200"
                      color="gray.700"
                      bg="white"
                      _hover={{ bg: "gray.50", borderColor: "gray.300" }}
                      leftIcon={<FileText size={16} />}
                      onClick={() => handleOpen(service)}
                    >
                      {t("open")}
                    </Button>
                    <Button
                      colorScheme="blue"
                      size="sm"
                      bg="blue.600"
                      _hover={{ bg: "blue.700" }}
                      leftIcon={<GitCompare size={16} />}
                      onClick={() => handleCompare(service)}
                    >
                      {t("compare")}
                    </Button>
                  </Flex>
                </Flex>
              ))}
            </VStack>

            {/* Pagination component */}
            <Pagination
              currentPage={pagination.page}
              totalItems={filteredServices.length}
              pageSize={pagination.pageSize}
              onPageChange={onPageChange}
            />
          </>
        )}
      </Box>

      {/* Document Selection Modal - for both Open and Compare */}
      <DocumentModal
        isOpen={isDocumentsOpen}
        onClose={onDocumentsClose}
        serviceName={selectedService?.name || ""}
        documents={documents}
        onDocumentSelect={(documentPath) => {
          // Determine if this is for Open or Compare based on which button was clicked
          if (currentMode === "compare") {
            handleCompareDocumentSelect(documentPath);
          } else {
            handleDocumentSelect(documentPath);
          }
        }}
        isLoading={documentsLoading}
        mode={currentMode}
      />

      {/* Markdown Content Viewer Modal */}
      <MarkdownViewer
        isOpen={isContentViewerOpen}
        onClose={onContentViewerClose}
        documentName={selectedDocument?.name || ""}
        content={selectedDocument?.content || null}
        isLoading={contentLoading}
      />

      {/* Version Selector Modal */}
      <VersionSelector
        isOpen={isVersionsOpen}
        onClose={onVersionsClose}
        documentName={selectedDocumentForCompare?.name || ""}
        versions={versions}
        onVersionSelect={(sha) => {
          const version = versions.find((v) => v.sha === sha);
          if (version) {
            handleVersionSelect(sha, version.date);
          }
        }}
        isLoading={versionsLoading}
      />

      {/* Diff Viewer Modal */}
      <DiffViewer
        isOpen={isDiffOpen}
        onClose={onDiffClose}
        documentName={selectedDocumentForCompare?.name || ""}
        oldVersion={oldVersion || { content: "", date: "", sha: "" }}
        newVersion={newVersion || { content: "", date: "", sha: "" }}
        isLoading={diffLoading}
      />

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <IconButton
          aria-label="Scroll to top"
          icon={<ArrowUp size={20} />}
          position="fixed"
          bottom={8}
          right={8}
          bg="black"
          color="white"
          borderRadius="full"
          size="lg"
          zIndex={20}
          _hover={{ bg: "gray.800" }}
          onClick={scrollToTop}
        />
      )}
    </Box>
    </>
  );
}
