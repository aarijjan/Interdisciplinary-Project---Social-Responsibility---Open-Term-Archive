import { useState } from 'react'
import { Box, Heading, Input, Text, Button, VStack, Flex, HStack } from '@chakra-ui/react'
import { Search } from 'lucide-react'

// Temp
interface Service {
  id: string
  name: string
  country: string
}

interface Region {
  id: string
  name: string
  repository: string
}

interface ViewVersionsScreenProps {
  services: Service[]
  region: Region
}

export default function ViewVersionsScreen({ services, region }: ViewVersionsScreenProps) {
  const [query, setQuery] = useState("")

  const filteredServices = services.filter(service => 
    service.name.toLowerCase().includes(query.toLowerCase())
  )

  const handleOpen = (service: Service) => {
    console.log('Open service:', service)
  }

  const handleCompare = (service: Service) => {
    console.log('Compare versions for:', service)
  }

  return (
    <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" border="1px" borderColor="gray.100">
      <Flex mb={6} align="center" justify="space-between">
        <HStack gap={3}>
          <Search size={16} color="#64748b" />
          <Heading size="md" color="gray.800" fontWeight="medium">
            Services in {region.name}
          </Heading>
        </HStack>
      </Flex>

      <VStack gap={4} align="stretch">
        <Input
          placeholder="Search services..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          bg="white"
          borderColor="gray.200"
          _hover={{ borderColor: 'gray.300' }}
          _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }}
        />
        
        <Box>
          {filteredServices.length === 0 ? (
            <Text color="gray.500" fontSize="sm" textAlign="center" py={4}>
              No services found
            </Text>
          ) : (
            <VStack gap={3} align="stretch">
              {filteredServices.map(service => (
                <Flex 
                  key={service.id} 
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
                    <Text fontWeight="medium" color="gray.800">{service.name}</Text>
                    <Text fontSize="sm" color="gray.500">Country: {service.country}</Text>
                  </Box>
                  <Flex gap={2}>
                    <Button 
                      variant="outline" 
                      size="sm"
                      borderColor="gray.200"
                      color="gray.700"
                      bg="white"
                      _hover={{ bg: 'gray.50', borderColor: 'gray.300' }}
                      onClick={() => handleOpen(service)}
                    >
                      Open
                    </Button>
                    <Button 
                      colorScheme="blue" 
                      size="sm"
                      bg="blue.600"
                      _hover={{ bg: 'blue.700' }}
                      onClick={() => handleCompare(service)}
                    >
                      Compare
                    </Button>
                  </Flex>
                </Flex>
              ))}
            </VStack>
          )}
        </Box>
      </VStack>
    </Box>
  )
}