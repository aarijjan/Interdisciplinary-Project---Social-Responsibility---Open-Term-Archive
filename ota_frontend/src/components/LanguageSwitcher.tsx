import { Menu, MenuButton, MenuList, MenuItem, Button, HStack, IconButton, Link, Image } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import mastodonIcon from "../assets/mastodon.svg";
import githubIcon from "../assets/github.svg";
import linkedinIcon from "../assets/linkedin.svg";

const LanguageSwitcher = () => {
  const languages = ["en", "de", "fr"];
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("i18nextLng", lang);
  };

  const socialLinks = [
    {
      name: "Mastodon",
      url: "https://mastodon.social/@opentermsarchive",
      icon: mastodonIcon,
    },
    {
      name: "GitHub",
      url: "https://github.com/OpenTermsArchive",
      icon: githubIcon,
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/company/opentermsarchive/",
      icon: linkedinIcon,
    },
  ];

  return (
    <HStack spacing={3}>
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
      
      {socialLinks.map((social) => (
        <Link key={social.name} href={social.url} isExternal>
          <IconButton
            aria-label={social.name}
            icon={
              <Image 
                src={social.icon} 
                alt={social.name}
                boxSize="16px"
              />
            }
            size="sm"
            variant="ghost"
            borderRadius="full"
            _hover={{ bg: "gray.100" }}
          />
        </Link>
      ))}
    </HStack>
  );
};

export default LanguageSwitcher;
