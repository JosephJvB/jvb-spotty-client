export type SpotifyImage = {
  height?: number
  url: string
  width?: number
}

export type SpotifyProfile = {
  country: string
  display_name: string
  email: string
  explicit_content: {
    filter_enabled: boolean
    filter_locked: boolean
  }
  external_urls: {
    spotify: string
  }
  followers: {
    href?: string
    total: number
  }
  href: string
  id: string
  images: SpotifyImage[]
  product: string
  type: string
  uri: string
}
