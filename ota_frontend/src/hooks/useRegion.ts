import { useState, useEffect } from 'react'
import { fetchOTAServices } from '../lib/ota-service'

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

// Mock data for regions
const mockRegions: Region[] = [
  { id: 'global', name: 'Global', repository: 'global-declarations' },
  { id: 'europe', name: 'Europe', repository: 'europe-declarations' },
  { id: 'france', name: 'France', repository: 'france-declarations' },
  { id: 'germany', name: 'Germany', repository: 'germany-declarations' },
]

// Mock services for non-global regions
const mockServicesByRegion: Record<string, Service[]> = {
  europe: [
    { id: 'deutsche-bank', name: 'Deutsche Bank', country: 'europe' },
    { id: 'bnp-paribas', name: 'BNP Paribas', country: 'europe' },
    { id: 'ubs', name: 'UBS', country: 'europe' },
    { id: 'airbnb-eu', name: 'Airbnb Europe', country: 'europe' },
    { id: 'booking-com', name: 'Booking.com', country: 'europe' },
  ],
  france: [
    { id: 'orange-fr', name: 'Orange France', country: 'france' },
    { id: 'free-mobile', name: 'Free Mobile', country: 'france' },
    { id: 'societe-generale', name: 'Société Générale', country: 'france' },
    { id: 'carrefour-fr', name: 'Carrefour France', country: 'france' },
    { id: 'sncf', name: 'SNCF', country: 'france' },
  ],
  germany: [
    { id: 'deutsche-telekom', name: 'Deutsche Telekom', country: 'germany' },
    { id: 'vodafone-de', name: 'Vodafone Germany', country: 'germany' },
    { id: 'deutsche-bank-de', name: 'Deutsche Bank Germany', country: 'germany' },
    { id: 'commerzbank', name: 'Commerzbank', country: 'germany' },
    { id: 'lidl-de', name: 'Lidl Germany', country: 'germany' },
  ]
}

export const useRegion = () => {
  const [currentRegion, setCurrentRegion] = useState<Region>(mockRegions[0])
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(false)

  // Load services when region changes
  useEffect(() => {
    loadServices(currentRegion.id)
  }, [currentRegion.id])

  const loadServices = async (regionId: string) => {
    setLoading(true)
    
    try {
      if (regionId === 'global') {
        // Use real OTA data for Global region
        console.log('Loading REAL services for Global region...')
        const realServices = await fetchOTAServices('global')
        
        if (realServices.length > 0) {
          console.log(`Loaded ${realServices.length} real services from OTA`)
          setServices(realServices)
        } else {
          // Fallback to mock if real data fails
          console.log('Real data failed, using mock data for Global')
          setServices(getMockServicesForRegion(regionId))
        }
      } else {
        // Use mock data for all other regions
        console.log(`Using MOCK data for ${regionId} region`)
        setServices(getMockServicesForRegion(regionId))
      }
    } catch (error) {
      console.error(`Failed to load services for ${regionId}:`, error)
      // Fallback to mock data on error
      setServices(getMockServicesForRegion(regionId))
    } finally {
      setLoading(false)
    }
  }

  // Helper function to get mock services for a region
  const getMockServicesForRegion = (regionId: string): Service[] => {
    return mockServicesByRegion[regionId] || [
      { id: 'default-1', name: 'Default Service 1', country: regionId },
      { id: 'default-2', name: 'Default Service 2', country: regionId },
    ]
  }

  const changeRegion = (regionId: string) => {
    const newRegion = mockRegions.find(r => r.id === regionId)
    if (newRegion) {
      setCurrentRegion(newRegion)
      // Services will be loaded via useEffect
    }
  }

  return {
    currentRegion,
    regions: mockRegions,
    services,
    loading,
    changeRegion
  }
}