
import { Container } from "react-bootstrap";
import type { Schema } from '../../amplify/data/resource'
import { generateClient } from 'aws-amplify/api'
import { useEffect,useState } from 'react';
const client = generateClient<Schema>();



export default function LoginSpotify() {
  const [authUrl, setAuthUrl] = useState<string | null>(null);


  useEffect(() => {
    console.log('useEffect triggered');
    const fetchAuthUrl = async () => {
      try {
        console.log('fetching authUrl');
        const result = await client.queries.getSpotifyAuthUrl();
        if (result?.data) {
          setAuthUrl(result.data);
          console.log('authUrl', result.data);
        } else {
          console.log('Invalid response from Spotify: maybe null or undefined');
          console.log('result.data', result.data);
        }
      } catch (error) {
        console.error('Error fetching Spotify auth URL:', error);
        
      }
    };

    fetchAuthUrl();
  }, []);
  if (!authUrl) {
    return <div>Loading...</div>;
  }
  return (
    
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}>
      <a className="btn btn-success btn-lg" href={authUrl}>
        Connect to Spotify
      </a>
    </Container>
  )
}