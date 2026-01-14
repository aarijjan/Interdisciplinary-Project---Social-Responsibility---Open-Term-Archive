import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  Text,
  HStack,
  Badge,
  Spinner,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Progress,
  Flex,
  Code,
  Link,
} from "@chakra-ui/react";
import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";
import * as Diff from "diff";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface DiffViewerProps {
  isOpen: boolean;
  onClose: () => void;
  documentName: string;
  oldVersion: {
    content: string;
    date: string;
    sha: string;
  };
  newVersion: {
    content: string;
    date: string;
    sha: string;
  };
  isLoading: boolean;
}

interface DiffChange {
  type: "added" | "removed";
  lines: string[];
  lineNumber: number;
  content: string;
}

// Optimized diff calculation using the 'diff' library
const calculateDiff = (oldText: string, newText: string) => {
  const diff = Diff.diffLines(oldText, newText);

  const changes: DiffChange[] = [];
  let lineNumber = 1;

  diff.forEach((part) => {
    const lines = part.value.split("\n").filter((line) => line !== "");

    if (part.added) {
      changes.push({
        type: "added",
        lines,
        lineNumber,
        content: part.value,
      });
    } else if (part.removed) {
      changes.push({
        type: "removed",
        lines,
        lineNumber,
        content: part.value,
      });
    } else {
      // Unchanged text, just advance line number
      lineNumber += lines.length;
    }
  });

  return {
    diff,
    changes,
    totalChanges: changes.length,
  };
};

// Markdown renderer for diff view
const MarkdownDiffRenderer = ({
  text,
  type,
}: {
  text: string;
  type: string;
}) => {
  if (!text.trim()) return null;

  const textColor =
    type === "removed"
      ? "red.700"
      : type === "added"
      ? "green.700"
      : "gray.800";
  const bgColor =
    type === "removed"
      ? "red.50"
      : type === "added"
      ? "green.50"
      : "transparent";

  const markdownComponents = {
    h1: ({ node, ...props }: any) => (
      <Text as="div" fontSize="sm" fontWeight="bold" mt={1} mb={1} {...props} />
    ),
    h2: ({ node, ...props }: any) => (
      <Text
        as="div"
        fontSize="sm"
        fontWeight="semibold"
        mt={1}
        mb={1}
        {...props}
      />
    ),
    h3: ({ node, ...props }: any) => (
      <Text
        as="div"
        fontSize="xs"
        fontWeight="medium"
        mt={1}
        mb={1}
        {...props}
      />
    ),
    p: ({ node, ...props }: any) => (
      <Text as="div" fontSize="xs" mb={1} {...props} />
    ),
    a: ({ node, ...props }: any) => (
      <Link
        color={
          type === "removed"
            ? "red.600"
            : type === "added"
            ? "green.600"
            : "blue.500"
        }
        textDecoration="underline"
        fontSize="xs"
        _hover={{ opacity: 0.8 }}
        {...props}
      />
    ),
    ul: ({ node, ...props }: any) => (
      <Box as="div" pl={3} mb={1} fontSize="xs" {...props} />
    ),
    ol: ({ node, ...props }: any) => (
      <Box as="div" pl={3} mb={1} fontSize="xs" {...props} />
    ),
    li: ({ node, ...props }: any) => <Box as="div" fontSize="xs" {...props} />,
    code: ({ node, inline, ...props }: any) => {
      if (inline) {
        return (
          <Code
            bg="blackAlpha.100"
            px={1}
            py={0.5}
            borderRadius="sm"
            fontSize="0.8em"
            fontFamily="monospace"
            {...props}
          />
        );
      }
      return (
        <Box
          as="pre"
          bg="blackAlpha.50"
          p={1}
          borderRadius="sm"
          overflowX="auto"
          my={1}
          fontSize="0.7em"
          fontFamily="monospace"
          {...props}
        />
      );
    },
    strong: ({ node, ...props }: any) => (
      <Text as="span" fontWeight="bold" fontSize="xs" {...props} />
    ),
    em: ({ node, ...props }: any) => (
      <Text as="span" fontStyle="italic" fontSize="xs" {...props} />
    ),
  };

  return (
    <Box
      color={textColor}
      bg={bgColor}
      p={1}
      borderRadius="sm"
      fontSize="xs"
      lineHeight="1.3"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={markdownComponents}
      >
        {text}
      </ReactMarkdown>
    </Box>
  );
};

