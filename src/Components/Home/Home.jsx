import axios from "axios";
import PostCard from "./../PostCard/PostCard";
import LoaderScreen from "../LoaderScreen/LoaderScreen";
import { useQuery } from "@tanstack/react-query";
import PostCreation from "../PostCreation/PostCreation";
import FollowSuggestions from "../FollowSuggestions/FollowSuggestions";

export default function Home() {
  function getAllPosts() {
    return axios
      .get("https://route-posts.routemisr.com/posts", {
        params: { sort: "-createdAt" },
        headers: { token: localStorage.getItem("token") },
      })
      .then((response) => response.data);
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ["getPosts"],
    queryFn: getAllPosts,
  });

  if (isLoading) {
    return <LoaderScreen />;
  }

  if (isError) {
    return (
      <div className="mx-auto mb-5 block w-100 rounded-md bg-red-500 px-4 py-3 text-center text-sm text-white">
        <p>Error occured, please try again...</p>
      </div>
    );
  }

  const allPosts = data.data.posts;

return (
  <div className="pb-10 xl:grid xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start xl:gap-6">
    {/* feed */}
    <div className="min-w-0">
      {allPosts.map((post) => (
        <PostCard key={post._id} postInfo={post} queryKey={["getPosts"]} />
      ))}
    </div>

    {/* suggestions: xl and up */}
    <div className="hidden xl:sticky xl:top-32 xl:block xl:self-start">
      <FollowSuggestions />
    </div>
  </div>
);
}