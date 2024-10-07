import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSpotify } from '../context/SpotifyContext';

export default function AccountRedirect() {
    const navigate = useNavigate();
    const { isAuthenticated, isAuthLoading } = useAuth();
    const { hasToken, isLoading } = useSpotify();

    useEffect(() => {
        if (!isLoading && !isAuthLoading) {
            if (hasToken) {
                console.log("Redirecting to /dashboard");
                window.location.href = '/dashboard';
            } else if (isAuthenticated) {
                console.log("Redirecting to /login-spotify");
                window.location.href = '/login-spotify';
            } else {
                console.log("Redirecting to /");
                window.location.href = '/';
            }
        }
    }, [isLoading, isAuthLoading, hasToken, isAuthenticated, navigate]);

    if (isLoading || isAuthLoading) {
        console.log("Loading...");
        return <div>loading...</div>;
    }

    return null;  // Render nothing while waiting for the status to be checked
}
