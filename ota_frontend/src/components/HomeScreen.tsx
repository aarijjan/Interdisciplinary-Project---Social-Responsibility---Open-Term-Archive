import {
  Box,
  Heading,
  Text,
  VStack,
  Container,
  SimpleGrid,
  Flex,
  Link,
  Image,
  Circle,
  IconButton,
  Collapse,
} from "@chakra-ui/react";
import { ArrowUp, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

// Import all PNG images
import contribImg from "../assets/contrib.png";
import datingImg from "../assets/dating.png";
import demoImg from "../assets/demo.png";
import franceImg from "../assets/france.png";
import franceelecImg from "../assets/franceelec.png";
import francepublicImg from "../assets/Francepublicser.png";
import genaiImg from "../assets/GenAI.png";
import germanImg from "../assets/german.png";
import healthfranceImg from "../assets/healthfrance.png";
import kenyaImg from "../assets/kenya.png";
import p2bImg from "../assets/P2B.png";
import platformgovImg from "../assets/PlatformGov.png";

interface HomeScreenProps {
  onNavigateToViewVersions?: () => void;
}

export default function HomeScreen({ onNavigateToViewVersions }: HomeScreenProps) {
  const { t } = useTranslation("translation", { keyPrefix: "home" });
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  return (
    <Box bg="rgb(241, 241, 241, 1)" minH="100vh">
      {/*Full Width*/}
      <Box
        py={16}
        bg="black"
        mx={-10}
        mb={12}
      >
        <Container maxW="container.xl" pl={8}>
          <Heading size="2xl" color="white" fontWeight="normal" mb={12} textAlign="left" whiteSpace="pre-line" lineHeight="1.3">
            {(() => {
              const text = t("page-title");
              const patterns = [
                "'Accept'",
                "\u201EAkzeptieren\u201C", // German quotes
                "\u00AB Accepter \u00BB"  // French quotes
              ];

              for (const pattern of patterns) {
                if (text.includes(pattern)) {
                  return text.split(pattern).map((part, index, array) => (
                    <span key={index}>
                      {part}
                      {index < array.length - 1 && <strong>{pattern}</strong>}
                    </span>
                  ));
                }
              }

              // Fallback if no pattern matches
              return text;
            })()}
          </Heading>
          <Text
            fontSize="xl"
            color="white"
            maxW="5.5xl"
            lineHeight="tall"
            textAlign="left"
          >
            {t("sub-title")}{" "}
            <Link
              color="blue.500"
              _hover={{ color: "blue.300" }}
              cursor="pointer"
              fontStyle="italic"
              onClick={onNavigateToViewVersions}
            >
              {t("start-comparing-now")}
            </Link>
          </Text>
        </Container>
      </Box>

      {/* Center Text */}
      <Box textAlign="center" py={8}>
        <Text
          fontSize="2xl"
          color="black"
          fontWeight="medium"
          maxW="4xl"
          mx="auto"
          lineHeight="tall"
        >
          {t("center-text")}
        </Text>
      </Box>

      {/* Rest of Content */}
      <Container maxW="container.xl">
        <VStack spacing={12} align="stretch">

          {/* Image Cards Grid */}
          <SimpleGrid columns={{ base: 1, md: 3, lg: 4 }} spacing={6} alignItems="start">
            <ImageCard image={contribImg} title={t("card-title1")} description={t("card-description1")} extendedKey="card-extended1" />
            <ImageCard image={datingImg} title={t("card-title2")} description={t("card-description2")} extendedKey="card-extended2" />
            <ImageCard image={demoImg} title={t("card-title3")} description={t("card-description3")} extendedKey="card-extended3" />
            <ImageCard image={franceImg} title={t("card-title4")} description={t("card-description4")} extendedKey="card-extended4" />
            <ImageCard image={franceelecImg} title={t("card-title5")} description={t("card-description5")} extendedKey="card-extended5" />
            <ImageCard image={francepublicImg} title={t("card-title6")} description={t("card-description6")} extendedKey="card-extended6" />
            <ImageCard image={genaiImg} title={t("card-title7")} description={t("card-description7")} extendedKey="card-extended7" />
            <ImageCard image={germanImg} title={t("card-title8")} description={t("card-description8")} extendedKey="card-extended8" />
            <ImageCard image={healthfranceImg} title={t("card-title9")} description={t("card-description9")} extendedKey="card-extended9" />
            <ImageCard image={kenyaImg} title={t("card-title10")} description={t("card-description10")} extendedKey="card-extended10" />
            <ImageCard image={p2bImg} title={t("card-title11")} description={t("card-description11")} extendedKey="card-extended11" />
            <ImageCard image={platformgovImg} title={t("card-title12")} description={t("card-description12")} extendedKey="card-extended12" />
          </SimpleGrid>

          {/* About Section */}
          <Box
            bg="blue.50"
            p={8}
            borderRadius="lg"
            border="1px"
            borderColor="blue.100"
          >
            <Heading size="lg" color="gray.900" mb={4}>
              {t("about-section-title")}
            </Heading>
            <VStack spacing={4} align="stretch">
              <Text color="gray.700" lineHeight="tall">
                {t("about-section-description-1")}
              </Text>
              <Text color="gray.700" lineHeight="tall">
                {t("about-section-description-2")}
              </Text>
            </VStack>
          </Box>

          {/* Getting Started */}
          <Box>
            <Heading size="lg" color="gray.900" mb={6}>
              {t("getting-started-title")}
            </Heading>
            <VStack spacing={4} align="stretch">
              <StepCard
                number="1"
                title={t("upload-documents-title")}
                description={t("upload-documents-description")}
              />
              <StepCard
                number="2"
                title={t("view-versions-title")}
                description={t("view-versions-description")}
              />
              <StepCard
                number="3"
                title={t("compare-changes-title")}
                description={t("compare-changes-description")}
              />
            </VStack>
          </Box>
        </VStack>
      </Container>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <IconButton
          aria-label="Scroll to top"
          icon={<ArrowUp size={20} />}
          position="fixed"
          bottom={8}
          right={8}
          bg="black"
          color="white"
          borderRadius="full"
          size="lg"
          zIndex={20}
          _hover={{ bg: "gray.800" }}
          onClick={scrollToTop}
        />
      )}
    </Box>
  );
}

