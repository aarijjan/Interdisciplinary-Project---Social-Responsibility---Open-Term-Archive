import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Box, Text, Button, VStack } from '@chakra-ui/react'

interface DocumentModalProps {
  isOpen: boolean
  onClose: () => void
  serviceName: string
  documents: Array<{
    name: string
    path: string
  }>
  onDocumentSelect: (documentPath: string) => void
  isLoading?: boolean
  mode?: 'open' | 'compare'
}

export default function DocumentModal({ 
  isOpen, 
  onClose, 
  serviceName, 
  documents, 
  onDocumentSelect,
  isLoading = false, 
  mode = 'open'
}: DocumentModalProps) {
  // Format filename for display (remove .md extension)
  const formatFileName = (filename: string): string => {
    return filename.replace('.md', '').replace(/-/g, ' ')
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Documents for {serviceName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          {documents.length === 0 ? (
            <Text color="gray.500" textAlign="center" py={4}>
              No documents found
            </Text>
          ) : (
            <VStack gap={3} align="stretch">
              {documents.map((doc, index) => (
                <Box 
                  key={index}
                  p={3} 
                  border="1px" 
                  borderColor="gray.200" 
                  borderRadius="md"
                  _hover={{ bg: "gray.50" }}
                >
                  <Text fontWeight="medium">{formatFileName(doc.name)}</Text>
                  <Button 
                    size="sm" 
                    mt={2}
                    colorScheme="blue"
                    onClick={() => onDocumentSelect(doc.path)}
                  >
                    {mode === 'compare' ? 'Select for Comparison' : 'View Document'}
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