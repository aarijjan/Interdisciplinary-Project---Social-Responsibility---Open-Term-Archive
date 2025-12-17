import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  Spinner,
  Text,
  Link,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownViewerProps {
  isOpen: boolean;
  onClose: () => void;
  documentName: string;
  content: string | null;
  isLoading: boolean;
}

export default function MarkdownViewer({
  isOpen,
  onClose,
  documentName,
  content,
  isLoading,
}: MarkdownViewerProps) {
  const { t } = useTranslation();

  // Custom renderers for better styling
  const components = {
    h1: ({ node, ...props }: any) => (
      <Text as="h1" fontSize="2xl" fontWeight="bold" mt={4} mb={3} {...props} />
    ),
    h2: ({ node, ...props }: any) => (
      <Text as="h2" fontSize="xl" fontWeight="bold" mt={4} mb={2} {...props} />
    ),
    h3: ({ node, ...props }: any) => (
      <Text as="h3" fontSize="lg" fontWeight="semibold" mt={3} mb={2} {...props} />
    ),
    h4: ({ node, ...props }: any) => (
      <Text as="h4" fontSize="md" fontWeight="medium" mt={3} mb={2} {...props} />
    ),
    p: ({ node, ...props }: any) => (
      <Text as="p" mb={3} lineHeight="tall" {...props} />
    ),
    a: ({ node, ...props }: any) => (
      <Link color="blue.500" textDecoration="underline" _hover={{ color: "blue.600" }} {...props} />
    ),
    ul: ({ node, ...props }: any) => (
      <Box as="ul" pl={5} mb={3} {...props} />
    ),
    ol: ({ node, ...props }: any) => (
      <Box as="ol" pl={5} mb={3} {...props} />
    ),
    li: ({ node, ...props }: any) => (
      <Box as="li" mb={1} {...props} />
    ),
    blockquote: ({ node, ...props }: any) => (
      <Box
        as="blockquote"
        borderLeft="4px"
        borderColor="gray.300"
        pl={4}
        py={1}
        my={3}
        fontStyle="italic"
        bg="gray.50"
        {...props}
      />
    ),
    code: ({ node, inline, ...props }: any) => {
      if (inline) {
        return (
          <Box
            as="code"
            bg="gray.100"
            px={1}
            py={0.5}
            borderRadius="sm"
            fontSize="0.9em"
            fontFamily="monospace"
            {...props}
          />
        );
      }
      return (
        <Box
          as="pre"
          bg="gray.100"
          p={3}
          borderRadius="md"
          overflowX="auto"
          my={3}
          fontSize="sm"
          fontFamily="monospace"
          {...props}
        />
      );
    },
    table: ({ node, ...props }: any) => (
      <Box
        as="table"
        width="100%"
        my={3}
        border="1px"
        borderColor="gray.200"
        borderRadius="md"
        overflow="hidden"
        {...props}
      />
    ),
    th: ({ node, ...props }: any) => (
      <Box
        as="th"
        p={2}
        bg="gray.100"
        fontWeight="bold"
        borderBottom="1px"
        borderColor="gray.200"
        {...props}
      />
    ),
    td: ({ node, ...props }: any) => (
      <Box
        as="td"
        p={2}
        borderBottom="1px"
        borderColor="gray.200"
        {...props}
      />
    ),
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent maxH="90vh">
        <ModalHeader>{documentName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {isLoading ? (
            <Box textAlign="center" py={8}>
              <Spinner size="xl" />
              <Text mt={4}>{t("loading-doc")}</Text>
            </Box>
          ) : content ? (
            <Box
              maxH="70vh"
              overflowY="auto"
              p={4}
              borderRadius="md"
              border="1px"
              borderColor="gray.200"
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={components}
              >
                {content}
              </ReactMarkdown>
            </Box>
          ) : (
            <Text color="gray.500" textAlign="center" py={4}>
              {t("no-content")}
            </Text>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}