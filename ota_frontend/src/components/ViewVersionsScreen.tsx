import { useState } from 'react'
import { Box, Heading, Input, Text, Button, VStack, Flex, HStack } from '@chakra-ui/react'
import { Search } from 'lucide-react'

interface Result {
  id: number
  name: string
  last: string
}

const mockResults: Result[] = [
  { id: 1, name: "Example GmbH", last: "2025-05-11" },
  { id: 2, name: "ShopDE", last: "2025-04-30" },
  { id: 3, name: "MediaService", last: "2025-03-20" }
]

export default function ViewVersionsScreen() {
  const [query, setQuery] = useState("")

  const results = mockResults.filter(r => r.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <Box 
      bg="white" 
      p={6} 
      borderRadius="lg" 
      boxShadow="sm"
      border="1px"
      borderColor="gray.100"
    >
      <Flex mb={6} align="center" justify="space-between">
        <HStack gap={3}>
          <Search size={16} color="#64748b" />
          <Heading size="md" color="gray.800" fontWeight="medium">
            Search Companies
          </Heading>
        </HStack>
      </Flex>

      <VStack gap={4} align="stretch">
        <Input
          placeholder="Search companies, services..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          bg="white"
          borderColor="gray.200"
          _hover={{ borderColor: 'gray.300' }}
          _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }}
        />
        
        <Box>
          {results.length === 0 && (
            <Text color="gray.500" fontSize="sm" textAlign="center" py={4}>
              No results
            </Text>
          )}
          
          <VStack gap={3} align="stretch">
            {results.map(r => (
              <Flex 
                key={r.id} 
                justify="space-between" 
                align="center"
                p={4} 
                borderRadius="md" 
                _hover={{ bg: "gray.50" }} 
                border="1px"
                borderColor="gray.100"
                transition="all 0.2s"
              >
                <Box>
                  <Text fontWeight="medium" color="gray.800">{r.name}</Text>
                  <Text fontSize="sm" color="gray.500">last update: {r.last}</Text>
                </Box>
                <Flex gap={2}>
                  <Button 
                    variant="outline" 
                    size="sm"
                    borderColor="gray.200"
                    color="gray.700"
                    bg="white"
                    _hover={{ bg: 'gray.50', borderColor: 'gray.300' }}
                  >
                    Open
                  </Button>
                  <Button 
                    colorScheme="blue" 
                    size="sm"
                    bg="blue.600"
                    _hover={{ bg: 'blue.700' }}
                  >
                    Compare
                  </Button>
                </Flex>
              </Flex>
            ))}
          </VStack>
        </Box>
      </VStack>
    </Box>
  )
}