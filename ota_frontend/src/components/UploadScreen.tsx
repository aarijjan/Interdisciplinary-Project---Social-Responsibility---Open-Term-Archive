import {
  Box,
  Heading,
  Input,
  Text,
  Button,
  VStack,
  Flex,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

interface UploadScreenProps {
  // Add props later
}

export default function UploadScreen({}: UploadScreenProps) {
  const { t } = useTranslation("translation", { keyPrefix: "upload-screen" });
  return (
    <Box
      bg="white"
      p={6}
      borderRadius="lg"
      boxShadow="sm"
      border="1px"
      borderColor="gray.100"
    >
      <Heading size="md" color="gray.800" fontWeight="medium" mb={4}>
        {t("title")}
      </Heading>

      <Text mb={4} color="gray.600" fontSize="sm">
        {t("description")}
      </Text>

      <VStack gap={4} align="stretch">
        <Input
          placeholder={t("service-field-placeholder")}
          bg="white"
          borderColor="gray.200"
          _hover={{ borderColor: "gray.300" }}
          _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
        />
        <Input
          placeholder={t("url-field-placeholder")}
          bg="white"
          borderColor="gray.200"
          _hover={{ borderColor: "gray.300" }}
          _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px blue.500" }}
        />

        <Flex gap={3}>
          <Button
            variant="outline"
            borderColor="gray.200"
            color="gray.700"
            bg="white"
            _hover={{ bg: "gray.50", borderColor: "gray.300" }}
            flex={1}
          >
            {t("save-draft")}
          </Button>
          <Button
            colorScheme="blue"
            bg="blue.600"
            _hover={{ bg: "blue.700" }}
            flex={1}
          >
            {t("upload-btn")}
          </Button>
        </Flex>
      </VStack>
    </Box>
  );
}
