import { Box, Heading, Text, VStack, Container, SimpleGrid, Flex } from '@chakra-ui/react'
import { FileText, GitBranch, Shield, Clock } from 'lucide-react'

export default function HomeScreen() {
  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={12} align="stretch">
        {/* Hero Section */}
        <Box textAlign="center" py={8}>
          <Heading 
            size="2xl" 
            color="gray.900" 
            fontWeight="bold" 
            mb={4}
          >
            Open Terms Archive Manager
          </Heading>
          <Text 
            fontSize="xl" 
            color="gray.600" 
            maxW="3xl" 
            mx="auto"
            lineHeight="tall"
          >
            Track and archive changes to Terms of Service and Privacy Policies. 
            Monitor how online services evolve their legal documents over time.
          </Text>
        </Box>

        {/* Features Grid */}
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
          <FeatureCard
            icon={<FileText size={32} />}
            title="Document Tracking"
            description="Automatically track and archive versions of Terms of Service, Privacy Policies, and other legal documents from online services."
          />
          <FeatureCard
            icon={<GitBranch size={32} />}
            title="Version History"
            description="View complete version history with detailed diffs showing exactly what changed between document versions."
          />
          <FeatureCard
            icon={<Clock size={32} />}
            title="Change Detection"
            description="Get notified when services update their terms. Never miss important changes that might affect your rights."
          />
          <FeatureCard
            icon={<Shield size={32} />}
            title="Transparency"
            description="Promote transparency and accountability by making terms of service changes publicly accessible and verifiable."
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
            About Open Terms Archive
          </Heading>
          <VStack spacing={4} align="stretch">
            <Text color="gray.700" lineHeight="tall">
              Open Terms Archive is an open-source initiative that tracks changes in the terms of 
              service and privacy policies of major online platforms. By archiving these documents 
              over time, we enable researchers, journalists, and users to understand how digital 
              rights evolve.
            </Text>
            <Text color="gray.700" lineHeight="tall">
              This manager interface allows you to upload new documents, view version histories, 
              compare changes between versions, and manage collections of tracked services.
            </Text>
          </VStack>
        </Box>

        {/* Getting Started */}
        <Box>
          <Heading size="lg" color="gray.900" mb={6}>
            Getting Started
          </Heading>
          <VStack spacing={4} align="stretch">
            <StepCard
              number="1"
              title="Upload Documents"
              description="Use the Upload tab to add new Terms of Service or Privacy Policy documents by URL or file upload."
            />
            <StepCard
              number="2"
              title="View Versions"
              description="Browse the View Versions tab to see all tracked documents and their complete version history."
            />
            <StepCard
              number="3"
              title="Compare Changes"
              description="Click on any version to see detailed diffs highlighting what changed between document versions."
            />
          </VStack>
        </Box>
      </VStack>
    </Container>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
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
        borderColor: 'blue.300',
        shadow: 'md',
        transform: 'translateY(-2px)',
        transition: 'all 0.2s'
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
  )
}

interface StepCardProps {
  number: string
  title: string
  description: string
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
  )
}
