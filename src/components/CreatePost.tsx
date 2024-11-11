//import SpotifySearch from '../components/SpotifySearch'
import {useState, useEffect} from 'react'
import axios from 'axios'
import {Card, Badge, Flex, Image, TextAreaField,Message } from '@aws-amplify/ui-react'
import { useAuth} from '../context/AuthContext'
import CustomStepperField from '../components/CustomStepperField'
import type { Schema } from '../../amplify/data/resource'
import { generateClient } from 'aws-amplify/api'

const client = generateClient<Schema>();
export default function CreatePost({accessToken}:any) {
    const {user, displayName} = useAuth();
    const [type, setType] = useState<string>('track');
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
  const [firstVisible, setFirstVisible] = useState<boolean>(true);
  const [messageVisible, setMessageVisible] = useState<boolean>(false);
  const [previewData, setPreviewData] = useState<{
    id: string,
    image: string,
    title: string,
    artist: string,
    type: string,
    link: string,
  }>({
    id: '',
    image: '',
    title: '',
    artist: '',
    type: '',
    link: '',
  });

  const [stepperValue, setStepperValue] = useState<number>(0);
  const [commentValue, setCommentValue] = useState<string>('');
  const userId = user.userId;
  const MAX_DATE = '9999-12-31T23:59:59.999Z';
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setMessageVisible(false);
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
        if (axios.isAxiosError(error)) {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
            
            if (error.response.status === 401) {
              console.error('Unauthorized: Access token might be invalid or expired');
              // Handle token refresh or re-authentication here
            } else if (error.response.status === 429) {
              console.error('Rate limit exceeded');
              // Implement exponential backoff or inform user to try again later
            }
          } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received:', error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error setting up the request:', error.message);
          }
        }
        //window.location.href = '/';
      }
    };
    const delayDebounceFn = setTimeout(() => {
      searchSpotify();  // Debounce search
    }, 300);

    return () => clearTimeout(delayDebounceFn);  // Cleanup the timeout
  }, [query, accessToken]);

  const handleClick = (id: string, image:string, title:string, artist:string, type:string, link: string) => {
    
    setPreviewData({
        id:id,
        image:image,
        title:title,
        artist:artist,
        type: type,
        link: link,
    });
    setFirstVisible(false);
    setMessageVisible(false);
    console.log('Selected item ID:', id);
    };
  const backToFirst = () => {
    setFirstVisible(true);
  }
  

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
  const handleStepperChange = (value: number) => {
    setStepperValue(value);
  };

  const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentValue(event.target.value);
  };
  const handleLink = () => {
    window.open(previewData.link, '_blank');
  };
  
  const handleSubmit = async () => {
    console.log('Submitting post:', previewData.type, previewData.id, previewData.image, previewData.title, 
        previewData.artist, stepperValue, commentValue, displayName, userId, previewData.link);
    const createdAt = new Date().toISOString();
    const order = (new Date(MAX_DATE).getTime() - new Date().getTime()).toString().padStart(20, '0');
    try {
        const post = {
            type: previewData.type,
            spotifyId: previewData.id,
            image: previewData.image,
            title: previewData.title,
            artist: previewData.artist,
            rating: stepperValue.toString(),
            comment: commentValue,
            
            link: previewData.link,
            userId: userId,
            displayName: displayName,
            likes: 0,
            
            createdAt: createdAt,
            order: order,
            stringPost: 'post',
            
        };
        console.log('Post data:', post);

        const createdPost = await client.models.Post.create(post);
        console.log('Post created:', createdPost);
        setFirstVisible(true);
        setMessageVisible(true);
    } catch (error) {
        console.error('Error creating post:', error);
        // Handle the error appropriately, e.g., show an error message to the user
    }
}


  
  
  const resultForType = getResultsForType();
    return (
        <div className='create-post-container'>
        <Message colorTheme='success'className={messageVisible ? 'message global-space' : 'hidden'}>Post Creation Success</Message>
        <div className={firstVisible ? 'create-post-first' : 'hidden'}>
            <div className='create-post__top global-extra-space'>
                <div className='track-logo-split'>
                <div className='create-post__top__types'>
                    <button className={type === 'track' ? 'active create-type' : 'inactive create-type'} onClick={() => setType('track')}>Track</button>
                    <button className={type === 'album' ? 'active create-type' : 'inactive create-type'} onClick={() => setType('album')}>Album</button>
                    <button className={type === 'artist' ? 'active create-type' : 'inactive create-type'} onClick={() => setType('artist')}>Artist</button>
                </div>
                <div className='logo-create-posts'>
                <img  src= '../spotify-full-logo.svg' width= '125px' className='spotify-logo-down'/>
                </div>
                  
                </div>
            
            
              <div className= 'search-in-flex'>
              <input
                type="text"
                value={query}
                onChange={handleSearchChange}
                placeholder={"Search Spotify for " + type + "s"}
                className = 'spotify-search'
              />
              
              <div>
                {resultForType.length > 0 && (
                  <ul className='nav-list nav-list-create-post border'>
                    {resultForType.map((item: any) => (
                      <li className='height-50px' key={item.id} >
                        <button className="search-spotify-button" onClick={() => handleClick(
                            item.id,
                             (item.images && item.images.length > 0 ? item.images[0].url : item.album.images[0].url),
                             item.name,
                             item.artists ? item.artists[0].name : 'Unknown Artist',
                             type,
                             item.external_urls.spotify,
                             
                             )
                             }>
                          <div className= "button-all">
                          {item.images && item.images.length > 0 ? (
                            <img src={item.images[0].url} alt={item.name} width="50" height="50"/>
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
            </div>
        </div>
        <div className= {firstVisible ? 'hidden': 'create-post-second'}>
                
                <Flex justifyContent='space-between' className= 'preview-line-up' >
                <h1 className= 'preview-down'>Preview</h1>
                <CustomStepperField label='rating (0.0-10.0)' onChange={handleStepperChange}/>
                <button className = 'get-started' onClick={() => backToFirst()}>Back</button>
                </Flex>
                <Card className = 'custom-card'>
                    <Flex direction="row" >
                        <Image src={previewData.image} alt={previewData.title} width="25%" />
                        <div style={{flexGrow:1}}>
                            <Flex direction="row" alignItems= 'flex-end' justifyContent='space-between'>
                                <Flex direction="row" alignItems= 'flex-end'>
                                    <Badge className = 'square-badge'>{stepperValue || 0}</Badge>
                                    <p>Review by {displayName}</p>
                            
                                </Flex>
                                <button onClick={handleLink} className='play-on-spotify'>
                                    <img  src= '../spotify-logo.svg' width='25px' className='spotify-logo-down'/>
                                    Play on Spotify
                                </button>
                            </Flex>
                            <Flex direction="row" alignItems = 'baseline'>
                            <h2>{previewData.title}</h2>
                            
                            {(previewData.type === 'artist') ? <p>{previewData.type}</p>:<p>{previewData.type} by {previewData.artist}</p>}
                            </Flex>
                            <TextAreaField label='Explain your rating...' maxLength={500} className= 'comment' rows= {7} onChange={handleCommentChange}/>
                            
                        </div>
                    </Flex>
                </Card>
                <button className='get-started submit-post-button' onClick={() => handleSubmit()}>Submit Post</button>
        </div>
        </div>
            
          
    );
}