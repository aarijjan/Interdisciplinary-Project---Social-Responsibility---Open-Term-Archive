import { useState } from "react";
import {
  Flex,
  Box,
  Heading,
  Button,
  Select,
  Image,
  IconButton,
} from "@chakra-ui/react";
import { GitPullRequest, Menu } from "lucide-react";
import Sidebar from "./components/Sidebar";
import HomeScreen from "./components/HomeScreen";
import UploadScreen from "./components/UploadScreen";
import ViewVersionsScreen from "./components/ViewVersionsScreen";
import SettingsScreen from "./components/SettingsScreen";
import { useCollections } from "./hooks/useCollections";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import otaLogo from "./assets/ota.svg";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<
    "home" | "upload" | "view" | "settings"
  >("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { t } = useTranslation("translation", { keyPrefix: "app" });

  const {
    currentCollection,
    collections,
    services,
    changeCollection,
    pagination,
    changePage,
  } = useCollections();

  return (
    <Flex minH="100vh" bg={currentScreen === "home" ? "rgba(241, 241, 241, 1)" : "gray.50"}>
      {isSidebarOpen && (
        <Sidebar
          currentScreen={currentScreen}
          setCurrentScreen={setCurrentScreen}
          onNavigate={() => setIsSidebarOpen(false)}
        />
      )}

      <Box flex="1" p={10} ml={isSidebarOpen ? "256px" : 0} transition="margin-left 0.3s">
        {/* Top Navigation */}
        <Flex justify="space-between" align="center" mb={-2} bg="white" py={10} mx={-10} mt={-10} px={10}>
          <Flex align="center" gap={4}>
            <IconButton
              aria-label="Toggle sidebar"
              icon={<Menu size={20} />}
              variant="ghost"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              _hover={{ bg: "gray.100" }}
            />
            {currentScreen === "home" && (
              <Image 
                src={otaLogo} 
                alt="OTA Logo"
                height="40px"
                width="auto"
              />
            )}
          </Flex>
          <Box>
            <LanguageSwitcher showSocialIcons={currentScreen === "home"} />
          </Box>
        </Flex>

        {currentScreen !== "home" && (
          <Flex justify="space-between" align="center" mb={8}>
            <Heading size="xl" color="gray.800" fontWeight="semibold">
              Open Terms Archive - {currentCollection.name}
            </Heading>

            <Flex gap={3} align="center">
              {/* Collection selector */}
              <Select
                value={currentCollection.id}
                onChange={(e) => changeCollection(e.target.value)}
                width="300px"
                bg="white"
                borderColor="gray.200"
                borderRadius="lg"
              >
                {collections.map((collection) => (
                  <option key={collection.id} value={collection.id}>
                    {collection.name}
                  </option>
                ))}
              </Select>

              <Button
                colorScheme="blue"
                bg="blue.600"
                _hover={{ bg: "blue.700" }}
                shadow="sm"
                leftIcon={<GitPullRequest size={16} />}
              >
                {t("check-update-btn")}
              </Button>
            </Flex>
          </Flex>
        )}

        {currentScreen === "home" && (
          <HomeScreen onNavigateToViewVersions={() => setCurrentScreen("view")} />
        )}
        {currentScreen === "upload" && <UploadScreen />}
        {currentScreen === "view" && (
          <ViewVersionsScreen
            services={services}
            collection={currentCollection}
            pagination={pagination}
            onPageChange={changePage}
          />
        )}
        {currentScreen === "settings" && <SettingsScreen />}
      </Box>
    </Flex>
  );
}
