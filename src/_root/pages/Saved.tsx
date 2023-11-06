import { Models } from "appwrite";

import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations";
import Loader from "@/components/shared/Loader";
import GridPostList from "@/components/shared/GridPostList";

const Saved = () => {
  // Fetch current user
  const { data: currentUser } = useGetCurrentUser();

  const savePosts = currentUser?.save.map((savePost: Models.Document) => ({
    ...savePost.post,
    creator: {
      imageUrl: currentUser.imageUrl,
    },
  })).reverse();

  return (
    <div className="saved-container">
      <div className="flex gap-2 w-full max-w-5xl">
        <img 
          src="/assets/icons/save.svg"
          alt="save"
          width={36}
          height={36}
          className="invert-white"
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h2>
      </div>

      {!currentUser ? (
        // If no user show loader
        <Loader />
      ) : (
        <ul>
          {/* If no posts are saved */}
          {savePosts.length === 0 ? (
            <li>
              <p>No available posts</p>
            </li>
          ) : (
            // Display saved posts available
            <GridPostList posts={savePosts} showStats={false} />
          )}
        </ul>
      )}
    </div>
  )
}

export default Saved;