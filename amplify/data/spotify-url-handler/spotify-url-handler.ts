import type { Schema } from '../resource'
import { env } from '$amplify/env/spotify-url-handler'
export const handler : Schema["getSpotifyAuthUrl"]["functionHandler"] = async (event) => {

    
    const scopes = [
        'streaming',
        'user-read-email',
        'user-read-private',
        'user-library-read',
        'user-library-modify',
        'user-read-playback-state',
        'user-modify-playback-state'
      ];
    
      const authUrl = new URL('https://accounts.spotify.com/authorize?');
      authUrl.searchParams.append('client_id', env.SPOTIFY_CLIENT_ID);
      authUrl.searchParams.append('response_type', 'code');
      authUrl.searchParams.append('redirect_uri', env.SPOTIFY_REDIRECT_URI);
      authUrl.searchParams.append('scope', scopes.join(' '));
    
     return  authUrl.toString();
}