import type { Schema } from '../../amplify/data/resource'
import { generateClient } from 'aws-amplify/api'
import { useEffect, useState } from 'react';

const client = generateClient<Schema>()

export default function getSpotifyToken() {
    const [Token, setToken] = useState<string | null>(null);
    
    useEffect(() => {
        const getToken = async () => {
            try {
                const userTokens = await client.models.UserToken.list({ authMode: 'userPool'});
                const currentTime = new Date();
                const userToken = userTokens.data[0];
                if (!userToken) {
                    throw new Error('No user token found');
                }
                if (new Date(userToken.expiresAt) <= currentTime) {
                    console.log('close to expiring, refreshing...');
                  
                    //if expired
                    const refresh_token = userToken.refreshToken;
                    console.log(refresh_token);
                    if (!refresh_token) {
                        throw new Error('Refresh token is missing');
                    }
                    //refresh-handler
                    const result = await client.queries.refreshToken(
                        {refresh_token: refresh_token,},
                    {authMode: 'userPool'});
                    console.log(result, 'after refresh');
                    if (result?.data?.expires_in && result?.data?.access_token && result?.data?.refresh_token){
                        const expires_at = new Date(Date.now() + (result.data.expires_in-300) * 1000);
                        console.log(expires_at, 'expiration date' );
                    //update tokens in the database
                    await client.models.UserToken.update({
                      id: userToken.id,
                      accessToken: result.data.access_token,
                      refreshToken: result.data.refresh_token || userToken.refreshToken,
                      expiresAt: expires_at.toISOString(),
                    }, { authMode: 'userPool' });
                    //set token when refreshed
                    setToken(result.data.access_token);
                    } else {
                      throw new Error('Invalid response from Spotify: maybe null or undefined');
                    }
                } else {
                    //set token no refresh
                    setToken(userToken.accessToken);
                }
                
                

            } catch (err) {
                console.log('failure');
            }
        }
        getToken();
    }, []);
    return Token;
}
