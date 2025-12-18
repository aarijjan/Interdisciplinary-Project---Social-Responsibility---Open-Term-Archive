import { Menu, MenuButton, MenuList, MenuItem, Button, HStack, IconButton, Link, Image } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import mastodonIcon from "../assets/mastodon.svg";
import githubIcon from "../assets/github.svg";
import linkedinIcon from "../assets/linkedin.svg";

interface LanguageSwitcherProps {
  showSocialIcons?: boolean;
}

const LanguageSwitcher = ({ showSocialIcons = false }: LanguageSwitcherProps) => {
  const languages = [
    { code: "en", name: "English", short: "EN" },
    { code: "de", name: "Deutsch", short: "DE" },
    { code: "fr", name: "Français", short: "FR" }
  ];
  const { i18n } = useTranslation();
  const currentLang = i18n.language;

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("i18nextLng", lang);
  };

  const getCurrentLanguageShort = () => {
    const lang = languages.find(l => l.code === currentLang);
    return lang ? lang.short : currentLang.toUpperCase();
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
          {getCurrentLanguageShort()} ▼
        </MenuButton>
        <MenuList>
          {languages.map((lang) => (
            <MenuItem
              key={lang.code}
              onClick={() => changeLanguage(lang.code)}
              fontWeight={currentLang === lang.code ? "bold" : "normal"}
              bg={currentLang === lang.code ? "blue.50" : "transparent"}
            >
              {lang.name}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
      
      {showSocialIcons && socialLinks.map((social) => (
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
