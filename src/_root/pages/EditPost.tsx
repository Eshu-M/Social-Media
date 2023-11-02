import PostForm from "@/components/ui/forms/PostForm"
import Loader from "@/components/ui/shared/Loader";
import { useGetPostById } from "@/lib/react-query/queriesAndMutations";

import { useParams } from "react-router-dom"

const EditPost = () => {
  const {id} =useParams();
  const {data:post,isPending}=useGetPostById(id ||'')
  if(isPending){
    return <Loader/>
  }
  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img src="/assets/icons/add-post.svg" alt="add" width={36} height={36} />
          <h2 className="h4-bold md:h3-bold text-left w-full">Edit Posts</h2>
        </div>
        <PostForm action="Update" post={post}/>
      </div>
    </div>
  )
}

export default EditPost