interface ImageCardProps {
  image: string;
  title: string;
  description: string;
  extendedKey: string;
}

function ImageCard({ image, title, description, extendedKey }: ImageCardProps) {
  const { t } = useTranslation("translation", { keyPrefix: "home" });
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box
      bg="white"
      p={6}
      borderRadius="lg"
      border="1px"
      borderColor="gray.200"
      textAlign="center"
      transition="all 0.2s"
      _hover={{
        borderColor: "blue.300",
        shadow: "md",
        transform: "translateY(-2px)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Circle size="80px" bg="gray.100" mb={4} mx="auto">
        <Image
          src={image}
          alt={title}
          boxSize="50px"
          objectFit="contain"
        />
      </Circle>

      <Heading size="sm" color="gray.900" mb={2}>
        {title}
      </Heading>

      <Text color="gray.600" fontSize="sm" lineHeight="tall">
        {description}
      </Text>

      <Collapse in={isHovered} animateOpacity>
        <Box mt={3} bg="gray.50" p={3} borderRadius="md">
          <Text
            color="gray.700"
            fontSize="xs"
            lineHeight="tall"
            whiteSpace="pre-line"
          >
            {t(extendedKey)}
          </Text>
        </Box>
      </Collapse>
    </Box>
  );
}

interface StepCardProps {
  number: string;
  title: string;
  description: string;
}

function StepCard({ number, title, description }: StepCardProps) {
  return (
    <Flex
      bg="white"
      p={5}
      borderRadius="lg"
      border="1px"
      borderColor="gray.200"
      gap={4}
      align="start"
    >
      <Flex
        bg="blue.600"
        color="white"
        w={10}
        h={10}
        borderRadius="full"
        align="center"
        justify="center"
        fontWeight="bold"
        flexShrink={0}
      >
        {number}
      </Flex>
      <Box flex={1}>
        <Heading size="sm" color="gray.900" mb={2}>
          {title}
        </Heading>
        <Text color="gray.600" fontSize="sm">
          {description}
        </Text>
      </Box>
    </Flex>
  );
}
