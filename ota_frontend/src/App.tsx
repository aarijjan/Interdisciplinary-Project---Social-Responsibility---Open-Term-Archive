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
import { useCollections } from "./hooks/useCollections";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import otaLogo from "./assets/ota.svg";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<
    "home" | "upload" | "view"
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

  const handleCardClick = (collectionId: string) => {
    changeCollection(collectionId);
    setCurrentScreen("view");
    // Jump to top instantly when navigating to view versions
    window.scrollTo(0, 0);
  };

  return (
    <Flex minH="100vh" bg={currentScreen === "home" || currentScreen === "view" ? "rgba(241, 241, 241, 1)" : "gray.50"}>
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
            {(currentScreen === "home" || currentScreen === "view") && (
              <Image 
                src={otaLogo} 
                alt="OTA Logo"
                height="40px"
                width="auto"
                cursor="pointer"
                onClick={() => setCurrentScreen("home")}
                _hover={{ opacity: 0.8 }}
              />
            )}
          </Flex>
          <Box>
            <LanguageSwitcher showSocialIcons={currentScreen === "home"} />
          </Box>
        </Flex>

        {currentScreen === "home" && (
          <HomeScreen 
            onNavigateToViewVersions={() => setCurrentScreen("view")} 
            onCardClick={handleCardClick}
          />
        )}
        {currentScreen === "upload" && <UploadScreen />}
        {currentScreen === "view" && (
          <ViewVersionsScreen
            services={services}
            collection={currentCollection}
            collections={collections}
            onCollectionChange={changeCollection}
            pagination={pagination}
            onPageChange={changePage}
          />
        )}
      </Box>
    </Flex>
  );
}
