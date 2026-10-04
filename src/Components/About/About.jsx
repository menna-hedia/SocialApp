import React from "react";
import {
  LuImage,
  LuUser,
  LuMessageCircle,
  LuPencil,
  LuHeart,
  LuUsers,
} from "react-icons/lu";

const features = [
  {
    icon: LuImage,
    title: "Posts",
    text: "Create posts with text and images, and browse everything in a clean, up-to-date feed.",
  },
  {
    icon: LuPencil,
    title: "Manage Posts",
    text: "Edit or delete your own posts at any time. The feed updates right after each action.",
  },
  {
    icon: LuMessageCircle,
    title: "Comments",
    text: "Comment on posts with text or an image, then edit or delete your comments whenever you need.",
  },
  {
    icon: LuHeart,
    title: "Likes & Shares",
    text: "React to posts you enjoy and share them with others in one click.",
  },
  {
    icon: LuUsers,
    title: "Follow People",
    text: "Follow other users, open their profiles, and discover new people from the suggestions list.",
  },
  {
    icon: LuUser,
    title: "Profile",
    text: "Every user has a personal profile with a photo, details, stats, and all of their posts.",
  },
];

const stack = [
  "React",
  "Vite",
  "TanStack Query",
  "React Router",
  "Axios",
  "JWT Authentication",
  "HeroUI",
  "Tailwind CSS",
  "Framer Motion",
];

export default function About() {
  return (
    <div className="w-full rounded-xl bg-white p-8 shadow-md">
      <h1 className="mb-4 text-center text-4xl font-bold text-indigo-600">
        About MySocialApp
      </h1>

      <p className="mx-auto mb-8 max-w-3xl text-center text-lg text-gray-700">
        Welcome to{" "}
        <span className="font-semibold text-indigo-600">MySocialApp</span>! Share your
        thoughts, interact with others, and manage your own content in one simple,
        responsive place.
      </p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {features.map(({ icon: Icon, title, text }) => (
          <div
            key={title}
            className="rounded-xl border border-gray-100 bg-gray-50 p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
              <Icon className="text-2xl" />
            </div>
            <h2 className="mb-2 text-xl font-bold text-gray-800">{title}</h2>
            <p className="text-gray-600">{text}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <h2 className="mb-4 text-2xl font-bold text-gray-800">Built With</h2>
        <div className="flex flex-wrap justify-center gap-2">
          {stack.map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-indigo-50 px-4 py-1.5 text-sm font-medium text-indigo-600"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <p className="mx-auto mt-10 max-w-3xl text-center text-lg text-gray-700">
        The app is interactive, user-friendly, and responsive, giving you full control over
        your posts and your connections.
      </p>
    </div>
  );
}