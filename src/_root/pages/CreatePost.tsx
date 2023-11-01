import PostForm from "@/components/ui/forms/PostForm"

const CreatePost = () => {

  return (
    <div className="flext flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img src="/assets/icons/add-post.svg" alt="add" width={36} height={36} />
          <h2 className="h4-bold md:h3-bold text-left w-full">Create Posts</h2>
        </div>
        <PostForm/>
      </div>
    </div>
  )
}

export default CreatePost