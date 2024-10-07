import type { Schema } from '../../amplify/data/resource'
import { generateClient } from 'aws-amplify/api'
import { useEffect} from 'react';

const client = generateClient<Schema>()

export default function spotifyInitConnect(code: string){

    if (!code) { 
        throw new Error('Missing Spotify code or user');
      }
    useEffect(() => {
    if (code) {

      const spotifyConnect = async () => {
        console.log('hey ' + code);
        try {
          const result = await client.queries.loginToSpotify({
            code: code,
      
          },
          { authMode: 'userPool'}
        );
        console.log('spotify success',result);
        window.location.href = '/';
        if (result?.data?.expires_in && result?.data?.access_token && result?.data?.refresh_token){
            const expires_at = new Date(Date.now() + (result.data.expires_in-300) * 1000);
            console.log('expires at', expires_at);

            
            
              console.log('no token going to create');
              await client.models.UserToken.create({
              accessToken: result.data.access_token,
              refreshToken: result.data.refresh_token,
              expiresAt: expires_at.toISOString(),
              }, { authMode: 'userPool' });
         
        } else {
          throw new Error('Invalid response from Spotify: maybe null or undefined');
        }
        } catch (err) {
          console.log('failure');
        }
      };

      spotifyConnect();
    }
  }, [code, ]);
  return null;
}

