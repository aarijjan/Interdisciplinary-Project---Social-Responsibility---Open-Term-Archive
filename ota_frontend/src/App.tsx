import { useState } from "react";
import { Flex, Box, Button, Image } from "@chakra-ui/react";
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
    <Flex
      minH="100vh"
      bg={
        currentScreen === "home" || currentScreen === "view"
          ? "rgba(241, 241, 241, 1)"
          : "gray.50"
      }
    >
      <Box flex="1" p={10}>
        {/* Top Navigation */}
        <Flex
          justify="space-between"
          align="center"
          mb={-2}
          bg="white"
          py={10}
          mx={-10}
          mt={-10}
          px={10}
        >
          <Flex align="center" gap={8}>
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

          <Flex align="center" gap={0}>
            {/* Navigation Links */}
            <Button
              variant="ghost"
              color={currentScreen === "home" ? "blue.600" : "gray.600"}
              fontWeight={currentScreen === "home" ? "semibold" : "normal"}
              _hover={{ color: "blue.600" }}
              onClick={() => setCurrentScreen("home")}
            >
              {t("home")}
            </Button>

            <Button
              variant="ghost"
              color={currentScreen === "view" ? "blue.600" : "gray.600"}
              fontWeight={currentScreen === "view" ? "semibold" : "normal"}
              _hover={{ color: "blue.600" }}
              onClick={() => setCurrentScreen("view")}
            >
              {t("collections")}
            </Button>

            <LanguageSwitcher
              showSocialIcons={
                currentScreen === "home" || currentScreen === "view"
              }
            />
          </Flex>
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
