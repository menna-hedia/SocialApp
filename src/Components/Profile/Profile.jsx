import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { profileContext } from "../../context/ProfileContext";
import { authContext } from "../../context/AuthContext";
import LoaderScreen from "../LoaderScreen/LoaderScreen";
import ChangePassword from "../ChangePassword/ChangePassword";
import PostCard from "../PostCard/PostCard";
import ProfilePhotoUpload from "../ProfilePhotoUpload/ProfilePhotoUpload";

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
    followersCount,
    followingCount,
    bookmarksCount,
  } = profile;

  const posts = postsData?.data?.posts || [];

  return (
    <div className="w-full pb-10">
      {/* profile info: fills the full width next to the sidebar */}
      <div className="mb-6 w-full rounded-xl bg-white p-4 shadow-md sm:p-6">
        {cover && (
          <div className="mb-4 h-40 w-full sm:h-56">
            <img src={cover} alt="Cover" className="h-full w-full rounded-xl object-cover" />
          </div>
        )}

        {/* stacked on mobile, side by side from sm and up */}
        <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-start">
          <ProfilePhotoUpload photo={photo} />

          <div className="w-full min-w-0 sm:flex-1">
            <h2 className="break-words text-2xl font-bold">{name}</h2>
            <p className="text-gray-500">@{username}</p>
            <p className="break-all text-gray-500">{email}</p>
            <p className="text-gray-500">Born: {new Date(dateOfBirth).toLocaleDateString()}</p>
            <p className="capitalize text-gray-500">Gender: {gender}</p>
            <p className="text-sm text-gray-400">Joined: {new Date(createdAt).toLocaleDateString()}</p>
          </div>

          <button
            onClick={() => setShowPasswordModal(true)}
            className="w-full rounded-4xl bg-indigo-500 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-400 sm:ms-auto sm:w-auto sm:min-w-32"
          >
            Change Password
          </button>
        </div>

        {showPasswordModal && (
          <ChangePassword onClose={() => setShowPasswordModal(false)} />
        )}

        {/* stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl bg-gray-100 p-4 text-center sm:grid-cols-4">
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
          <div>
            <p className="font-bold">{bookmarksCount}</p>
            <p className="text-gray-500">Saved</p>
          </div>
        </div>
      </div>

      {/* my posts */}
      {postsLoading && <LoaderScreen />}

      {!postsLoading && posts.length === 0 && (
        <p className="mt-4 text-center text-gray-400">You haven't posted anything yet.</p>
      )}

      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post._id} postInfo={post} queryKey={["userPosts", userId]} compact />
        ))}
      </div>
    </div>
  );
}