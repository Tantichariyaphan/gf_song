import { generatedPhotos, generatedTracks } from './generatedMedia'

export type Photo = {
  id: string
  src: string
  category: 'atmosphere' | 'cake'
  position?: string
}

export type Track = {
  id: string
  src: string
  title: string
  artist: string
}

// Generated media is the inventory source of truth. Regenerate it after adding files.
export const photos: Photo[] = generatedPhotos.map((photo) => ({ ...photo }))
export const tracks: Track[] = generatedTracks.map((track) => ({ ...track }))

export const slideshowIntervalMs = 12_000
