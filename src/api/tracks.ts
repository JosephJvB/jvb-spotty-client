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
  const foundTracks: SpotifyTrack[] = []

  for (let i = 0; i < trackIds.length; i += 50) {
    const queryParams = new URLSearchParams({
      ids: trackIds.slice(i, i + 50).join(','),
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

    const json: { tracks: SpotifyTrack[] } = await response.json()
    foundTracks.push(...json.tracks)
  }

  return foundTracks
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

export const getAllLikedTracks = async ({
  accessToken,
}: {
  accessToken: string
}) => {
  const tracks: SpotifyPlaylistTrack[] = []
  let nextUrl: URL | undefined = new URL('https://api.spotify.com/v1/me/tracks')

  while (nextUrl) {
    nextUrl.searchParams.set('limit', '50')

    const response = await fetch(nextUrl, {
      headers: {
        Authorization: 'Bearer ' + accessToken,
      },
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error('failed to get liked tracks\n' + text)
    }

    const json: SpotifyPaginatedResponse<SpotifyPlaylistTrack> =
      await response.json()

    tracks.push(...json.items)
    nextUrl = !!json.next ? new URL(json.next) : undefined
  }

  return tracks
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
