import type { Schema } from '../resource'
import axios from "axios";
import { env } from '$amplify/env/refresh-handler'


export const handler: Schema["refreshToken"]["functionHandler"] = async (event) => {

const refreshToken = event.arguments.refresh_token;

  if (!refreshToken) { 
    throw new Error('Missing Spotify refresh token');
  }
  
  const authOptions = {
    method: 'POST',
    url: 'https://accounts.spotify.com/api/token',
    data: new URLSearchParams({
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
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
    refresh_token: refresh_token || refreshToken,
    expires_in: expires_in
  };
} catch (error) {
  
  console.error('Error in Spotify authentication:', error);
  throw new Error('Failed to authenticate with Spotify');
}
}