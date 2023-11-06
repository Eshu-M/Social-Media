
import { Button } from '@/components/ui/button';
import GridPostList from '@/components/ui/shared/GridPostList';
import Loader from '@/components/ui/shared/Loader';
import { useUserContext } from '@/context/AuthContext';
import { useGetPosts } from '@/lib/react-query/queriesAndMutations';
import { Link } from 'react-router-dom';


const Profile = () => {
  const {user}=useUserContext();
  const {data: posts, fetchNextPage , hasNextPage }=useGetPosts();
  if (!posts)
  return (
    <div className="flex-center w-full h-full">
      <Loader />
    </div>
  );
  
    return (
    <div className='profile-container'>
       <div className="profile-inner_container">
       <div className="profile-tab">
          <img src={user.imageUrl || "/assets/icons/profile-placeholder.svg"} alt="profile picture" className='rounded-full h-14 w-14 lg:h-24 lg:w-24'/>
          <div className="">
            <p className='lg:h3-bold'>
              {user.name}
            </p>
            <p className='small-regular text-light-3'>
              @{user.username}
            </p>
          </div>
          
          <Link to={'/update-profile/:id'} className='hover:cursor-pointer'>
             <Button className="flex gap-2 bg-dark-4">
               <img src="/assets/icons/edit.svg" alt="edit" width={20} height={20} className="text-orange-300"/>
               <p>Edit Profile</p>
               </Button>
          </Link> 
          
      </div>
         <div>
         <div className="flex gap-5 lg:ml-24">
           <div className="flex flex-col items-center">
            <p className="text-[#877EFF]">0</p>
            <p>Posts</p>
           </div>
           <div className="flex flex-col items-center">
            <p className="text-[#877EFF]">0</p>
            <p>Following</p>
           </div>
           <div className="flex flex-col items-center">
            <p className="text-[#877EFF]">0</p>
            <p>Followers</p>
           </div>
         </div>
         <p className="mt-5 lg:ml-24">{user.bio}</p>
         </div>
         <div className="flex lg:ml-10 lg:mt-14 mt-5 ml-5 gap-3">
          <Button className="flex gap-2 bg-dark-4">
            <img src="/assets/icons/saved.svg" alt="edit" width={20} height={20} className="text-orange-300"/>
            <p>Saved</p>
          </Button>
          <Button className="flex gap-2 bg-dark-4">
            <img src="/assets/icons/liked.svg" alt="edit" width={20} height={20} className="text-orange-300"/>
            <p>Liked</p>
          </Button>
          <Button className="flex gap-2 bg-dark-4">
            <img src="/assets/icons/posts.svg" alt="edit" width={20} height={20} className="text-orange-300"/>
            <p>Posts</p>
          </Button>
      </div>
      </div>
      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {
          posts.pages.map((item, index) => (
            <GridPostList key={`page-${index}`} posts={item.documents} action='MyPosts'/>
          ))
        }
      </div>
        
    </div>
  )
}

export default Profile