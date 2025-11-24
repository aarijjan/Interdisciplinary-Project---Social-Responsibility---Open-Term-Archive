import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  Text,
  Button,
  VStack,
  Spinner,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

interface Commit {
  sha: string;
  date: string;
  message: string;
  author: string;
}

interface VersionSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  documentName: string;
  versions: Commit[];
  onVersionSelect: (commitSha: string) => void;
  isLoading?: boolean;
}

export default function VersionSelector({
  isOpen,
  onClose,
  documentName,
  versions,
  onVersionSelect,
  isLoading = false,
}: VersionSelectorProps) {
  const { t } = useTranslation("translation", {
    keyPrefix: "version-selector",
  });
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{`${t("title")} ${documentName}`}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {isLoading ? (
            <Box textAlign="center" py={4}>
              <Spinner size="lg" />
              <Text mt={2}>{t("loading")}</Text>
            </Box>
          ) : versions.length === 0 ? (
            <Text color="gray.500" textAlign="center" py={4}>
              {t("no-version")}
            </Text>
          ) : (
            <VStack gap={3} align="stretch">
              {versions.map((version, index) => (
                <Box
                  key={version.sha}
                  p={3}
                  border="1px"
                  borderColor="gray.200"
                  borderRadius="md"
                  _hover={{ bg: "gray.50" }}
                >
                  <Text fontWeight="medium">
                    {`${t("version")} ${versions.length - index}`}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {`${t("date")} ${version.date}`}
                  </Text>
                  <Text fontSize="sm" color="gray.600" noOfLines={2}>
                    {`${t("message")} ${version.message}`}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {`${t("author")} ${version.author}`}
                  </Text>
                  <Button
                    size="sm"
                    mt={2}
                    colorScheme="blue"
                    isDisabled={index === 0} // Disable for latest version
                    onClick={() => onVersionSelect(version.sha)}
                  >
                    {index === 0 ? t("current") : t("compare")}
                  </Button>
                </Box>
              ))}
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
