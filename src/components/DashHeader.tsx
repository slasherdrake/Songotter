import { useAuth } from '../context/AuthContext';

function DashHeader({setCurrentView}:any) {
    const { displayName } = useAuth();
    
    
      return (
        <div className="nav-bar-dash left-16 right-16">
        <div className='dash-header-logo'>
            <a href="/" className="link logo-words">
                <h1 className="logo-weight">
                    <svg className = "logo-phones bi bi-headphones" xmlns="http://www.w3.org/2000/svg" width="40" fill="currentColor"  viewBox="0 0 16 16">
                        <path d="M8 3a5 5 0 0 0-5 5v1h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V8a6 6 0 1 1 12 0v5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1V8a5 5 0 0 0-5-5"/>
                    </svg>
                SONGOTTER
                </h1>
            </a>
        </div>
        
        <ul className="nav-list nav-list-dash">
            <li className="list-item-dash pointer" onClick={() => setCurrentView('global')}>Global</li>
            <li className="list-item-dash pointer" onClick={() => setCurrentView('profile')}>{displayName}</li>
            <li className="list-item-dash pointer" onClick={() => setCurrentView('createPost')}>Create Post</li>
            <li className="list-item-dash pointer" onClick={() => setCurrentView('settings')}>Settings</li>
        </ul>
    </div>
    )
}

export default DashHeader;