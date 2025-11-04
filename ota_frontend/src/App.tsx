import { useState } from 'react'
import { Flex, Box, Heading, Button, Select } from '@chakra-ui/react'
import { GitPullRequest } from 'lucide-react'
import Sidebar from './components/Sidebar'
import UploadScreen from './components/UploadScreen'
import ViewVersionsScreen from './components/ViewVersionsScreen'
import SettingsScreen from './components/SettingsScreen'

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'upload' | 'view' | 'settings'>('upload')
  const [country, setCountry] = useState('Germany')

  return (
    <Flex minH="100vh" bg="gray.50">
      <Sidebar currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />

      <Box flex="1" p={10}>
        <Flex justify="space-between" align="center" mb={8}>
          <Heading size="xl" color="gray.800" fontWeight="semibold">OTA Dashboard</Heading>
          <Flex gap={3} align="center">
            <Select 
              value={country} 
              onChange={(e) => setCountry(e.target.value)}
              width="200px"
              bg="white"
              borderColor="gray.200"
              borderRadius="lg"
              color="gray.700"
            >
              <option>Germany</option>
              <option>France</option>
              <option>Italy</option>
              <option>Spain</option>
            </Select>
            <Button 
              colorScheme="blue" 
              bg="blue.600"
              _hover={{ bg: 'blue.700' }}
              shadow="sm"
              leftIcon={<GitPullRequest size={16} />}
            >
              Run Update
            </Button>
          </Flex>
        </Flex>

        {currentScreen === 'upload' && <UploadScreen />}
        {currentScreen === 'view' && <ViewVersionsScreen />}
        {currentScreen === 'settings' && <SettingsScreen />}
      </Box>
    </Flex>
  )
}