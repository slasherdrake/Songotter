import { useAuth } from '../context/AuthContext';
//import { useSpotify } from '../context/SpotifyContext';
import { useNavigate } from 'react-router-dom';
import { PropsWithChildren, useEffect, useState } from 'react';
import {Loader} from '@aws-amplify/ui-react'
//import  spotifyInitConnect  from '../hooks/SpotifyInitConnect';
interface ProtectedRouteProps {
  requireAuth: boolean;
  //requireSpotify: boolean;
}

export default function ProtectedRoute({
  children,
  requireAuth,
  //requireSpotify,
}: PropsWithChildren<ProtectedRouteProps>) {
  //const code = new URLSearchParams(window.location.search).get('code');

  const { isAuthenticated, isAuthLoading: authLoading } = useAuth();
  //const { hasToken, isLoading: spotifyLoading } = useSpotify();
  //if (code) {
    //spotifyInitConnect(code);
  //}
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (!authLoading) {
      setIsLoading(false);
      if (requireAuth && !isAuthenticated) {
        navigate('/');
      }
    }
  }, [authLoading, isAuthenticated, navigate, requireAuth]);
  // useEffect(() => {
  //   if (!authLoading && !spotifyLoading) {
  //     setIsLoading(false);

  //     if (requireAuth && !isAuthenticated) {
  //       console.log("Redirecting to / protected route");
  //       navigate('/');
  //     } else if (requireSpotify && !hasToken) {
  //       navigate('/login-spotify');
  //     } else if (isAuthenticated && hasToken){
  //       navigate('/dashboard');
  //     }
  //   }
  // }, [authLoading, spotifyLoading, isAuthenticated, hasToken, requireAuth, requireSpotify, navigate]);

  if (isLoading) {
    return <>
    <Loader className='my-loader'/>
    </>;
  }

  if (requireAuth && !isAuthenticated) {
    return null; // Render nothing while redirecting
  }

  return <>{children}</>;
}



