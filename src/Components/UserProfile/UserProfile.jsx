import { Navigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext } from "react";
import { authContext } from "../../context/AuthContext";
import LoaderScreen from "../LoaderScreen/LoaderScreen";
import FollowButton from "../FollowButton/FollowButton";
import PostCard from "../PostCard/PostCard";

const BASE = "https://route-posts.routemisr.com";
const authHeaders = () => ({ headers: { token: localStorage.getItem("token") } });
const FALLBACK_AVATAR = "https://avatars.githubusercontent.com/u/86160567?s=200&v=4";

export default function UserProfile() {
  const { userId } = useParams();
  const { userId: myId } = useContext(authContext);
  const isMe = userId === myId;

  const { data: profileData, isLoading, isError } = useQuery({
    queryKey: ["userProfile", userId],
    enabled: !isMe,
    queryFn: () => axios.get(`${BASE}/users/${userId}/profile`, authHeaders()).then((r) => r.data),
  });

  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ["userPosts", userId],
    enabled: !isMe,
    queryFn: () => axios.get(`${BASE}/users/${userId}/posts`, authHeaders()).then((r) => r.data),
  });

  // visiting your own card should open your own profile page
  if (isMe) return <Navigate to="/profile" replace />;

  if (isLoading) return <LoaderScreen />;
  if (isError) {
    return (
      <p className="rounded-xl bg-white p-6 text-center text-red-500 shadow-md">
        Could not load this profile.
      </p>
    );
  }

  const user = profileData?.data?.user || profileData?.data || {};
  const {
    cover,
    photo,
    name,
    username,
    createdAt,
    followersCount = 0,
    followingCount = 0,
    isFollowing,
  } = user;
  const posts = postsData?.data?.posts || [];

  return (
    <div className="w-full pb-10">
      {/* profile info: fills the full width next to the sidebar */}
      <div className="mb-6 w-full rounded-xl bg-white p-6 shadow-md">
        {cover && (
          <div className="mb-4 h-56 w-full">
            <img src={cover} alt="Cover" className="h-full w-full rounded-xl object-cover" />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-6">
          <img
            src={photo}
            alt="Profile"
            className="h-28 w-28 rounded-full border-2 border-gray-300 object-cover"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_AVATAR;
            }}
          />

          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold">{name}</h2>
            <p className="text-gray-500">@{username}</p>
            {createdAt && (
              <p className="text-sm text-gray-400">
                Joined: {new Date(createdAt).toLocaleDateString()}
              </p>
            )}
          </div>

          <div className="ms-auto">
            <FollowButton
              userId={userId}
              initialFollowing={typeof isFollowing === "boolean" ? isFollowing : undefined}
              size="lg"
            />
          </div>
        </div>

        {/* stats */}
        <div className="mt-6 grid grid-cols-3 gap-4 rounded-xl bg-gray-100 p-4 text-center">
          <div>
            <p className="font-bold">{posts.length}</p>
            <p className="text-gray-500">Posts</p>
          </div>
          <div>
            <p className="font-bold">{followersCount}</p>
            <p className="text-gray-500">Followers</p>
          </div>
          <div>
            <p className="font-bold">{followingCount}</p>
            <p className="text-gray-500">Following</p>
          </div>
        </div>
      </div>

      {/* posts */}
      {postsLoading && <LoaderScreen />}

      {!postsLoading && posts.length === 0 && (
        <p className="rounded-xl bg-white p-8 text-center text-gray-500 shadow-md">
          This user hasn't posted anything yet.
        </p>
      )}

      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post._id} postInfo={post} queryKey={["userPosts", userId]} compact />
        ))}
      </div>
    </div>
  );
}