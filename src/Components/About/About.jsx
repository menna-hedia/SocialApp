import React from "react";

export default function About() {
  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-4xl font-bold text-indigo-500 text-center mb-6">
        About Our App
      </h1>

      <p className="text-gray-700 text-lg mb-6">
        Welcome to <span className="font-semibold text-indigo-600">Linked Posts</span>! 
        This application allows users to share posts, interact with others, and manage their personal content seamlessly.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 bg-gray-100 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-2">Posts</h2>
          <p className="text-gray-600">
            Users can create posts with text and images. All posts are displayed in a visually appealing feed.
          </p>
        </div>
        <div className="p-4 bg-gray-100 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-2">Profile</h2>
          <p className="text-gray-600">
            Each user has a personal profile with a photo and details. You can view and manage your own profile easily.
          </p>
        </div>
        <div className="p-4 bg-gray-100 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-2">Comments</h2>
          <p className="text-gray-600">
            Users can comment on posts, update their comments, and delete them if needed.
          </p>
        </div>
        <div className="p-4 bg-gray-100 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-2">Manage Posts</h2>
          <p className="text-gray-600">
            Users can create, update, and delete their own posts. The app ensures content is displayed dynamically after each action.
          </p>
        </div>
      </div>

      <p className="text-gray-700 text-lg mt-6">
        This app is designed to be interactive, user-friendly, and responsive, giving users full control over their posts and interactions.
      </p>
    </div>
  );
}