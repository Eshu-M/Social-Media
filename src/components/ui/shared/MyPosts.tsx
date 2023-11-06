import { useUserContext } from '@/context/AuthContext';
import { multiFormatDateString } from '@/lib/utils';
import { Models } from 'appwrite'
import { Link } from 'react-router-dom';
import PostStats from './PostStats';

type PostCardProps={
    post:Models.Document;
}
const MyPosts = ({post}:PostCardProps) => {
    const {user}=useUserContext();
    if(!post.creator) return;
  return (
    <div className='post-card'>
       <Link to={`/posts/${post.$id}`}>
         <img src={post.imageUrl || '/assets/icons/profile-placeholder.svg'} className='post-card_img' alt="post image" />
       </Link>
       <PostStats post={post} userId={user.id}/>
    </div>
  )
}

export default MyPosts