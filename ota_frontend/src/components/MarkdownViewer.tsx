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
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

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
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
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
              bg="gray.50"
              p={4}
              borderRadius="md"
              maxH="70vh"
              overflowY="auto"
              whiteSpace="pre-wrap"
              fontFamily="monospace"
              fontSize="sm"
            >
              {content}
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
