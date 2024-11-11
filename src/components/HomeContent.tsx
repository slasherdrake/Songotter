import dj from '../assets/LongFlipped2X.png'
import { Link } from 'react-router-dom';
function HomeContent() {
    return (
        <div className="content">
        <div className="content-left">
            <h1>
                THE SOCIAL NETWORK FOR MUSIC LOVERS
            </h1>
            <Link to="/create-account" className="link">
            <h2>
                JOIN THE
            </h2>
            <h2>
                PARTY<svg className = "party-phones bi bi-headphones"  xmlns="http://www.w3.org/2000/svg" width="100px" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 3a5 5 0 0 0-5 5v1h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V8a6 6 0 1 1 12 0v5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1V8a5 5 0 0 0-5-5"/>
                    </svg>
            </h2>
            </Link>
            <h3>
                Rate Albums you've listened to.
            </h3>
            <h3>
                See what your friends are into.
            </h3>
            <h3>
                Create lists of your favorite songs.
            </h3>
            <h3 className="padding-below">
                Discover new music based on your taste.
            </h3>
            <div className="content-button padding-below">
                <Link to="/create-account">
                <button className="get-started">
                    Get Started
                </button>
                </Link>
                
            </div>
        </div>
        <img src = {dj} className="otter-dj" />
    </div>
    )
}

export default HomeContent;