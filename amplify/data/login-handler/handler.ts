import type { Schema } from '../resource'
import axios from "axios";
import { env } from '$amplify/env/login-handler'



export const handler: Schema["loginToSpotify"]["functionHandler"] = async (event) => {


const code = event.arguments.code;

  if (!code) { 
    throw new Error('Missing Spotify authorization code or state');
  }
  
  const authOptions = {
    method: 'POST',
    url: 'https://accounts.spotify.com/api/token',
    data: new URLSearchParams({
        code: code,
        redirect_uri: env.SPOTIFY_REDIRECT_URI.toString(),
        grant_type: 'authorization_code'
      }).toString(), 
    headers: {
        'Authorization': 'Basic ' + Buffer.from(env.SPOTIFY_CLIENT_ID + ':' + env.SPOTIFY_CLIENT_SECRET).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    json:true,
};
try {
const response = await axios(authOptions);
const { access_token, refresh_token, expires_in } = response.data;
return {
    access_token: access_token,
    refresh_token: refresh_token,
    expires_in: expires_in
  };
} catch (error) {
  
  console.error('Error in Spotify authentication:', error);
  throw new Error('Failed to authenticate with Spotify');
}
}
