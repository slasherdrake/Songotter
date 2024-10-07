import type { Schema } from '../../amplify/data/resource'
import { generateClient } from 'aws-amplify/api'
import { useState, useEffect } from 'react';
import { Card, Flex, Badge, Image, Text } from '@aws-amplify/ui-react';


const client = generateClient<Schema>();

export default function Global() {
  const [posts, setPosts] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {

        const response = await client.models.Post.listPostByStringPostAndOrder({
          stringPost:  'post',
        });
        
          
        
        setPosts(response.data);
        
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, []);
 
  // Fetch posts from Amplify Data
  
  return (
    <div>
      <div className="global-extra-space">
        
        
        {posts.map((post) => (
          <div key={post.id}>
           
            <Card className = 'custom-card global-space'>
                    <Flex direction="row" >
                        <Image src={post.image} alt={post.title} width="25%" />
                        <div style={{flexGrow:1}}>
                            <Flex direction="row" alignItems= 'flex-end' justifyContent='space-between'>
                                <Flex direction="row" alignItems= 'flex-end'>
                                    <Badge className = 'square-badge'>{post.rating || 0}</Badge>
                                    <p>Review by {post.displayName}</p>
                            
                                </Flex>
                                <button onClick={() => window.open(post.link, '_blank')} className='play-on-spotify'>
                                    <img  src= '../public/spotify-logo.svg' width='25px' className='spotify-logo-down'/>
                                    Play on Spotify
                                </button>
                            </Flex>
                            <Flex direction="row" alignItems = 'baseline'>
                            <h2>{post.title}</h2>
                            
                            {(post.type === 'artist') ? <p>{post.type}</p>:<p>{post.type} by {post.artist}</p>}
                            </Flex>
                            <Text className= 'text-white'>{post.comment}</Text>
                            
                            
                        </div>
                    </Flex>
                </Card>
          </div>
        ))}
      </div>
    </div>
  );
}