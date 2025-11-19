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
} from "@chakra-ui/react";
import ReactDiffViewer from "react-diff-viewer";
import { useTranslation } from "react-i18next";
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

export default function DiffViewer({
  isOpen,
  onClose,
  documentName,
  oldVersion,
  newVersion,
  isLoading,
}: DiffViewerProps) {
  const { t } = useTranslation();
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent maxH="95vh" maxW="95vw" m={4}>
        <ModalHeader>
          Comparison for {documentName}
          <HStack mt={2} spacing={3}>
            <Badge colorScheme="blue">Old: {oldVersion.date}</Badge>
            <Badge colorScheme="green">New: {newVersion.date}</Badge>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6} display="flex" flexDirection="column" minH="70vh">
          {isLoading ? (
            <Box
              textAlign="center"
              py={8}
              flex="1"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Spinner size="xl" />
              <Text mt={4}>Loading comparison...</Text>
            </Box>
          ) : oldVersion.content && newVersion.content ? (
            <Box
              flex="1"
              bg="white"
              borderRadius="md"
              overflow="auto"
              border="1px"
              borderColor="gray.200"
              minH="500px"
            >
              <ReactDiffViewer
                oldValue={oldVersion.content}
                newValue={newVersion.content}
                splitView={true}
                showDiffOnly={false}
                leftTitle="Old Version"
                rightTitle="Current Version"
                styles={{
                  diffContainer: {
                    fontSize: "14px",
                    fontFamily: "monospace",
                    height: "100%",
                    overflow: "auto",
                  },
                  diffRemoved: {
                    overflow: "auto",
                  },
                  diffAdded: {
                    overflow: "auto",
                  },
                  line: {
                    fontSize: "14px",
                    fontFamily: "monospace",
                    wordBreak: "break-all",
                  },
                  gutter: {
                    minWidth: "50px",
                  },
                }}
              />
            </Box>
          ) : (
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
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
