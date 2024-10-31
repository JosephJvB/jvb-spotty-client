export type SpotifyPaginatedResponse<T> = {
  items: T[]
  total: number
  limit: number
  offset: number
  href: string
  previous: string
  next: string
}
