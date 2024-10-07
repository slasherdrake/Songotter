import type { Schema } from '../../amplify/data/resource'
import { generateClient } from 'aws-amplify/api'
import { useEffect, useState } from 'react';

const client = generateClient<Schema>()

export function useCheckUserToken() {
    const [hasToken, setHasToken] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
  
    useEffect(() => {
      async function checkUserToken() {
        try {
          const userToken = await client.models.UserToken.list({
              authMode: 'userPool' });
  
        setHasToken(userToken.data.length > 0 && userToken.data[0].accessToken !== null);
        } catch (error) {
          console.error('Error checking user token:', error);
          setHasToken(false);
        } finally {
          setIsLoading(false);
        }
      }
  
      checkUserToken();
    }, []);
  
    return { hasToken, isLoading };
  }