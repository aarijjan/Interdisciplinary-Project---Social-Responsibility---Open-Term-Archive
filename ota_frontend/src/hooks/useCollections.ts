// hooks/useCollections.ts
import { useState, useEffect } from 'react'
import { fetchOTAServices } from '../lib/ota-service'

// Define types locally
export interface Service {
  id: string
  name: string
  collection: string
}

export interface Collection {
  id: string
  name: string
  description: string
  serviceCount: number
  language: string
  jurisdiction: string
}

// Real OTA collections based on their website
export const mockCollections: Collection[] = [
  {
    id: 'contrib',
    name: 'Contrib',
    description: 'Collection open to all contributions',
    serviceCount: 0,
    language: 'English, French',
    jurisdiction: 'European Union, United States'
  },
  {
    id: 'p2b-compliance',
    name: 'P2B Compliance', 
    description: 'Online intermediation services for businesses in Europe',
    serviceCount: 0,
    language: 'European Union',
    jurisdiction: 'European Union'
  },
  {
    id: 'france',
    name: 'France',
    description: 'Largest digital services used in France',
    serviceCount: 0,
    language: 'French',
    jurisdiction: 'France'
  },
  {
    id: 'generative-ai',
    name: 'Generative AI',
    description: 'Most popular generative AI services',
    serviceCount: 0,
    language: 'English',
    jurisdiction: 'European Union, China'
  },
  {
    id: 'platform-governance',
    name: 'Platform Governance Archive',
    description: 'Major global social media services',
    serviceCount: 0,
    language: 'English', 
    jurisdiction: 'European Union'
  },
  {
    id: 'dating',
    name: 'Dating',
    description: 'Online dating services',
    serviceCount: 0,
    language: 'English',
    jurisdiction: 'France, Switzerland'
  },
  {
    id: 'kenya',
    name: 'Kenya', 
    description: 'Largest digital services used in Kenya',
    serviceCount: 0,
    language: 'English',
    jurisdiction: 'Kenya'
  },
  {
    id: 'france-public',
    name: 'France Public Services',
    description: 'French public services',
    serviceCount: 0,
    language: 'French',
    jurisdiction: 'France'
  },
  {
    id: 'france-elections',
    name: 'France Elections',
    description: 'French election services',
    serviceCount: 0,
    language: 'French',
    jurisdiction: 'France'
  },
  {
    id: 'demo',
    name: 'Demo',
    description: 'Services used by Open Terms Archive',
    serviceCount: 0,
    language: 'English',
    jurisdiction: 'European Union'
  }
]

// Mock services for each collection
const mockServicesByCollection: Record<string, Service[]> = {
  'contrib': [
    { id: 'google', name: 'Google', collection: 'contrib' },
    { id: 'facebook', name: 'Facebook', collection: 'contrib' },
    { id: 'amazon', name: 'Amazon', collection: 'contrib' },
    { id: 'apple', name: 'Apple', collection: 'contrib' },
    { id: 'microsoft', name: 'Microsoft', collection: 'contrib' },
    { id: 'netflix', name: 'Netflix', collection: 'contrib' },
    { id: 'spotify', name: 'Spotify', collection: 'contrib' },
    { id: 'twitter', name: 'Twitter', collection: 'contrib' },
    { id: 'whatsapp', name: 'WhatsApp', collection: 'contrib' },
    { id: 'instagram', name: 'Instagram', collection: 'contrib' }
  ],
  'p2b-compliance': [
    { id: 'amazon-business', name: 'Amazon Business', collection: 'p2b-compliance' },
    { id: 'alibaba', name: 'Alibaba', collection: 'p2b-compliance' },
    { id: 'shopify', name: 'Shopify', collection: 'p2b-compliance' },
    { id: 'ebay', name: 'eBay', collection: 'p2b-compliance' },
    { id: 'etsy', name: 'Etsy', collection: 'p2b-compliance' }
  ],
  'france': [
    { id: 'orange', name: 'Orange', collection: 'france' },
    { id: 'free', name: 'Free', collection: 'france' },
    { id: 'societe-generale', name: 'Société Générale', collection: 'france' },
    { id: 'carrefour', name: 'Carrefour', collection: 'france' },
    { id: 'sncf', name: 'SNCF', collection: 'france' }
  ],
  'generative-ai': [
    { id: 'chatgpt', name: 'ChatGPT', collection: 'generative-ai' },
    { id: 'midjourney', name: 'Midjourney', collection: 'generative-ai' },
    { id: 'stability-ai', name: 'Stability AI', collection: 'generative-ai' },
    { id: 'anthropic', name: 'Anthropic', collection: 'generative-ai' }
  ],
  'platform-governance': [
    { id: 'facebook', name: 'Facebook', collection: 'platform-governance' },
    { id: 'youtube', name: 'YouTube', collection: 'platform-governance' },
    { id: 'tiktok', name: 'TikTok', collection: 'platform-governance' },
    { id: 'twitter', name: 'Twitter', collection: 'platform-governance' }
  ],
  'dating': [
    { id: 'tinder', name: 'Tinder', collection: 'dating' },
    { id: 'bumble', name: 'Bumble', collection: 'dating' },
    { id: 'happn', name: 'Happn', collection: 'dating' },
    { id: 'meetic', name: 'Meetic', collection: 'dating' }
  ],
  'kenya': [
    { id: 'safaricom', name: 'Safaricom', collection: 'kenya' },
    { id: 'mpesa', name: 'M-Pesa', collection: 'kenya' },
    { id: 'equity-bank', name: 'Equity Bank', collection: 'kenya' }
  ]
}

export const useCollections = () => {
  const [currentCollection, setCurrentCollection] = useState<Collection>(mockCollections[0]) // Contrib by default
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(false)
  // pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    total: 0
  })

  useEffect(() => {
    const loadServices = async () => {
      setLoading(true)
      try {
        // Load real services for ALL collections
        const realServices = await fetchOTAServices(currentCollection.id)
        setServices(realServices)
        // Update total count
        setPagination(prev => ({ ...prev, total: realServices.length }))
      } catch (error) {
        console.error('Failed to load real services:', error)
        // Fallback to empty array if real data fails
        setServices([])
        setPagination(prev => ({ ...prev, total: 0 }))
      } finally {
        setLoading(false)
        // Reset to first page when collection changes
        setPagination(prev => ({ ...prev, page: 1 }))
      }
    }
    loadServices()
  }, [currentCollection])

  // Function to change page
  const changePage = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  
  }
  const changeCollection = (collectionId: string) => {
    const newCollection = mockCollections.find(c => c.id === collectionId)
    if (newCollection) {
      setCurrentCollection(newCollection)
    }
  }

  return {
    currentCollection,
    collections: mockCollections,
    services,
    loading,
    pagination,
    changePage,
    changeCollection
  }
}