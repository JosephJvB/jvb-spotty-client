export type SpotifyImage = {
  height?: number
  url: string
  width?: number
}
export type SpotifyTokenResponse = {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token: string
  scope: string
}

export type SpotifyRefreshResponse = {
  access_token: string
  token_type: string
  scope: string
  expires_in: number
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
