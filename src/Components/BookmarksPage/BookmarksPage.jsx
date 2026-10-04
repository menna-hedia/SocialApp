import { LuBookmark } from "react-icons/lu";
import LoaderScreen from "../LoaderScreen/LoaderScreen";
import PostCard from "../PostCard/PostCard";
import { useBookmarks, getBookmarkedPosts } from "../../hooks/useBookmarks";

export default function BookmarksPage() {
  const { data, isLoading, isError } = useBookmarks();

  if (isLoading) return <LoaderScreen />;

  if (isError) {
    return (
      <p className="rounded-xl bg-white p-6 text-center text-red-500 shadow-md">
        Could not load your saved posts.
      </p>
    );
  }

  // each item may be the post itself or wrap it in a "post" field
  const posts = getBookmarkedPosts(data)
    .map((item) => item?.post || item)
    .filter((p) => p?._id && p?.user);

  return (
    <div className="w-full pb-10">
      <div className="mb-6 flex items-center gap-3 rounded-xl bg-white p-6 shadow-md">
        <LuBookmark className="text-3xl text-indigo-500" />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Saved Posts</h1>
          <p className="text-sm text-gray-500">{posts.length} saved</p>
        </div>
      </div>

      {posts.length === 0 ? (
        <p className="rounded-xl bg-white p-8 text-center text-gray-500 shadow-md">
          Nothing saved yet. Tap the bookmark icon on any post to keep it here.
        </p>
      ) : (
        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post._id} postInfo={post} queryKey={["bookmarks"]} compact />
          ))}
        </div>
      )}
    </div>
  );
}