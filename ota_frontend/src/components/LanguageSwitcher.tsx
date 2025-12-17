import { Menu, MenuButton, MenuList, MenuItem, Button } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const languages = ["en", "de", "fr"];
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("i18nextLng", lang);
  };

  return (
    <Menu>
      <MenuButton as={Button} variant="outline">
        {currentLang.toUpperCase()} ▼
      </MenuButton>
      <MenuList>
        {languages.map((lang) => (
          <MenuItem
            key={lang}
            onClick={() => changeLanguage(lang)}
            fontWeight={currentLang === lang ? "bold" : "normal"}
            bg={currentLang === lang ? "blue.50" : "transparent"}
          >
            {lang.toUpperCase()}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default LanguageSwitcher;
