import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { profileContext } from "../../context/ProfileContext";
import { authContext } from "../../context/AuthContext";
import LoaderScreen from "../LoaderScreen/LoaderScreen";
import ChangePassword from "../ChangePassword/ChangePassword";
import PostCard from "../PostCard/PostCard";
import PostCreation from "../PostCreation/PostCreation";
import ProfilePhotoUpload from "../ProfilePhotoUpload/ProfilePhotoUpload";

function formatDate(value) {
  if (!value) return "-";
  const d = new Date(value);
  return isNaN(d) ? "-" : d.toLocaleDateString();
}

export default function ProfilePage() {
  const { profile, isLoading } = useContext(profileContext);
  const { userId } = useContext(authContext);

  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // hooks must run before any early return
  const { data: postsData, isLoading: postsLoading } = useQuery({
    queryKey: ["userPosts", userId],
    enabled: Boolean(userId),
    queryFn: () =>
      axios
        .get(`https://route-posts.routemisr.com/users/${userId}/posts`, {
          headers: { token: localStorage.getItem("token") },
        })
        .then((res) => res.data),
  });

  if (isLoading) return <LoaderScreen />;
  if (!profile) return <p className="text-white">No profile data found.</p>;

  const {
    cover,
    photo,
    name,
    username,
    email,
    dateOfBirth,
    gender,
    createdAt,
    followersCount = 0,
    followingCount = 0,
    bookmarksCount = 0,
  } = profile;

  const posts = postsData?.data?.posts || [];

  const stats = [
    { label: "Posts", value: posts.length },
    { label: "Followers", value: followersCount },
    { label: "Following", value: followingCount },
    { label: "Saved", value: bookmarksCount },
  ];

  return (
    <div className="w-full pb-10">
      {/* profile info */}
      <div className="mb-6 w-full overflow-hidden rounded-xl bg-white p-4 shadow-md sm:p-6">
        {cover && (
          <div className="mb-4 h-36 w-full sm:h-48 lg:h-56">
            <img src={cover} alt="Cover" className="h-full w-full rounded-xl object-cover" />
          </div>
        )}

        {/* stacked and centered on mobile, side by side from sm and up */}
        <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:text-start">
          <ProfilePhotoUpload photo={photo} />

          <div className="w-full min-w-0 sm:flex-1">
            <h2 className="break-words text-xl font-bold sm:text-2xl">{name}</h2>
            <p className="break-all text-gray-500">@{username}</p>
            <p className="break-all text-gray-500">{email}</p>
            <p className="text-gray-500">Born: {formatDate(dateOfBirth)}</p>
            <p className="capitalize text-gray-500">Gender: {gender}</p>
            <p className="text-sm text-gray-400">Joined: {formatDate(createdAt)}</p>
          </div>

          <button
            type="button"
            onClick={() => setShowPasswordModal(true)}
            className="w-full rounded-4xl bg-indigo-500 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-400 sm:w-auto sm:shrink-0"
          >
            Change Password
          </button>
          <PostCreation asButton />
        </div>

        {showPasswordModal && (
          <ChangePassword onClose={() => setShowPasswordModal(false)} />
        )}

        {/* stats */}
        <div className="mt-6 grid grid-cols-2 gap-3 rounded-xl bg-gray-100 p-3 text-center sm:grid-cols-4 sm:gap-4 sm:p-4">
          {stats.map(({ label, value }) => (
            <div key={label} className="rounded-lg bg-white/60 py-2 sm:bg-transparent">
              <p className="text-lg font-bold">{value}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          ))}
        </div>
      </div>

{/* my posts header + add post */}
<div className="mb-4 flex items-center justify-between gap-3">
  <h3 className="text-lg font-bold text-gray-900">
    My Posts <span className="text-gray-400">({posts.length})</span>
  </h3>

</div>

      {postsLoading && <LoaderScreen />}

      {!postsLoading && posts.length === 0 && (
        <p className="rounded-xl bg-white p-8 text-center text-gray-500 shadow-md">
          You haven't posted anything yet. Tap "Add post" to share your first one.
        </p>
      )}

      <div className="grid grid-cols-1 items-start gap-4 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post._id} postInfo={post} queryKey={["userPosts", userId]} compact />
        ))}
      </div>
      
    </div>
  );
}