
import {Flex} from '@aws-amplify/ui-react';
import {useState} from 'react';
import { generateClient } from 'aws-amplify/api';
import { useAuth } from '../context/AuthContext';
import type { Schema } from '../../amplify/data/resource'

const client = generateClient<Schema>();
interface PostProps {
    id: string;
    likeId: string;
    likes: number;
    onLikeUpdate: (postId: string, likeId: string | null, newLikes: number) => void;
  }
export default function Likes({id,likeId,likes,onLikeUpdate}:PostProps){
    const [liked, setLiked] = useState<boolean>(!!likeId);
    const [localLikes, setLocalLikes] = useState<number>(likes);
    const {user} = useAuth();
    const userId = user.userId;
    const [loading, setLoading] = useState(false);
    const handleLike = async () => {
        
        console.log("post.id:",id, "likes:",likes ,"post.likeId:", likeId, "local likes",localLikes);
        if (loading) return;
        setLoading(true);

        try{
          if(!liked){
            setLiked(true);
            setLocalLikes(likes + 1);
            const newLikeId = crypto.randomUUID().toString();
            await client.models.Like.create({
            id: newLikeId,
            postId: id,
            userId: userId,
            commentId: null,
            });
            await client.mutations.postLikeIncrement({
                postId: id,
            })
            onLikeUpdate(id, newLikeId, localLikes + 1);
          } else {
            setLiked(false);
            setLocalLikes(likes - 1);
            await client.models.Like.delete({id: likeId});
            await client.mutations.postLikeDecrement({
                postId: id,
            })
            onLikeUpdate(id, null, localLikes - 1);
          
        }
        console.log("post.id:",id, "likes:",likes ,"post.likeId:", likeId, "post.likes", likes);
      } catch (error){
        console.error('Error liking post:', error);
      } finally {
        setLoading(false);
      }
    }
    return (
        <Flex>
            <p>{likes}</p>
            <button onClick={() => handleLike()}
            disabled={loading}
            className='border-none'>
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height= "25" fill="currentColor" className={liked ? "pink-fill" :"heart-pos"} viewBox="0 0 16 16">
            <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15"/>
            </svg>
            </button>

        </Flex>
    );

    }
