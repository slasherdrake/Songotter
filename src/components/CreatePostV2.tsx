import { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Badge, Flex, Image, TextAreaField, Message } from '@aws-amplify/ui-react';
import { useAuth } from '../context/AuthContext';
import CustomStepperField from '../components/CustomStepperField';
import type { Schema } from '../../amplify/data/resource';
import { generateClient } from 'aws-amplify/api';

const client = generateClient<Schema>();

export default function CreatePostV2() {
    const { user, displayName } = useAuth();
    const [type, setType] = useState<string>('track');
    const [query, setQuery] = useState<string>(''); 
    const [result, setResult] = useState<any[]>([]);
    const [firstVisible, setFirstVisible] = useState<boolean>(true);
    const [messageVisible, setMessageVisible] = useState<boolean>(false);
    const [previewData, setPreviewData] = useState({
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
        if (!query) return;

        const searchiTunes = async () => {
            try {
                const response = await axios.get('https://itunes.apple.com/search', {
                    params: {
                        term: query,
                        entity: type === 'track' ? 'musicTrack' : type === 'album' ? 'album' : 'musicArtist',
                        limit: 10,
                    },
                });

                setResult(response.data.results);
            } catch (error) {
                console.error('Error searching iTunes:', error);
            }
        };

        const delayDebounceFn = setTimeout(() => {
            searchiTunes();  // Debounce search
        }, 300);

        return () => clearTimeout(delayDebounceFn);  // Cleanup the timeout
    }, [query, type]);

    const handleClick = (id: string, image: string, title: string, artist: string, type: string, link: string) => {
        setPreviewData({
            id,
            image,
            title,
            artist,
            type,
            link,
        });
        setFirstVisible(false);
        setMessageVisible(false);
    };

    const backToFirst = () => {
        setFirstVisible(true);
    };

    const getResultsForType = () => {
        return result;
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
        const createdAt = new Date().toISOString();
        const order = (new Date(MAX_DATE).getTime() - new Date().getTime()).toString().padStart(20, '0');
        try {
            const post = {
                type: previewData.type,
                itunesId: previewData.id,
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
        }
    };

    const resultForType = getResultsForType();
    return (
        <div className='create-post-container'>
            <Message colorTheme='success' className={messageVisible ? 'message global-space' : 'hidden'}>Post Creation Success</Message>
            <div className={firstVisible ? 'create-post-first' : 'hidden'}>
                <div className='create-post__top global-extra-space'>
                    <div className='track-logo-split'>
                        <div className='create-post__top__types'>
                            <button className={type === 'track' ? 'active create-type' : 'inactive create-type'} onClick={() => setType('track')}>Track</button>
                            <button className={type === 'album' ? 'active create-type' : 'inactive create-type'} onClick={() => setType('album')}>Album</button>
                            <button className={type === 'artist' ? 'active create-type' : 'inactive create-type'} onClick={() => setType('artist')}>Artist</button>
                        </div>
                    </div>
                    <div className='search-in-flex'>
                        <input
                            type="text"
                            value={query}
                            onChange={handleSearchChange}
                            placeholder={"Search iTunes for " + type + "s"}
                            className='itunes-search'
                        />
                        <div>
                            {resultForType.length > 0 && (
                                <ul className='nav-list nav-list-create-post border'>
                                    {resultForType.map((item: any) => (
                                        <li className='height-50px' key={item.trackId || item.collectionId || item.artistId}>
                                            <button className="search-itunes-button" onClick={() => handleClick(
                                                item.trackId || item.collectionId || item.artistId,
                                                item.artworkUrl100 || '',
                                                item.trackName || item.collectionName || item.artistName,
                                                item.artistName || 'Unknown Artist',
                                                type,
                                                item.collectionViewUrl || item.trackViewUrl || ''
                                            )}>
                                                <div className="button-all">
                                                    {item.artworkUrl100 ? (
                                                        <img src={item.artworkUrl100} alt={item.trackName || item.collectionName || item.artistName} width="50" height="50" />
                                                    ) : (
                                                        <div style={{ width: 50, height: 50, backgroundColor: '#DDD', marginRight: 10 }}></div>
                                                    )}
                                                    <div className="item-info">
                                                        <p className="item-name">{item.trackName || item.collectionName || item.artistName}</p>
                                                        {type !== 'artist' && <p className="item-artist">by {item.artistName}</p>}
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
            <div className={firstVisible ? 'hidden' : 'create-post-second'}>
                <Flex justifyContent='space-between' className='preview-line-up'>
                    <h1 className='preview-down'>Preview</h1>
                    <CustomStepperField label='rating (0.0-10.0)' onChange={handleStepperChange} />
                    <button className='get-started' onClick={() => backToFirst()}>Back</button>
                </Flex>
                <Card className='custom-card'>
                    <Flex direction="row">
                        <Image src={previewData.image} alt={previewData.title} width="25%" />
                        <div style={{ flexGrow: 1 }}>
                            <Flex direction="row" alignItems='flex-end' justifyContent='space-between'>
                                <Flex direction="row" alignItems='flex-end'>
                                    <Badge className='square-badge'>{stepperValue || 0}</Badge>
                                    <p>Review by {displayName}</p>
                                </Flex>
                                <button onClick={handleLink} className='play-on-itunes'>
                                    <img src='../itunes-logo.svg' width='25px' className='itunes-logo-down' />
                                    Play on iTunes
                                </button>
                            </Flex>
                            <Flex direction="row" alignItems='baseline'>
                                <h2>{previewData.title}</h2>
                                {previewData.type === 'artist' ? <p>{previewData.type}</p> : <p>{previewData.type} by {previewData.artist}</p>}
                            </Flex>
                            <TextAreaField label='Explain your rating...' maxLength={500} className='comment' rows={7} onChange={handleCommentChange} />
                        </div>
                    </Flex>
                </Card>
                <button className='get-started submit-post-button' onClick={handleSubmit}>Submit Post</button>
            </div>
        </div>
    );
}
