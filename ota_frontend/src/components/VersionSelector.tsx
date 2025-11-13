import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Box, Text, Button, VStack, Spinner } from '@chakra-ui/react'

interface Commit {
  sha: string
  date: string
  message: string
  author: string
}

interface VersionSelectorProps {
  isOpen: boolean
  onClose: () => void
  documentName: string
  versions: Commit[]
  onVersionSelect: (commitSha: string) => void
  isLoading?: boolean
}

export default function VersionSelector({ 
  isOpen, 
  onClose, 
  documentName, 
  versions, 
  onVersionSelect,
  isLoading = false
}: VersionSelectorProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Select version to compare for {documentName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {isLoading ? (
            <Box textAlign="center" py={4}>
              <Spinner size="lg" />
              <Text mt={2}>Loading versions...</Text>
            </Box>
          ) : versions.length === 0 ? (
            <Text color="gray.500" textAlign="center" py={4}>
              No versions found
            </Text>
          ) : (
            <VStack gap={3} align="stretch">
              {versions.map((version, index) => (
                <Box 
                  key={version.sha}
                  p={3} 
                  border="1px" 
                  borderColor="gray.200" 
                  borderRadius="md"
                  _hover={{ bg: "gray.50" }}
                >
                  <Text fontWeight="medium">Version {versions.length - index}</Text>
                  <Text fontSize="sm" color="gray.600">Date: {version.date}</Text>
                  <Text fontSize="sm" color="gray.600" noOfLines={2}>
                    Message: {version.message}
                  </Text>
                  <Text fontSize="sm" color="gray.500">Author: {version.author}</Text>
                  <Button 
                    size="sm" 
                    mt={2}
                    colorScheme="blue"
                    isDisabled={index === 0} // Disable for latest version
                    onClick={() => onVersionSelect(version.sha)}
                  >
                    {index === 0 ? 'Current Version' : 'Compare with Current'}
                  </Button>
                </Box>
              ))}
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}