import React, { useContext, useState } from "react";
import { profileContext } from "../../context/ProfileContext";
import LoaderScreen from "../LoaderScreen/LoaderScreen";
import ChangePassword from "../ChangePassword/ChangePassword";

export default function ProfilePage() {
  const { profile, isLoading } = useContext(profileContext);

  const [showPasswordModal, setShowPasswordModal] = useState(false);


  if (isLoading) return <LoaderScreen />;
  if (!profile) return <p>No profile data found.</p>;

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
    bookmarksCount
  } = profile;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      {/* Cover Image */}
      {cover && (
        <div className="h-48 w-full mb-4">
          <img src={cover} alt="Cover" className="w-full h-full object-cover rounded-xl" />
        </div>
      )}

      {/* Profile Info */}
      <div className="flex items-center gap-6">
        <img
          src={photo}
          alt="Profile"
          className="w-28 h-28 rounded-full object-cover border-2 border-gray-300"
        />
        <div>
          <h2 className="text-2xl font-bold">{name}</h2>
          <p className="text-gray-500">@{username}</p>
          <p className="text-gray-500">{email}</p>
          <p className="text-gray-500">Born: {new Date(dateOfBirth).toLocaleDateString()}</p>
          <p className="text-gray-500">Gender: {gender}</p>
          <p className="text-gray-400 text-sm">Joined: {new Date(createdAt).toLocaleDateString()}</p>
        </div>
        <button
  onClick={() => setShowPasswordModal(true)}
  className="mx-auto block min-w-32 py-3 px-6 text-sm font-medium rounded-4xl text-white bg-indigo-500 hover:bg-indigo-400"
>
  Change Password
</button>

{showPasswordModal && (
  <ChangePassword onClose={() => setShowPasswordModal(false)} />
)}
      </div>

      {/* Stats */}
      <div className="flex justify-around mt-6 bg-gray-100 p-4 rounded-xl text-center">
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
          <p className="text-gray-500">Bookmarks</p>
        </div>
      </div>
    </div>
  );
}