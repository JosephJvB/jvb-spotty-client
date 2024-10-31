import { SpotifyArtistTrim } from './artists'
import { SpotifyImage } from './profiles'

export type SpotifyTrack = {
  album: SpotifyAlbum
  artists: SpotifyArtistTrim[]
  available_markets: string[]
  disc_number: number
  duration_ms: number
  explicit: boolean
  external_ids: Record<string, string>
  external_urls: {
    spotify: string
  } & Record<string, string>
  href: string
  id: string
  is_local: boolean
  name: string
  popularity: number
  preview_url: string
  track_number: number
  type: string
  uri: string
}
export type SpotifyAlbum = {
  album_type: string
  artists: SpotifyArtistTrim[]
  images: SpotifyImage[]
  name: string
  release_date: string
}

export type AudioFeatures = {
  acousticness: number
  analysis_url: string
  danceability: number
  energy: number
  id: string
  instrumentalness: number
  key: number
  liveness: number
  mode: number
  speechiness: number
  tempo: number
  time_signature: number
  uri: string
  valence: number
}
