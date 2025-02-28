import type { Schema } from '../../amplify/data/resource'
import { generateClient } from 'aws-amplify/api'
import { useState, useEffect } from 'react';
import { useAuth} from '../context/AuthContext'
import { Card, Flex, Badge, Image, Text } from '@aws-amplify/ui-react';
const client = generateClient<Schema>();

export default function Profile() {
    const [posts, setPosts] = useState<any[]>([]);
    const {user} = useAuth();

  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await client.models.Post.listPostByUserIdAndOrder({
            userId: user.username,   
        }
        );
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
        
        
        {posts.map((post) => ( //.slice.reverse
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
                                <button onClick={() => window.open(post.link, '_blank')} className='play-on-itunes'>
                                  
                                    <img  src= '../icons8-apple.svg' width='25px' className='itunes-logo-down'/>
                                    Music
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