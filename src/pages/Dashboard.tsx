//import getSpotifyToken from '../hooks/GetSpotifyToken';

import DashHeader from "../components/DashHeader";
import { useState } from 'react';
//import CreatePost from '../components/CreatePost';
import CreatePostV2 from '../components/CreatePostV2';
import Global from '../components/Global';
import Profile from '../components/Profile';
import Settings from '../components/Settings';
function DashboardContent() {
  const [currentView, setCurrentView] = useState('global');
  //const accessToken = getSpotifyToken();

  const renderContent = () => {
    switch(currentView) {
      case 'global':
        return <Global />;
      case 'profile':
        return <Profile />;
      case 'createPost':
        return <CreatePostV2 />;
        //return <CreatePost accessToken = {accessToken} />;
      case 'settings':
        return <Settings />;
      default:
        return <Global />;
    }
  };

  return (
    <div>
      <DashHeader setCurrentView={setCurrentView} currentView={currentView}/>
      {renderContent()}
    </div>
  );
}

export default function Dashboard() {
    return (
        <DashboardContent />
    );
  }