// Compact side-by-side diff with markdown rendering
const CompactVisualDiff = ({
  oldContent,
  newContent,
}: {
  oldContent: string;
  newContent: string;
}) => {
  const { diff } = useMemo(
    () => calculateDiff(oldContent, newContent),
    [oldContent, newContent]
  );

  // Prepare for side-by-side display with alignment
  const displayLines = useMemo(() => {
    const result: Array<{
      left: { text: string; type: "removed" | "unchanged" | "empty" };
      right: { text: string; type: "added" | "unchanged" | "empty" };
      lineNumber: number;
    }> = [];

    let lineNum = 1;
    let i = 0;

    while (i < diff.length) {
      const part = diff[i];

      if (part.removed && i + 1 < diff.length && diff[i + 1].added) {
        // Changed block: removed + added
        const removedLines = part.value.split("\n").filter((l) => l !== "");
        const addedLines = diff[i + 1].value
          .split("\n")
          .filter((l) => l !== "");
        const maxLines = Math.max(removedLines.length, addedLines.length);

        for (let j = 0; j < maxLines; j++) {
          result.push({
            left: {
              text: removedLines[j] || "",
              type: "removed",
            },
            right: {
              text: addedLines[j] || "",
              type: "added",
            },
            lineNumber: lineNum + j,
          });
        }

        lineNum += maxLines;
        i += 2;
      } else if (part.removed) {
        // Only removed
        const lines = part.value.split("\n").filter((l) => l !== "");
        lines.forEach((line) => {
          result.push({
            left: { text: line, type: "removed" },
            right: { text: "", type: "empty" },
            lineNumber: lineNum++,
          });
        });
        i++;
      } else if (part.added) {
        // Only added
        const lines = part.value.split("\n").filter((l) => l !== "");
        lines.forEach((line) => {
          result.push({
            left: { text: "", type: "empty" },
            right: { text: line, type: "added" },
            lineNumber: lineNum++,
          });
        });
        i++;
      } else {
        // Unchanged - SHOW THEM ALL (this is what you wanted)
        const lines = part.value.split("\n").filter((l) => l !== "");
        lines.forEach((line) => {
          result.push({
            left: { text: line, type: "unchanged" },
            right: { text: line, type: "unchanged" },
            lineNumber: lineNum++,
          });
        });
        i++;
      }
    }

    return result;
  }, [diff]);

  const displayLimit = 300;
  const displayData = displayLines.slice(0, displayLimit);
  const hasMoreLines = displayLines.length > displayLimit;

  // Count changes for statistics
  const changeCount = useMemo(() => {
    return displayLines.filter(
      (line) => line.left.type === "removed" || line.right.type === "added"
    ).length;
  }, [displayLines]);
  const { t } = useTranslation("translation", { keyPrefix: "diff-viewer" });

  return (
    <Box>
      {/* Statistics header */}
      <Flex
        justify="space-between"
        align="center"
        mb={3}
        p={2}
        bg="gray.50"
        borderRadius="md"
      >
        <Text fontSize="xs" color="gray.600">
          {t("current-changes", {
            displayLinesLength: displayLines.length,
            changeCount: changeCount,
          })}
        </Text>
        <Badge colorScheme={changeCount > 0 ? "orange" : "green"} fontSize="xs">
          {changeCount > 0
            ? t("changes", { changeCount: changeCount })
            : t("no-changes")}
        </Badge>
      </Flex>

      <Flex
        maxH="500px"
        overflowY="auto"
        bg="white"
        borderRadius="md"
        border="1px"
        borderColor="gray.200"
        fontFamily="monospace"
        fontSize="11px"
        lineHeight="1.3"
      >
        {/* Left column - Old Version */}
        <Box flex={1} borderRight="1px" borderColor="gray.200">
          <Box
            bg="blue.50"
            p={2}
            borderBottom="1px"
            borderColor="gray.200"
            textAlign="center"
            position="sticky"
            top={0}
            zIndex={1}
          >
            <Badge colorScheme="blue" size="sm">
              {t("old-title")}
            </Badge>
          </Box>

          <Box>
            {displayData.map((line, index) => (
              <Flex
                key={index}
                borderBottom="1px"
                borderColor="gray.100"
                _last={{ borderBottom: "none" }}
                _hover={{ bg: "gray.50" }}
                minH="24px"
              >
                <Box
                  w="35px"
                  flexShrink={0}
                  bg="gray.50"
                  color="gray.500"
                  fontSize="9px"
                  textAlign="right"
                  p="2px"
                  pt="3px"
                  borderRight="1px"
                  borderColor="gray.200"
                >
                  {line.left.type !== "empty" ? line.lineNumber : ""}
                </Box>

                <Box flex={1} p="2px" minH="24px">
                  <MarkdownDiffRenderer
                    text={line.left.text}
                    type={line.left.type}
                  />
                </Box>
              </Flex>
            ))}
          </Box>
        </Box>

        {/* Right column - Current Version */}
        <Box flex={1}>
          <Box
            bg="green.50"
            p={2}
            borderBottom="1px"
            borderColor="gray.200"
            textAlign="center"
            position="sticky"
            top={0}
            zIndex={1}
          >
            <Badge colorScheme="green" size="sm">
              {t("current-title")}
            </Badge>
          </Box>

          <Box>
            {displayData.map((line, index) => (
              <Flex
                key={index}
                borderBottom="1px"
                borderColor="gray.100"
                _last={{ borderBottom: "none" }}
                _hover={{ bg: "gray.50" }}
                minH="24px"
              >
                <Box
                  w="35px"
                  flexShrink={0}
                  bg="gray.50"
                  color="gray.500"
                  fontSize="9px"
                  textAlign="right"
                  p="2px"
                  pt="3px"
                  borderRight="1px"
                  borderColor="gray.200"
                >
                  {line.right.type !== "empty" ? line.lineNumber : ""}
                </Box>

                <Box flex={1} p="2px" minH="24px">
                  <MarkdownDiffRenderer
                    text={line.right.text}
                    type={line.right.type}
                  />
                </Box>
              </Flex>
            ))}
          </Box>
        </Box>
      </Flex>

      {hasMoreLines && (
        <Box textAlign="center" p={2} bg="gray.50" borderRadius="md" mt={2}>
          <Text fontSize="xs" color="gray.600">
            {t("lines-shown", {
              displayLimit: displayLimit,
              displayLines: displayLines.length,
            })}
          </Text>
        </Box>
      )}
    </Box>
  );
};

