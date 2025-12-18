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
} from "@chakra-ui/react";
import { FileText, GitBranch, Shield, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

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
        <SimpleGrid columns={{ base: 1, md: 3, lg: 4 }} spacing={6}>
          <ImageCard image={contribImg} title="Contrib" description="Collection open to all contributions" />
          <ImageCard image={datingImg} title="Dating" description="Online dating services" />
          <ImageCard image={demoImg} title="Demo" description="Services used by Open Terms Archive" />
          <ImageCard image={franceImg} title="France" description="Largest digital services used in France" />
          <ImageCard image={franceelecImg} title="France Élections" description="French election services" />
          <ImageCard image={francepublicImg} title="France Public Services" description="French public services" />
          <ImageCard image={genaiImg} title="Generative AI Contrib" description="Most popular generative AI services" />
          <ImageCard image={germanImg} title="Germany" description="Largest digital services used in Germany" />
          <ImageCard image={healthfranceImg} title="Numérique en santé France" description="French health services" />
          <ImageCard image={kenyaImg} title="Kenya" description="Largest digital services used in Kenya" />
          <ImageCard image={p2bImg} title="P2B Compliance" description="Online intermediation services for businesses in Europe" />
          <ImageCard image={platformgovImg} title="Platform Governance Archive" description="Major global social media services" />
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
    </Box>
  );
}

interface ImageCardProps {
  image: string;
  title: string;
  description: string;
}

function ImageCard({ image, title, description }: ImageCardProps) {
  return (
    <Box
      bg="white"
      p={6}
      borderRadius="lg"
      border="1px"
      borderColor="gray.200"
      _hover={{
        borderColor: "blue.300",
        shadow: "md",
        transform: "translateY(-2px)",
        transition: "all 0.2s",
      }}
      textAlign="center"
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
