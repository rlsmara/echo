import { Models } from "appwrite";
import React, { useState, useEffect } from "react";

import { useDeleteSavedPost, useGetCurrentUser, useLikePost, useSavePost } from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import Loader from "./Loader";

type PostStatsProps = {
  post?: Models.Document;
  userId: string
}

const PostStats = ({ post, userId }: PostStatsProps) => {
  // List of current likes
  const likesList = post?.likes.map((user: Models.Document) => user.$id);

  const [likes, setLikes] = useState(likesList);
  const [isSaved, setIsSaved] = useState(false);
  
  // Queries and mutations
  const { mutate: likePost } = useLikePost();
  const { mutate: savePost, isPending: isSavingPost } = useSavePost();
  const { mutate: deleteSavedPost, isPending: isDeletingSaved } = useDeleteSavedPost();

  const { data: currentUser } = useGetCurrentUser();

  const savedPostRecord = currentUser?.save.find((record: Models.Document) => record.post.$id === post?.$id);

  // Changes whenver current user changes
  useEffect(() => {
    setIsSaved(!!savedPostRecord)
  }, [currentUser])

  // LIKE/DISLIKE POST
  const handleLikePost = (e: React.MouseEvent) => {
    e.stopPropagation();

    let newLikes = [...likes];

    const hasLiked = newLikes.includes(userId);
    
    if(hasLiked) {
      // Remove like
      newLikes = newLikes.filter((id) => id !== userId);
    } else {
      // Perform like
      newLikes.push(userId);
    }

    setLikes(newLikes);
    likePost({postId: post?.$id || '', likesArray: newLikes});
  }

  // SAVE/UNSAVE POST
  const handleSavePost = (e: React.MouseEvent) => {
    e.stopPropagation();

    if(savedPostRecord) {
      // Remove save
      setIsSaved(false);
      deleteSavedPost(savedPostRecord.$id);
    } else {
      // Perform save
      savePost({ postId: post?.$id || '', userId });
      setIsSaved(true);
    }
  }

  return (
    <div className="flex justify-between items-center z-20">
      {/* LIKE ICON/STATS */}
      <div className="flex gap-2 mr-5">
        <img 
          src={checkIsLiked(likes, userId) 
            ? "/assets/icons/liked.svg" 
            : "/assets/icons/like.svg"}
          alt="like"
          width={20}
          height={20}
          onClick={handleLikePost}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>

      {/* SAVE ICON/STATS */}
      <div className="flex gap-2">
        {isSavingPost || isDeletingSaved 
          ? <Loader /> 
          : <img 
            src={isSaved 
              ? "/assets/icons/saved.svg" 
              : "/assets/icons/save.svg"}
            alt="save"
            width={20}
            height={20}
            onClick={handleSavePost}
            className="cursor-pointer"
          />
        }
      </div>
    </div>
  )
}

export default PostStats;