// Text Summary Component
const TextSummaryComponent = ({
  oldContent,
  newContent,
}: {
  oldContent: string;
  newContent: string;
}) => {
  const { diff } = useMemo(
    () => calculateDiff(oldContent, newContent),
    [oldContent, newContent]
  );

  const { t } = useTranslation("translation", { keyPrefix: "diff-viewer" });

  // Filter to show only changes (added or removed)
  const changesOnly = useMemo(
    () => diff.filter((part) => part.added || part.removed),
    [diff]
  );

  const addedLines = diff.filter((part) => part.added).length;
  const removedLines = diff.filter((part) => part.removed).length;
  const totalChanges = addedLines + removedLines;

  return (
    <VStack align="stretch" spacing={4}>
      <Flex
        bg="white"
        p={4}
        borderRadius="md"
        border="1px"
        borderColor="gray.200"
        justify="space-around"
        textAlign="center"
      >
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color="green.600">
            +{addedLines}
          </Text>
          <Text fontSize="sm" color="gray.600">
            {t("lines-added")}
          </Text>
        </Box>
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color="red.600">
            -{removedLines}
          </Text>
          <Text fontSize="sm" color="gray.600">
            {t("lines-removed")}
          </Text>
        </Box>
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color="blue.600">
            {totalChanges}
          </Text>
          <Text fontSize="sm" color="gray.600">
            {t("total-changes")}
          </Text>
        </Box>
      </Flex>

      {totalChanges === 0 ? (
        <Box bg="gray.50" p={6} borderRadius="md" textAlign="center">
          <Check size={32} color="#38A169" />
          <Text mt={3} color="gray.600">
            {t("no-version-changes")}
          </Text>
          <Text fontSize="sm" color="gray.500" mt={1}>
            {t("identical")}
          </Text>
        </Box>
      ) : (
        <Box bg="gray.50" p={4} borderRadius="md" maxH="400px" overflowY="auto">
          <Flex justify="space-between" align="center" mb={2}>
            <Text fontSize="sm" fontWeight="medium">
              {t("change-summary")}
            </Text>
            <Badge colorScheme="blue">
              {changesOnly.length} {t("change-blocks")}
            </Badge>
          </Flex>

          {changesOnly.slice(0, 100).map((part, index) => (
            <Box
              key={index}
              mb={2}
              p={2}
              bg={part.added ? "green.100" : "red.100"}
              borderRadius="sm"
            >
              <Flex align="center" mb={1}>
                <Badge
                  colorScheme={part.added ? "green" : "red"}
                  fontSize="xs"
                  mr={2}
                >
                  {part.added ? "ADDED" : "REMOVED"}
                </Badge>
                <Text fontSize="xs" color="gray.600">
                  {part.value.split("\n").filter((l) => l !== "").length}{" "}
                  {t("lines")}
                </Text>
              </Flex>
              <Text
                fontSize="xs"
                fontFamily="monospace"
                color={part.added ? "green.800" : "red.800"}
                whiteSpace="pre-wrap"
                maxH="100px"
                overflowY="auto"
                bg="white"
                p={1}
                borderRadius="xs"
              >
                {part.value.trim()}
              </Text>
            </Box>
          ))}

          {changesOnly.length > 100 && (
            <Box textAlign="center" p={2} mt={2}>
              <Text color="gray.500" fontSize="sm">
                {t("more-change-blocks", {
                  changesOnlyLength: changesOnly.length - 100,
                })}
              </Text>
            </Box>
          )}
        </Box>
      )}
    </VStack>
  );
};

