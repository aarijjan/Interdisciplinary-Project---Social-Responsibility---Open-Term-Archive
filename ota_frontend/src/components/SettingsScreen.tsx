import { Box, Heading, Text } from '@chakra-ui/react'

export default function SettingsScreen() {
  return (
    <Box 
      bg="white" 
      p={6} 
      borderRadius="lg" 
      boxShadow="sm"
      border="1px"
      borderColor="gray.100"
    >
      <Heading size="md" color="gray.800" fontWeight="medium" mb={3}>
        Settings
      </Heading>
      <Text color="gray.600" fontSize="sm">
        Application settings and preferences will appear here.
      </Text>
    </Box>
  )
}