import { Box, Heading, Input, Text, Button, VStack, Flex } from '@chakra-ui/react'

export default function UploadScreen() {
  return (
    <Box 
      bg="white" 
      p={6} 
      borderRadius="lg" 
      boxShadow="sm"
      border="1px"
      borderColor="gray.100"
    >
      <Heading size="md" color="gray.800" fontWeight="medium" mb={4}>
        Upload new Terms
      </Heading>
      
      <Text mb={4} color="gray.600" fontSize="sm">
        Paste URL or upload file.
      </Text>
      
      <VStack gap={4} align="stretch">
        <Input 
          placeholder="Service name" 
          bg="white"
          borderColor="gray.200"
          _hover={{ borderColor: 'gray.300' }}
          _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }}
        />
        <Input 
          placeholder="Document URL" 
          bg="white"
          borderColor="gray.200"
          _hover={{ borderColor: 'gray.300' }}
          _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }}
        />
        
        <Flex gap={3}>
          <Button 
            variant="outline" 
            borderColor="gray.200"
            color="gray.700"
            bg="white"
            _hover={{ bg: 'gray.50', borderColor: 'gray.300' }}
            flex={1}
          >
            Save draft
          </Button>
          <Button 
            colorScheme="blue" 
            bg="blue.600"
            _hover={{ bg: 'blue.700' }}
            flex={1}
          >
            Upload to repo
          </Button>
        </Flex>
      </VStack>
    </Box>
  )
}