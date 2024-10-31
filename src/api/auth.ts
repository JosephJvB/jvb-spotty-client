import { SpotifyToken } from '../types/auth'

export const requestBasicToken = async ({
  clientId,
  clientSecret,
}: {
  clientId: string
  clientSecret: string
}) => {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error('requestBasicToken failed\n' + text)
  }

  const data: Omit<SpotifyToken, 'refresh_token'> = await response.json()

  return data
}

export const requestAccessToken = async ({
  clientId,
  clientSecret,
  refreshToken,
}: {
  clientId: string
  clientSecret: string
  refreshToken: string
}) => {
  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString(
    'base64'
  )

  const response = await fetch('https://accounts.spotify.com/api', {
    method: 'post',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${basicAuth}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error('requestAccessToken failed\n' + text)
  }

  const data: SpotifyToken = await response.json()
  return data
}

export const submitCode = async ({
  spotifyCode,
  clientId,
  clientSecret,
  redirectUri,
}: {
  spotifyCode: string
  clientId: string
  clientSecret: string
  redirectUri: string
}) => {
  const queryParams = new URLSearchParams({
    code: spotifyCode,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
  })

  const response = await fetch(
    `https://accounts.spotify.com/api/token?${queryParams}`,
    {
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${clientId}:${clientSecret}`
        ).toString('base64')}`,
      },
    }
  )

  if (!response.ok) {
    const text = await response.text()
    throw new Error('submitCode failed\n' + text)
  }

  const data: SpotifyToken = await response.json()

  return data
}

export const getStartUrl = ({
  clientId,
  redirectUri,
  scopes,
}: {
  clientId: string
  redirectUri: string
  scopes: string[]
}) =>
  'https://accounts.spotify.com/authorize?' +
  new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    scope: scopes.join(' '),
    redirect_uri: redirectUri,
  })
