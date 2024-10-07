import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home.tsx';
import CreateAccount from './pages/CreateAccount.tsx';
import LoginSpotify from './components/LoginSpotify.tsx';
import Dashboard from './pages/Dashboard.tsx';
import SignIn from './pages/SignIn.tsx';
import './styles/global.css';
import spotifyInitConnect from './hooks/SpotifyInitConnect.tsx';
import { AuthProvider } from './context/AuthContext';
import {SpotifyProvider} from './context/SpotifyContext'
import ProtectedRoute from './components/ProtectedRoute.tsx';



function AppContent() {
  const code = new URLSearchParams(window.location.search).get('code');
  
  if (code) {
    spotifyInitConnect(code);
  }
 

  return (
    <div className="background">
      <main>
        <Routes>
        <Route path="/" element={<ProtectedRoute requireAuth={false} requireSpotify={false}><Home /></ProtectedRoute>} />
          <Route path="/sign-in" element={<ProtectedRoute requireAuth={false} requireSpotify={false}><SignIn /></ProtectedRoute>} />
          <Route path="/create-account" element={<ProtectedRoute requireAuth={false} requireSpotify={false}><CreateAccount /></ProtectedRoute>} />
          <Route path="/login-spotify" element={  <ProtectedRoute requireAuth={true} requireSpotify = {false}><LoginSpotify/></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute requireAuth={true} requireSpotify = {true}> <Dashboard /></ProtectedRoute>} />
          
          
        </Routes>
      </main>
    </div>
  );
}


function App() {
  return (
    <AuthProvider>
      <SpotifyProvider>
      <Router>
        <AppContent />
      </Router>
      </SpotifyProvider>
    </AuthProvider>
  );
}

export default App;