// File Info Panel
const FileInfoPanel = ({
  oldVersion,
  newVersion,
}: {
  oldVersion: { content: string; date: string; sha: string };
  newVersion: { content: string; date: string; sha: string };
}) => {
  const { t } = useTranslation("translation", { keyPrefix: "diff-viewer" });

  return (
    <Flex
      justify="space-between"
      align="center"
      bg="gray.50"
      p={3}
      borderRadius="md"
      mb={4}
    >
      <VStack align="start" spacing={1}>
        <HStack spacing={2}>
          <Badge colorScheme="blue" size="sm">
            {t("old", { date: oldVersion.date })}
          </Badge>
          <Code fontSize="xs" color="gray.600">
            {oldVersion.sha.slice(0, 8)}
          </Code>
        </HStack>
        <HStack spacing={2}>
          <Badge colorScheme="green" size="sm">
            {t("new", { date: newVersion.date })}
          </Badge>
          <Code fontSize="xs" color="gray.600">
            {newVersion.sha === "HEAD" ? "HEAD" : newVersion.sha.slice(0, 8)}
          </Code>
        </HStack>
      </VStack>

      <VStack align="end" spacing={1}>
        <Text fontSize="xs" color="gray.600">
          {t("oldSize", {
            oldVersionSize: (oldVersion.content.length / 1024).toFixed(1),
          })}
        </Text>
        <Text fontSize="xs" color="gray.600">
          {t("newSize", {
            newVersionSize: (newVersion.content.length / 1024).toFixed(1),
          })}
        </Text>
      </VStack>
    </Flex>
  );
};

