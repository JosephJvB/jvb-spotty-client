import { SpotifyImage } from './profiles'

export type SpotifyArtist = {
  external_urls: {
    spotify: string
  } & Record<string, string>
  followers: {
    href: string
    total: number
  }
  genres: string[]
  href: string
  id: string
  images: SpotifyImage[]
  name: string
  popularity: number
  type: string
  uri: string
}
export type SpotifyArtistTrim = {
  name: string
  type: string
  uri: string
}
