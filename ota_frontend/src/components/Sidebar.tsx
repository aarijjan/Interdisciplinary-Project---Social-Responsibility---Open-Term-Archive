import { Flex, Button, Heading } from "@chakra-ui/react";
import { FileText, Settings, Home } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SidebarProps {
  currentScreen: string;
  setCurrentScreen: (screen: "home" | "upload" | "view" | "settings") => void;
  onNavigate?: () => void;
}

export default function Sidebar({
  currentScreen,
  setCurrentScreen,
  onNavigate,
}: SidebarProps) {
  const { t } = useTranslation();
  return (
    <Flex
      direction="column"
      w="64"
      bg="white"
      p={6}
      borderRight="1px"
      borderColor="gray.100"
      gap={4}
    >
      <Heading size="lg" color="gray.900" fontWeight="semibold" mb={4}>
        {t("ota-manager")}
      </Heading>

      <Button
        variant="ghost"
        justifyContent="flex-start"
        leftIcon={<Home size={16} />}
        color={currentScreen === "home" ? "blue.600" : "gray.600"}
        bg={currentScreen === "home" ? "blue.50" : "transparent"}
        _hover={{
          bg: currentScreen === "home" ? "blue.50" : "gray.50",
          color: currentScreen === "home" ? "blue.600" : "gray.700",
        }}
        onClick={() => {
          setCurrentScreen("home");
          onNavigate?.();
        }}
      >
        {t("app.home")}
      </Button>

      {/*<Button
        variant="ghost"
        justifyContent="flex-start"
        leftIcon={<Upload size={16} />}
        color={currentScreen === "upload" ? "blue.600" : "gray.600"}
        bg={currentScreen === "upload" ? "blue.50" : "transparent"}
        _hover={{
          bg: currentScreen === "upload" ? "blue.50" : "gray.50",
          color: currentScreen === "upload" ? "blue.600" : "gray.700",
        }}
        onClick={() => setCurrentScreen("upload")}
      >
        {t("upload")}
      </Button>*/}

      <Button
        variant="ghost"
        justifyContent="flex-start"
        leftIcon={<FileText size={16} />}
        color={currentScreen === "view" ? "blue.600" : "gray.600"}
        bg={currentScreen === "view" ? "blue.50" : "transparent"}
        _hover={{
          bg: currentScreen === "view" ? "blue.50" : "gray.50",
          color: currentScreen === "view" ? "blue.600" : "gray.700",
        }}
        onClick={() => {
          setCurrentScreen("view");
          onNavigate?.();
        }}
      >
        {t("view-versions")}
      </Button>

      <Button
        variant="ghost"
        justifyContent="flex-start"
        leftIcon={<Settings size={16} />}
        color={currentScreen === "settings" ? "blue.600" : "gray.600"}
        bg={currentScreen === "settings" ? "blue.50" : "transparent"}
        _hover={{
          bg: currentScreen === "settings" ? "blue.50" : "gray.50",
          color: currentScreen === "settings" ? "blue.600" : "gray.700",
        }}
        onClick={() => {
          setCurrentScreen("settings");
          onNavigate?.();
        }}
      >
        {t("settings")}
      </Button>
    </Flex>
  );
}