export default function DiffViewer({
  isOpen,
  onClose,
  documentName,
  oldVersion,
  newVersion,
  isLoading,
}: DiffViewerProps) {
  const { t } = useTranslation("translation", { keyPrefix: "diff-viewer" });
  const [viewMode, setViewMode] = useState<"visual" | "summary">("visual");
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  // Process content when modal opens
  useEffect(() => {
    if (isOpen && !isLoading && oldVersion.content && newVersion.content) {
      console.log("=== DIFFVIEWER ===");
      console.log("Calculating diff for:", documentName);
      console.log("Old:", oldVersion.content.length, "chars");
      console.log("New:", newVersion.content.length, "chars");

      setIsProcessing(true);

      // Simulate processing time based on file size
      const processTime = Math.min(
        2000,
        Math.max(
          500,
          (oldVersion.content.length + newVersion.content.length) / 100
        )
      );

      const steps = 10;
      const stepTime = processTime / steps;

      const interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + 100 / steps;
          if (next >= 100) {
            clearInterval(interval);
            setIsProcessing(false);
            return 100;
          }
          return next;
        });
      }, stepTime);

      return () => clearInterval(interval);
    }
  }, [isOpen, isLoading, oldVersion.content, newVersion.content, documentName]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      setIsProcessing(false);
    }
  }, [isOpen]);

  // Sanitized content
  const sanitizedOld = useMemo(() => oldVersion.content, [oldVersion.content]);

  const sanitizedNew = useMemo(() => newVersion.content, [newVersion.content]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      closeOnOverlayClick={!isProcessing}
    >
      <ModalOverlay />
      <ModalContent maxH="95vh" maxW="95vw" m={4}>
        <ModalHeader pb={3}>
          <Text fontSize="lg" fontWeight="bold">
            {t("title", { documentName: documentName })}
          </Text>
          {!isLoading && oldVersion.content && newVersion.content && (
            <FileInfoPanel oldVersion={oldVersion} newVersion={newVersion} />
          )}
        </ModalHeader>
        <ModalCloseButton isDisabled={isProcessing} />
        <ModalBody pb={6} display="flex" flexDirection="column" minH="70vh">
          {isLoading || isProcessing ? (
            <Box
              textAlign="center"
              py={8}
              flex="1"
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexDirection="column"
            >
              <Spinner size="xl" mb={4} />
              <Text mb={2}>{t("calculatingDiff")}</Text>
              {isProcessing && (
                <>
                  <Progress
                    value={progress}
                    width="300px"
                    size="sm"
                    colorScheme="blue"
                    mb={2}
                    borderRadius="full"
                  />
                  <Text fontSize="sm" color="gray.500">
                    {progress.toFixed(0)}%
                  </Text>
                </>
              )}
            </Box>
          ) : !oldVersion.content || !newVersion.content ? (
            <Box
              flex="1"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text color="gray.500" textAlign="center" py={4}>
                {t("no-comparison-data")}
              </Text>
            </Box>
          ) : (
            <>
              <Tabs
                index={viewMode === "visual" ? 0 : 1}
                onChange={(index) =>
                  setViewMode(index === 0 ? "visual" : "summary")
                }
                variant="enclosed"
                mb={4}
              >
                <TabList>
                  <Tab>
                    <HStack spacing={2}>
                      <Text>{t("lineByLineDiff")}</Text>
                      <Badge colorScheme="blue">{t("detailed")}</Badge>
                    </HStack>
                  </Tab>
                  <Tab>
                    <HStack spacing={2}>
                      <Text>{t("change-summary")}</Text>
                      <Badge colorScheme="green">{t("overview")}</Badge>
                    </HStack>
                  </Tab>
                </TabList>
                <TabPanels>
                  <TabPanel p={0} pt={4}>
                    <CompactVisualDiff
                      oldContent={sanitizedOld}
                      newContent={sanitizedNew}
                    />
                  </TabPanel>
                  <TabPanel p={0} pt={4}>
                    <TextSummaryComponent
                      oldContent={sanitizedOld}
                      newContent={sanitizedNew}
                    />
                  </TabPanel>
                </TabPanels>
              </Tabs>

              {/* Statistics */}
              <Box mt={6} pt={4} borderTop="1px" borderColor="gray.200">
                <Flex justify="space-between" fontSize="sm" color="gray.600">
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="medium">{t("fileStats")}</Text>
                    <Text>
                      {t("oldChars", {
                        oldVersionChars:
                          oldVersion.content.length.toLocaleString(),
                      })}
                    </Text>
                    <Text>
                      {t("newChars", {
                        newVersionChars:
                          newVersion.content.length.toLocaleString(),
                      })}
                    </Text>
                  </VStack>
                  <VStack align="end" spacing={1}>
                    <Text fontWeight="medium">{t("comparison")}</Text>
                    <Text>{t("splitView")}</Text>
                  </VStack>
                </Flex>
              </Box>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
