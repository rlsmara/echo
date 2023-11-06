import { useParams, Link, useNavigate } from "react-router-dom";

import { useUserContext } from "@/context/AuthContext";
import { multiFormatDateString } from "@/lib/utils";
import { useDeletePost, useGetPostById, useGetUserPosts } from "@/lib/react-query/queriesAndMutations";

import { Button } from "@/components/ui";
import Loader from "@/components/shared/Loader";
import PostStats from "@/components/shared/PostStats";
import GridPostList from "@/components/shared/GridPostList";

const PostDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useUserContext();

  // FETCH POST DETAILS FROM DB
  const { data: post, isPending } = useGetPostById(id);
  const { data: userPosts, isPending: isUserPostLoading } = useGetUserPosts(post?.creator.$id);
  const { mutate: deletePost } = useDeletePost();

  // RELATED POSTS
  const relatedPosts = userPosts?.documents.filter(
    (userPost) => userPost.$id !== id  
  );

  // HANDLE DELETING POST
  const handleDeletePost = () => {
    deletePost({ postId: id, imageId: post?.imageId });
    navigate(-1);
  }

  return (
    <div className="post_details-container">
      <div className="hidden md:flex max-w-5xl w-full">
        <Button 
          onClick={() => navigate(-1)}
          variant="ghost"
          className="shad-button_ghost">
          <img 
            src="/assets/icons/back.svg"
            alt="back"
            width={24}
            height={24}
          />
          <p className="small-medium lg:base-medium">Back</p>
        </Button>
      </div>

      {isPending || !post ? (
        <Loader /> 
      ) : (
        <div className="post_details-card">
          {/* POST IMAGE */}
          <img 
            src={post?.imageUrl}
            alt="post"
            className="post_details-img"
          />

          {/* USER, DATE, AND LOCATION CONTAINER */}
          <div className="post_details-info">
            <div className="flex-between w-full">
              {/* PROFILE PAGE LINK */}
              <Link to={`/profile/${post?.creator.$id}`} className="flex items-center gap-3">
                <img 
                  src={post?.creator?.imageUrl || '/assets/icons/profile-placeholder.svg'}
                  alt="creator"
                  className="rounded-full w-8 h-8 lg:w-12 lg:h-12"
                />

                <div className="flex flex-col">
                  <p className="base-medium lg:body-bold text-light-1">{post?.creator.name}</p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular">
                      {multiFormatDateString(post?.$createdAt)}
                    </p>
                    •
                    <p className="subtle-semibold lg:small-regular">{post?.location}</p>
                  </div>
                </div>
              </Link>

              {/* EDIT AND DELETE CONTAINER */}
              <div className="flex-center">
                {/* EDIT ICON - ONLY SHOWS IF USER IS CREATOR OF POST */}
                <Link 
                  to={`/update-post/${post?.$id}`}
                  className={`${user.id !== post?.creator.$id && "hidden"}`}
                >
                  <img 
                    src="/assets/icons/edit.svg" 
                    alt="edit"
                    width={24}
                    height={24}
                  />
                </Link>

                {/* DELETE IOON - ONLY SHOWS IF USER IS CREATOR OF POST */}
                <Button
                  onClick={handleDeletePost}
                  variant="ghost"
                  className={`${user.id !== post?.creator.$id && "hidden"} ghost_details-delete_btn`}
                >
                  <img 
                    src="/assets/icons/delete.svg" 
                    alt="delete" 
                    width={24} 
                    height={24}
                  />
                </Button>
              </div>
            </div>

            <hr className="border w-full border-dark-4/80"/>

            {/* CAPTION AND TAGS CONTAINER */}
            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <p>{post?.caption}</p>
              <ul className="flex gap-1 mt-2">
                {post?.tags.map((tag: string, index: string) => (
                  <li key={`${tag}${index}`} className="text-light-3 small-regular">
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full">
              <PostStats post={post} userId={user.id}/>
            </div>

          </div>
        </div>
      )}

      {/* SUGGESTS RELATED POSTS */}
      <div className="w-full max-w-5xl">
        <hr className="border w-full border-dark-4/80" />
        <h3 className="body-bold md:h3-bold w-full my-10">More Related Posts</h3>

        {isUserPostLoading || !relatedPosts ? (
          <Loader />
        ) : (
          <GridPostList posts={relatedPosts} />
        )}
      </div>
    </div>
  )
}

export default PostDetails;