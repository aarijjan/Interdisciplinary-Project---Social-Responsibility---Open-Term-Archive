import { Service, Region } from '../types'

// Mock regions
export const mockRegions: Region[] = [
  { id: 'global', name: 'Global', repository: 'global-versions' },
  { id: 'europe', name: 'Europe', repository: 'europe-versions' },
  { id: 'france', name: 'France', repository: 'france-versions' },
  { id: 'germany', name: 'Germany', repository: 'germany-versions' },
]

// Mock services
export const mockServices: Service[] = [
  { id: 'google', name: 'Google', country: 'global' },
  { id: 'facebook', name: 'Facebook', country: 'global' },
  { id: 'amazon', name: 'Amazon', country: 'global' },
  { id: 'apple', name: 'Apple', country: 'global' },
  { id: 'microsoft', name: 'Microsoft', country: 'global' },
]