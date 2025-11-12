import { useState } from 'react'

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
  { id: 'global', name: 'Global', repository: 'global-versions' },
  { id: 'europe', name: 'Europe', repository: 'europe-versions' },
  { id: 'france', name: 'France', repository: 'france-versions' },
  { id: 'germany', name: 'Germany', repository: 'germany-versions' },
]

// Mock services for each region
const mockServicesByRegion: Record<string, Service[]> = {
  global: [
    { id: 'google', name: 'Google', country: 'global' },
    { id: 'facebook', name: 'Facebook', country: 'global' },
    { id: 'amazon', name: 'Amazon', country: 'global' },
    { id: 'apple', name: 'Apple', country: 'global' },
    { id: 'microsoft', name: 'Microsoft', country: 'global' },
    { id: 'netflix', name: 'Netflix', country: 'global' },
    { id: 'spotify', name: 'Spotify', country: 'global' },
  ],
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
    { id: 'aldi-de', name: 'Aldi Germany', country: 'germany' },
    { id: 'bmw', name: 'BMW', country: 'germany' },
    { id: 'volkswagen', name: 'Volkswagen', country: 'germany' },
  ]
}

export const useRegion = () => {
  const [currentRegion, setCurrentRegion] = useState<Region>(mockRegions[0])
  const [services, setServices] = useState<Service[]>(mockServicesByRegion.global)

  const changeRegion = (regionId: string) => {
    const newRegion = mockRegions.find(r => r.id === regionId)
    if (newRegion) {
      setCurrentRegion(newRegion)
      // Load services for the selected region
      setServices(mockServicesByRegion[regionId] || [])
    }
  }

  return {
    currentRegion,
    regions: mockRegions,
    services,
    changeRegion
  }
}