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