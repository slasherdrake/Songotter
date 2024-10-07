import { useAuth } from '../context/AuthContext';
import {Flex} from '@aws-amplify/ui-react'
export default function Settings() {
    const {logout} = useAuth();
    const handleSignOut = async () => {
        await logout();   
      };
    return (
    <div>
    <Flex className = 'left-16 global-extra-space' >
        <button className= 'get-started' onClick={handleSignOut}>
            Sign Out
        </button>
    </Flex>
    <div className='left-16 right-16'>
        <h1>A message from Drake Kendall</h1>
        <p>Hi I'm Drake, the creator of SongOtter. Please let me now if you run into any issues 
            while using this web app. It is still in it's early stages
             and I wanted to have an early working version to put on my resume. 
             If you have any suggestions or comments, please let me know. 
             I would love to hear your feedback. Thank you for using SongOtter! </p>
        <h2 className= 'global-space'>Future Updates:</h2>
        <ul className= 'left-8'>
            <li>Fix any issues that users run into</li>
            <li>drastically improve the user interface</li>
            <li>like posts</li>
            <li>follow other users</li>
            <li>comment on posts</li>
            <li>search for posts</li>
            <li>search for other users</li>
            <li>change username</li>
            <li>disconnect from spotify</li>
            <li>profile pictures</li>
            <li>list posts example: My top 10 artists</li>
            <li>lists that show top rated songs/albums/artists on songotter</li>
            <li>see other users profiles</li>
            <li>make posts private</li>
        </ul>
        <h2 className= 'global-space'>Not as Near Future Updates:</h2>
        <ul className= 'left-8'>
            <li>Ads on the website to pay for website expenses and maybe make some money someday</li>
            <li>Having my own music database instead of using the spotify api. 
                Using the spotify Api is more of a temporary solution because 
                using my own database is expensive and the spotify Api has request
                limits that will cause problems if there are too many users.

                
            </li>
        </ul>

    </div>
    </div>
    )
}