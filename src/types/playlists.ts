import { SpotifyProfile } from './profiles'
import { SpotifyTrack } from './tracks'

export type SpotifyPlaylist = {
  id: string
  href: string
  public: boolean
  collaborative: boolean
  description: string
  followers: {
    href: string
    total: number
  }
  name: string
  owner: SpotifyProfile
  tracks: {
    href: string
    total: number
  }
}
export type SpotifyPlaylistTrack = {
  added_at: string
  track: SpotifyTrack
}
