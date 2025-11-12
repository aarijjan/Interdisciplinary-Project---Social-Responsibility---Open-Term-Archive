// lib/ota-service.ts
import { fetchGitHubDirectory } from './github-api'

// OTA repository mapping for all collections
export const OTARepositories = {
  'contrib': 'OpenTermsArchive/contrib-versions',
  'p2b-compliance': 'OpenTermsArchive/p2b-compliance-versions',
  'france': 'OpenTermsArchive/france-versions',
  'generative-ai': 'OpenTermsArchive/genai-versions',
  'platform-governance': 'OpenTermsArchive/pga-versions',
  'dating': 'OpenTermsArchive/dating-versions',
  'kenya': 'OpenTermsArchive/kenya-versions',
  'france-public': 'iroco-co/france-public-versions',
  'france-elections': 'OpenTermsArchive/france-elections-versions'
} as const

// Format service name from folder name
const formatServiceName = (folderName: string): string => {
  return folderName
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
}

// Fetch real services from OTA repository
export const fetchOTAServices = async (collectionId: string): Promise<Service[]> => {
  try {
    const repo = OTARepositories[collectionId as keyof typeof OTARepositories]
    
    if (!repo) {
      console.warn(`No repository mapping found for collection: ${collectionId}`)
      return []
    }
    
    console.log(`🔍 Fetching services from: ${repo}`)
    
    const items = await fetchGitHubDirectory(repo, '')
    console.log('📁 GitHub API response received:', items)
    
    // Filter for directories only (services)
    const serviceFolders = items.filter(item => item.type === 'dir')
    
    console.log(`📁 Found ${serviceFolders.length} service folders for ${collectionId}`)
    
    // Convert to Service objects
    const services: Service[] = serviceFolders.map(folder => ({
      id: folder.name,
      name: formatServiceName(folder.name),
      collection: collectionId
    }))
    
    console.log(`✅ Successfully loaded ${services.length} services for ${collectionId}`)
    return services
    
  } catch (error) {
    console.error(`❌ Failed to fetch OTA services for ${collectionId}:`, error)
    return []
  }
}

// Local type definition
interface Service {
  id: string
  name: string
  collection: string
}