// components/ViewVersionsScreen.tsx
import { useState, useMemo } from 'react'
import { Box, Heading, Input, Text, Button, VStack, Flex, HStack } from '@chakra-ui/react'
import { Search } from 'lucide-react'
import Pagination from './Pagination'

// Define types locally
interface Service {
  id: string
  name: string
  collection: string
}

interface Collection {
  id: string
  name: string
  description: string
  serviceCount: number
}

interface ViewVersionsScreenProps {
  services: Service[]
  collection: Collection
  pagination: {
    page: number
    pageSize: number
    total: number
  }
  onPageChange: (page: number) => void
}

export default function ViewVersionsScreen({ 
  services, 
  collection, 
  pagination,
  onPageChange 
}: ViewVersionsScreenProps) {
  const [query, setQuery] = useState("")

  // Filter services based on search query
  const filteredServices = useMemo(() => {
    return services.filter(service => 
      service.name.toLowerCase().includes(query.toLowerCase())
    )
  }, [services, query])

  // Get services for current page
  const paginatedServices = useMemo(() => {
    const startIndex = (pagination.page - 1) * pagination.pageSize
    const endIndex = startIndex + pagination.pageSize
    return filteredServices.slice(startIndex, endIndex)
  }, [filteredServices, pagination.page, pagination.pageSize])

  // Reset to first page when search query changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    onPageChange(1) // Reset to first page
  }

  const handleOpen = (service: Service) => {
    console.log('Open service:', service)
  }

  const handleCompare = (service: Service) => {
    console.log('Compare versions for:', service)
  }

  return (
    <Box bg="white" p={6} borderRadius="lg" boxShadow="sm" border="1px" borderColor="gray.100">
      <Flex mb={6} align="start" justify="space-between" direction={['column', 'row']} gap={4}>
        <Box>
          <HStack gap={3} mb={2}>
            <Search size={16} color="#64748b" />
            <Heading size="md" color="gray.800" fontWeight="medium">
              Services in {collection.name}
            </Heading>
          </HStack>
          <Text color="gray.600" fontSize="sm">
            {collection.description}
          </Text>
          <Text color="gray.500" fontSize="sm">
            {services.length} services • {filteredServices.length} shown
          </Text>
        </Box>
        
        <Input
          placeholder="Search services..."
          value={query}
          onChange={handleSearchChange}
          width={['100%', '300px']}
          bg="white"
          borderColor="gray.200"
          _hover={{ borderColor: 'gray.300' }}
          _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px blue.500' }}
        />
      </Flex>

      <Box>
        {filteredServices.length === 0 ? (
          <Text color="gray.500" fontSize="sm" textAlign="center" py={8}>
            No services found
          </Text>
        ) : (
          <>
            <VStack gap={3} align="stretch">
              {paginatedServices.map(service => (
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
                    <Text fontSize="sm" color="gray.500">Collection: {service.collection}</Text>
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

            {/* Pagination component */}
            <Pagination
              currentPage={pagination.page}
              totalItems={filteredServices.length}
              pageSize={pagination.pageSize}
              onPageChange={onPageChange}
            />
          </>
        )}
      </Box>
    </Box>
  )
}