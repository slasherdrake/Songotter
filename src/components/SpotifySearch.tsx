import { useState, useEffect } from 'react';
//import { generateClient } from 'aws-amplify/api';
//import type { Schema } from '../../amplify/data/resource';
import axios from 'axios';
import '../styles/global.css'
//const client = generateClient<Schema>();
interface Props {
  accessToken: string;
  type: string;
}
export default function SpotifySearch({accessToken,type}:Props) {
  const [query, setQuery] = useState<string>(''); 
  const [result, setResult] = useState<{
    tracks: any[],
    albums: any[],
    artists: any[]
  }>({
    tracks: [],
    albums: [],
    artists: []
  });
  const [previewData, setPreviewData] = useState<string>('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };
  useEffect(() => {
    if (!query || !accessToken) return;

    const searchSpotify = async () => {
      try {
        const response = await axios.get('https://api.spotify.com/v1/search', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            q: query,
            type: 'track,album,artist',
            // type: 'track,album',  // Search for both tracks and albums
            limit: 10,
            offset: 0,  // Start at the beginning of the search results
          },
        });
        
        setResult({
          tracks: response.data.tracks.items,
          albums: response.data.albums.items,
          artists: response.data.artists.items
        });
        
      } catch (error) {
        console.error('Error searching Spotify:', error);
        window.location.href = '/';
      }
    };
    const delayDebounceFn = setTimeout(() => {
      searchSpotify();  // Debounce search
    }, 300);

    return () => clearTimeout(delayDebounceFn);  // Cleanup the timeout
  }, [query, accessToken]);

  const handleClick = (id: string) => {
    setPreviewData(id);
    console.log('Selected item ID:', id);
    // You can perform additional actions with the selected ID here
  };
  const getResultsForType = () => {
    switch(type) {
      case 'track':
        return result.tracks;
      case 'album':
        return result.albums;
      case 'artist':
        return result.artists;
      default:
        return [];
    }
  };

  const resultForType = getResultsForType();


  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={handleSearchChange}
        placeholder={"Search for " + type + "s"}
        style={{ padding: '10px', width: '300px' }}
      />
      <div>
        {resultForType.length > 0 && (
          <ul className='nav-list'>
            {resultForType.map((item: any) => (
              <li key={item.id} >
                <button className="search-spotify-button" onClick={() => handleClick(item.id)}>
                  <div className= "button-all">
                  {item.images && item.images.length > 0 ? (
                    <img src={item.images[0].url} alt={item.name} width="50" height="50" />
                  ) : item.album && item.album.images && item.album.images.length > 0 ? (
                    <img src={item.album.images[0].url} alt={item.name} width="50" height="50" />
                  ) : (
                    <div style={{ width: 50, height: 50, backgroundColor: '#DDD', marginRight: 10 }}></div>
                  )}
                  
                  <div className="item-info">
                    <p className="item-name">{item.name}</p>
                    {type === 'artist' ?
                    (<p></p>) : (<p className="item-artist"> by {item.artists ? item.artists[0].name : 'Unknown Artist'}</p>) }
                  </div>
                  </div>
               
                </button>

                
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );

}






