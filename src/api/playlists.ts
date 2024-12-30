import { SpotifyPlaylist, SpotifyPlaylistTrack } from '../types/playlists'
import { SpotifyPaginatedResponse } from '../types/responses'

export const getAllUsersPlaylists = async ({
  accessToken,
}: {
  accessToken: string
}) => {
  const myPlaylists: SpotifyPlaylist[] = []

  let nextUrl: URL | undefined = new URL(
    'https://api.spotify.com/v1/me/playlists'
  )
  while (nextUrl) {
    nextUrl.searchParams.set('limit', '50')

    const response = await fetch(nextUrl, {
      method: 'get',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error('getAllUsersPlaylists failed\n' + text)
    }

    const json: SpotifyPaginatedResponse<SpotifyPlaylist> =
      await response.json()

    json.items.forEach((item) => {
      /**
       * bugfix:
       * found I was receiving null playlists!
       */
      if (item) {
        myPlaylists.push(item)
      }
    })

    nextUrl = !!json.next ? new URL(json.next) : undefined
  }

  return myPlaylists
}

export const getAllPlaylistTracks = async ({
  playlistId,
  accessToken,
}: {
  playlistId: string
  accessToken: string
}) => {
  const playlistTracks: SpotifyPlaylistTrack[] = []
  let nextUrl: URL | undefined = new URL(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`
  )

  while (nextUrl) {
    const response = await fetch(nextUrl, {
      method: 'get',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error('getAllPlaylistTracks failed\n' + text)
    }

    const json: SpotifyPaginatedResponse<SpotifyPlaylistTrack> =
      await response.json()

    playlistTracks.push(...json.items)
    nextUrl = !!json.next ? new URL(json.next) : undefined
  }

  return playlistTracks
}

export const createPlaylist = async ({
  userId,
  accessToken,
  playlist,
}: {
  userId: string
  accessToken: string
  playlist: Pick<SpotifyPlaylist, 'name' | 'description' | 'public'>
}) => {
  const response = await fetch(
    `https://api.spotify.com/v1/users/${userId}/playlists`,
    {
      method: 'post',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(playlist),
    }
  )

  if (!response.ok) {
    const text = await response.text()
    throw new Error('createPlaylist failed\n' + text)
  }

  const json: SpotifyPlaylist = await response.json()

  return json
}

export const addPlaylistTracks = async ({
  accessToken,
  playlistId,
  trackUris,
}: {
  accessToken: string
  playlistId: string
  trackUris: string[]
}) => {
  for (let i = 0; i < trackUris.length; i += 100) {
    const uris = trackUris.slice(i, i + 100)

    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        method: 'post',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ uris }),
      }
    )

    if (!response.ok) {
      const text = await response.text()
      throw new Error('addPlaylistTracks failed\n' + text)
    }
  }
}
