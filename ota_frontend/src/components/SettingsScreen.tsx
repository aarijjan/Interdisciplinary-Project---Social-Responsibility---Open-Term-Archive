import { Box, Heading, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

export default function SettingsScreen() {
  const { t } = useTranslation();
  return (
    <Box
      bg="white"
      p={6}
      borderRadius="lg"
      boxShadow="sm"
      border="1px"
      borderColor="gray.100"
    >
      <Heading size="md" color="gray.800" fontWeight="medium" mb={3}>
        {t("settings")}
      </Heading>
      <Text color="gray.600" fontSize="sm">
        {t("settings-description")}
      </Text>
    </Box>
  );
}
