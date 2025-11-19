import { Button, HStack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const languages = ["en", "de", "fr"];
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <HStack spacing={4}>
      {languages.map((lang) => (
        <Button
          key={lang}
          variant="link"
          colorScheme={currentLang === lang ? "blue" : "gray"}
          fontWeight={currentLang === lang ? "bold" : "normal"}
          onClick={() => changeLanguage(lang)}
        >
          {lang.toUpperCase()}
        </Button>
      ))}
    </HStack>
  );
};

export default LanguageSwitcher;
