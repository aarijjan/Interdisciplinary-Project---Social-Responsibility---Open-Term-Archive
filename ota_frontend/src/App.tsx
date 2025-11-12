import { useState } from 'react'
import { Flex, Box, Heading, Button, Select } from '@chakra-ui/react'
import { GitPullRequest } from 'lucide-react'
import Sidebar from './components/Sidebar'
import UploadScreen from './components/UploadScreen'
import ViewVersionsScreen from './components/ViewVersionsScreen'
import SettingsScreen from './components/SettingsScreen'
import { useRegion } from './hooks/useRegion'

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'upload' | 'view' | 'settings'>('upload')
  
  const { currentRegion, regions, services, changeRegion } = useRegion()

  return (
    <Flex minH="100vh" bg="gray.50">
      <Sidebar currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />

      <Box flex="1" p={10}>
        <Flex justify="space-between" align="center" mb={8}>
          <Heading size="xl" color="gray.800" fontWeight="semibold">
            Open Terms Archive - {currentRegion.name}
          </Heading>
          
          <Flex gap={3} align="center">
            <Select 
              value={currentRegion.id}
              onChange={(e) => changeRegion(e.target.value)}
              width="180px"
              bg="white"
              borderColor="gray.200"
              borderRadius="lg"
            >
              {regions.map(region => (
                <option key={region.id} value={region.id}>
                  {region.name}
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
        {currentScreen === 'view' && <ViewVersionsScreen services={services} region={currentRegion} />}
        {currentScreen === 'settings' && <SettingsScreen />}
      </Box>
    </Flex>
  )
}