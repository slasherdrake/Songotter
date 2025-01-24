import type { Schema } from '../../amplify/data/resource'
import { generateClient } from 'aws-amplify/api'
import { useState, useEffect } from 'react';
import { Card, Flex, Badge, Image, Text } from '@aws-amplify/ui-react';

import Likes from './Likes'
import CommentSVG from '../assets/CommentSVG'
import AppleSVG from '../assets/AppleSVG'
import { useAuth } from '../context/AuthContext';
const client = generateClient<Schema>();

export default function Global() {
  const [posts, setPosts] = useState<any[]>([]);
  const {user} = useAuth();
  const userId = user.userId;
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {

        const response = await client.models.Post.listPostByStringPostAndOrder({
          stringPost:  'post',
        });
        const postTemp = response.data;
        //setPosts(response.data);
        const postIds = postTemp.map((post) => post.id);
        const likesResponse = await client.models.Like.list({
          filter:{
           or: postIds.map(id => ({
                postId: {
                  eq: id
                },
                userId:{
                  eq: userId
                }
            }))
            
          }
        });
        const likesMap = likesResponse.data.reduce((acc, like) => {
          acc[like.postId] = like.id;
  
          return acc;
        }, {} as Record<string,string>);
        
        //const likesMap = likesResponse.data.map((like) => like.postId);
        const enhancedPosts = postTemp.map((post) => ({
          ...post,
          likeId: likesMap[post.id] || null,
        }));
        setPosts(enhancedPosts);
        
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, []);
  const handleLikeUpdate = (postId: string, likeId: string | null, newLikes: number) => {
    setPosts((prevPosts) =>
        prevPosts.map((post) =>
            post.id === postId
                ? {
                      ...post,
                      likeId,
                      likes: newLikes,
                  }
                : post
        )
    );
};

 
  // Fetch posts from Amplify Data
  
  return (
    <div>
      <div className="global-extra-space">
        
        
        {posts.map((post) => (
          <div key={post.id}>
           
            <Card className = 'custom-card global-space'>
                    <Flex>
                        <Image src={post.image} alt={post.title} width="25%" />
                        <Flex direction = 'column' gap='0px'className = 'flex-grow-4'>
                            <Flex alignItems= 'flex-end' justifyContent='space-between'>
                                <Flex alignItems= 'flex-end'>
                                    <Badge className = 'square-badge'>{post.rating || 0}</Badge>
                                    <p>Review by {post.displayName}</p>
                            
                                </Flex>
                                <button onClick={() => window.open(post.link, '_blank')} className='play-on-itunes'>
                                    
                                    {/* <img src= '../icons8-apple.svg' width='25px' className='itunes-logo-down'/> */}
                                    <AppleSVG />
                                    Music
                                </button>
                            </Flex>
                            <Flex alignItems = 'baseline'>
                            <h2>{post.title}</h2>
                            
                            {(post.type === 'artist') ? <p>{post.type}</p>:<p>{post.type} by {post.artist}</p>}
                            </Flex>
                            <Text className= 'text-white flex-grow-4'>{post.comment}</Text>
                            <Flex>
                            <Likes id={post.id} likes={post.likes} likeId={post.likeId} onLikeUpdate={handleLikeUpdate}/>
            
                            <p>5</p>
                            <button className='border-none'>
                            <CommentSVG />
                            </button>
                            </Flex>
                            
                        </Flex>
                    </Flex>
                </Card>
          </div>
        ))}
      </div>
    </div>
  );
}