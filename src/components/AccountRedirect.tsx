//import { useEffect } from 'react';
//import { useNavigate } from 'react-router-dom';
//import { useAuth } from '../context/AuthContext';
//import { useSpotify } from '../context/SpotifyContext';
//import {Loader} from '@aws-amplify/ui-react'

export default function AccountRedirect() {
    window.location.href = '/dashboard';
    //const navigate = useNavigate();
    //navigate('/dashboard');
    // const { isAuthenticated, isAuthLoading: authLoading } = useAuth();
    // //const { hasToken, isLoading } = useSpotify();
    // useEffect(() => {
    //     if (!authLoading) {
    //         if (isAuthenticated) {
    //             console.log("Redirecting to /dashboard");
    //             //navigate('/dashboard');
    //             window.location.href = '/dashboard';
    //         }
    //     }
    // }, [authLoading, isAuthenticated, navigate]);
    // useEffect(() => {
    //     if (!isLoading && !isAuthLoading) {
    //         if (hasToken) {
    //             console.log("Redirecting to /dashboard");
    //             window.location.href = '/dashboard';
    //         } else if (isAuthenticated) {
    //             console.log("Redirecting to /login-spotify");
    //             window.location.href = '/login-spotify';
    //         } else {
    //             console.log("Redirecting to /");
    //             window.location.href = '/';
    //         }
    //     }
    // }, [isLoading, isAuthLoading, hasToken, isAuthenticated, navigate]);

    // if (isLoading || isAuthLoading) {
    //     console.log("Loading...");
    //     return <div>loading...</div>;
    // }
    // if (authLoading) {
    //     console.log("Loading...");
    //     return <><Loader className= 'my-loader'/></>;
    // }

    return null;  // Render nothing while waiting for the status to be checked
}
