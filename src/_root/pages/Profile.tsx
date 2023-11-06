import { Route, Routes, Link, Outlet, useLocation, useParams } from "react-router-dom";

import { useUserContext } from "@/context/AuthContext";
import { useGetUserById } from "@/lib/react-query/queriesAndMutations";

import { LikedPosts } from "@/_root/pages";
import { Button } from "@/components/ui";
import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";

interface StatBlockProps {
  value: string | number;
  label: string;
}

/* Displays specified user stats */
const StatBlock = ({ value, label }: StatBlockProps) => (
  <div className="flex-center gap-2">
    <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
    <p className="small-medium lg:base-medium text-light-2">{label}</p>
  </div>
);

const Profile = () => {
  const { id } = useParams();
  const { user } = useUserContext();
  const { pathname } = useLocation();

  const { data: currentUser } = useGetUserById(id || '');

  if(!currentUser) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          {/* PROFILE IMAGE */}
          <img 
            src={currentUser.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="profile"
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
          />

          <div className="flex flex-col flex-1 justify-between md:mt-2">
            {/* NAME AND USERNAME */}
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                {currentUser.name}
              </h1>

              <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                @{currentUser.username}
              </p>
            </div>

            {/* POSTS, FOLLOWERS, AND FOLLOWING COUNT */}
            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              <StatBlock value={currentUser.posts.length} label="Posts" />
              <StatBlock value={20} label="Followers" />
              <StatBlock value={20} label="Following" />
            </div>

            <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
              {currentUser.bio}
            </p>
          </div>

          <div className="flex justify-center gap-4">
            {/* EDIT LINK - ONLY SHOWS IF USER IS OWNER OF PROFILE */}
            <div className={`${user.id !== currentUser.$id && "hidden"}`}>
              <Link 
                to={`/update-profile/${currentUser.$id}`}
                className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${user.id !== currentUser.$id && "hidden"}`}
              >
                <img 
                  src="/assets/icons/edit.svg"
                  alt="edit"
                  width={20}
                  height={20}
                />
                <p className="flex whitespace-nowrap small-medium">Edit Profile</p>
              </Link>
            </div>

            {/* FOLLOW BUTTON - ONLY SHOWS IF USER ISN'T OWNER OF PROFILE */}
            <div className={`${user.id === id && "hidden"}`}>
              <Button type="button" className="shad-button_primary px-8">
                Follow
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* IF CURRENT USER IS ON THEIR OWN PROFILE */}
      {currentUser.$id === user.id && (
        <div className="flex max-w-5xl w-full">
          {/* SEND BACK TO USER PROFILE FOR USER'S POSTS */}
          <Link
            to={`/profile/${id}`}
            className={`${pathname === `/profile/${id}` && "!bg-dark-3"} profile-tab rounded-l-lg`}
          >
            <img 
              src="/assets/icons/posts.svg"
              alt="posts"
              width={20}
              height={20}
            />
            Posts
          </Link>

          {/* SEND TO USER'S LIKED POSTS */}
          <Link 
            to={`/profile/${id}/liked-posts`}
            className={`${pathname === `/profile/${id}/liked-posts` && "!bg-dark-3"} profile-tab rounded-r-lg`}
          >
            <img 
              src="/assets/icons/like.svg"
              alt="like"
              width={20}
              height={20}
            />
            Liked Posts
          </Link>
        </div>
      )}

      <Routes>
        <Route index element={<GridPostList posts={currentUser.posts} showUser={false} />}/>
        {/* IF CURRENT USER IS ON THEIR OWN PROFILE */}
        {currentUser.$id === user.id && (
          <Route path="/liked-posts" element={<LikedPosts />} />
        )}
      </Routes>
      <Outlet />
    </div>
  )
}

export default Profile;