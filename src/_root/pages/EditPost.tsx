import { useParams } from "react-router-dom";

import { useGetPostById } from "@/lib/react-query/queriesAndMutations";
import PostForm from "@/components/forms/PostForm";
import Loader from "@/components/shared/Loader";

const EditPost = () => {
  // ID OF POST TO BE EDITED
  const { id } = useParams();
  const { data: post, isPending } = useGetPostById(id);

  if(isPending) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    )
  }

  return (
    <div className="flex flex-1">
      <div className="common-container">
        {/* HEADING */}
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img 
            src="/assets/icons/edit.svg"
            alt="edit"
            width={36}
            height={36}
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Post</h2>
        </div>

        {/* REUSABLE POST FROM */}
        {isPending ? <Loader /> : <PostForm  action="Update" post={post}/>}
      </div>
    </div>
  )
}

export default EditPost;