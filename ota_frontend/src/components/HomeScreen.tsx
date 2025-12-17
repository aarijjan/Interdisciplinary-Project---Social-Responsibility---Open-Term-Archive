import {
  Box,
  Heading,
  Text,
  VStack,
  Container,
  SimpleGrid,
  Flex,
  Link,
} from "@chakra-ui/react";
import { FileText, GitBranch, Shield, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

interface HomeScreenProps {
  onNavigateToViewVersions?: () => void;
}

export default function HomeScreen({ onNavigateToViewVersions }: HomeScreenProps) {
  const { t } = useTranslation("translation", { keyPrefix: "home" });
  return (
    <Box>
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

      {/* Rest of Content */}
      <Container maxW="container.xl">
        <VStack spacing={12} align="stretch">

        {/* Features Grid */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          <FeatureCard
            icon={<FileText size={32} />}
            title={t("document-tracking-title")}
            description={t("document-tracking-description")}
          />
          <FeatureCard
            icon={<GitBranch size={32} />}
            title={t("version-history-title")}
            description={t("version-history-description")}
          />
          <FeatureCard
            icon={<Clock size={32} />}
            title={t("change-detection-title")}
            description={t("change-detection-description")}
          />
          <FeatureCard
            icon={<Shield size={32} />}
            title={t("transparency-title")}
            description={t("transparency-description")}
          />
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

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
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
    >
      <Flex color="blue.600" mb={4}>
        {icon}
      </Flex>
      <Heading size="md" color="gray.900" mb={3}>
        {title}
      </Heading>
      <Text color="gray.600" lineHeight="tall">
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
