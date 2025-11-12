import { useState } from 'react'
import { Flex, Box, Heading, Button, Select } from '@chakra-ui/react'
import { GitPullRequest } from 'lucide-react'
import Sidebar from './components/Sidebar'
import UploadScreen from './components/UploadScreen'
import ViewVersionsScreen from './components/ViewVersionsScreen'
import SettingsScreen from './components/SettingsScreen'
import { useCollections } from './hooks/useCollections'

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'upload' | 'view' | 'settings'>('upload')
  
  const { 
    currentCollection, 
    collections, 
    services, 
    changeCollection, 
    pagination, 
    changePage 
  } = useCollections()

  return (
    <Flex minH="100vh" bg="gray.50">
      <Sidebar currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />

      <Box flex="1" p={10}>
        <Flex justify="space-between" align="center" mb={8}>
          <Heading size="xl" color="gray.800" fontWeight="semibold">
            Open Terms Archive - {currentCollection.name}
          </Heading>
          
          <Flex gap={3} align="center">
            {/* Collection selector */}
            <Select 
              value={currentCollection.id}
              onChange={(e) => changeCollection(e.target.value)}
              width="300px"
              bg="white"
              borderColor="gray.200"
              borderRadius="lg"
            >
              {collections.map(collection => (
                <option key={collection.id} value={collection.id}>
                  {collection.name}
                </option>
              ))}
            </Select>

            <Button 
              colorScheme="blue" 
              bg="blue.600"
              _hover={{ bg: 'blue.700' }}
              shadow="sm"
              leftIcon={<GitPullRequest size={16} />}
            >
              Check Updates
            </Button>
          </Flex>
        </Flex>

        {currentScreen === 'upload' && <UploadScreen />}
        {currentScreen === 'view' && (
          <ViewVersionsScreen 
            services={services} 
            collection={currentCollection} 
            pagination={pagination}
            onPageChange={changePage}
          />
        )}
        {currentScreen === 'settings' && <SettingsScreen />}
      </Box>
    </Flex>
  )
}