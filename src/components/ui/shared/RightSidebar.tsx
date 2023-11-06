import { useUserContext } from '@/context/AuthContext';
import { useGetRecentPosts } from '@/lib/react-query/queriesAndMutations';
import { Loader } from 'lucide-react';
import { Models } from 'appwrite';
import MyPosts from './MyPosts';
import { Link } from 'react-router-dom';

const RightSidebar = () => {
  const {user}=useUserContext();
  const {data:posts , isPending:isPostLoading ,isError:isErrorPosts}=useGetRecentPosts();
  if (!posts)
  return (
    <div className="flex-center w-full h-full">
      <Loader />
    </div>
  );
  return (
    <div className='rightSidebar flex flex-col items-center gap-3 mt-16 p-3 overflow-scroll custom-scrollbar'>
      <Link to={`/profile/${user.id}`}>
         <img src={user.imageUrl || "/assets/icons/profile-placeholder.svg"} alt="profile picture" className='rounded-full h-14 w-14 lg:h-24 lg:w-24'/>
         <p className='h3-bold'>{user.name}</p>
         <p className='small-regular text-light-3'>@{user.username}</p>
      </Link>
         <div className="flex flex-wrap gap-9 w-full max-w-sm">
        {
          <div className="home-posts">
          <h2 className="text-bold text-lg text-left w-full mt-5">Top posts by you</h2>
          {
            isPostLoading && !posts ?(
              <Loader/>
            ):(
              <ul className="flex flex-col flex-1 gap-6 w-full">
                {posts?.documents.map((posts:Models.Document)=>(
                  <MyPosts post={posts} key={posts.caption}/>
                ))}
              </ul>
            )
          }
        </div>
        }
      </div>
    </div>
  )
}

export default RightSidebar