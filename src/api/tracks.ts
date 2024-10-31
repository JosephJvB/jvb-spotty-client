import { SpotifyPlaylistTrack } from '../types/playlists'
import { SpotifyPaginatedResponse } from '../types/responses'
import { SpotifyTrack } from '../types/tracks'

export const findTrack = async ({
  basicToken,
  query,
  limit,
}: {
  basicToken: string
  query: {
    track?: string
    artist?: string
    year?: string
    albumId?: string
  }
  limit?: number
}) => {
  const paramKeys = Object.keys(query) as (keyof typeof query)[]

  const queryParams = new URLSearchParams({
    q: paramKeys
      .filter((key) => !!query[key])
      .map((key) => `${key}:${query[key]}`)
      .join(' '),
    type: 'track',
  })

  if (limit) {
    queryParams.append('limit', limit.toString())
  }

  const response = await fetch(
    `https://api.spotify.com/v1/search?${queryParams}`,
    {
      method: 'get',
      headers: {
        Authorization: `Bearer ${basicToken}`,
      },
    }
  )

  if (!response.ok) {
    const text = await response.text()
    throw new Error('findTrack failed\n' + text)
  }

  const data: { tracks: SpotifyTrack[] } = await response.json()

  return data
}

/**
 * TODO: non-basic auth?
 */
export const getTracksByIds = async ({
  basicToken,
  trackIds,
}: {
  basicToken: string
  trackIds: string[]
}) => {
  const queryParams = new URLSearchParams({
    ids: trackIds.join(','),
  })

  const response = await fetch(
    `https://api.spotify.com/v1/tracks?${queryParams}`,
    {
      method: 'get',
      headers: {
        Authorization: `Bearer ${basicToken}`,
      },
    }
  )

  if (!response.ok) {
    const text = await response.text()
    throw new Error('getTracksByIds failed\n' + text)
  }

  const data: { tracks: SpotifyTrack[] } = await response.json()

  return data.tracks
}

export const removeLikedTracks = async ({
  accessToken,
  trackIds,
}: {
  accessToken: string
  trackIds: string[]
}) => {
  for (let i = 0; i < trackIds.length; i += 50) {
    const response = await fetch(`https://api.spotify.com/v1/me/tracks`, {
      method: 'delete',
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
      body: JSON.stringify({
        ids: trackIds.slice(i, i + 50),
      }),
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error('failed to remove liked tracks\n' + text)
    }
  }
}

export const getLikedTracks = async ({
  accessToken,
  nextUrl,
}: {
  accessToken: string
  nextUrl?: string
}) => {
  const tracks: SpotifyPlaylistTrack[] = []
  const url = nextUrl ?? `https://api.spotify.com/v1/me/tracks`
  const response = await fetch(url, {
    headers: {
      Authorization: 'Bearer ' + accessToken,
    },
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error('failed to get liked tracks\n' + text)
  }

  const { items, next }: SpotifyPaginatedResponse<SpotifyPlaylistTrack> =
    await response.json()

  tracks.push(...items)

  return { tracks, next }
}

/**
 * be careful!
 * https://community.spotify.com/t5/Spotify-for-Developers/Tracks-for-Current-User-SAVES-in-NOT-exact-sequence-as-expected/m-p/6321639#M14983
 */
export const addToLikes = async ({
  accessToken,
  trackIds,
}: {
  accessToken: string
  trackIds: string[]
}) => {
  for (let i = 0; i < trackIds.length; i += 50) {
    const response = await fetch(`https://api.spotify.com/v1/me/tracks`, {
      method: 'put',
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
      body: JSON.stringify({
        ids: trackIds.slice(i, i + 50),
      }),
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error('failed to add to liked tracks\n' + text)
    }
  }
}
