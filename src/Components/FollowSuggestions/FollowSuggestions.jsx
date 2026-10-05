import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import { LuUsers } from "react-icons/lu";
import FollowButton from "../FollowButton/FollowButton";

const FALLBACK_AVATAR = "https://avatars.githubusercontent.com/u/86160567?s=200&v=4";
const INITIAL_COUNT = 5;

// finds the users array wherever the API puts it
function extractList(res) {
  const d = res?.data;
  if (Array.isArray(d)) return d;
  if (d && typeof d === "object") {
    const firstArray = Object.values(d).find(Array.isArray);
    if (firstArray) return firstArray;
  }
  return [];
}

function Skeleton() {
  return (
    <div className="flex animate-pulse items-center gap-4 py-3">
      <div className="h-16 w-16 rounded-full bg-gray-200" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-28 rounded bg-gray-200" />
        <div className="h-3 w-20 rounded bg-gray-200" />
      </div>
    </div>
  );
}

export default function FollowSuggestions() {
  const [showAll, setShowAll] = useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["followSuggestions"],
    queryFn: () =>
      axios
        .get("https://route-posts.routemisr.com/users/suggestions", {
          params: { limit: 20 },
          headers: { token: localStorage.getItem("token") },
        })
        .then((res) => res.data),
  });

  const suggestions = extractList(data);
  const visible = showAll ? suggestions : suggestions.slice(0, INITIAL_COUNT);

  if (isError) return null;

  return (
    <aside className="flex h-fit max-h-[calc(100vh-9rem)] flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-lg">
      <div className="mb-2 flex shrink-0 items-center gap-2">
        <LuUsers className="text-xl text-indigo-500" />
        <h3 className="text-lg font-bold text-gray-800">Who to follow</h3>
      </div>

      {/* the list scrolls inside the card when it gets too tall */}
      <div className="thin-scrollbar min-h-0 flex-1 divide-y divide-gray-100 overflow-y-auto pe-1">
        {isLoading && Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} />)}

        {!isLoading && suggestions.length === 0 && (
          <p className="py-4 text-center text-sm text-gray-500">No suggestions right now.</p>
        )}

        {visible.map((user) => {
          const id = user._id || user.id;
          return (
            <div key={id} className="flex items-center gap-4 py-3">
              <Link to={`/user/${id}`} className="flex min-w-0 flex-1 items-center gap-4">
                <img
                  src={user.photo}
                  alt={user.name}
                  className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-indigo-100"
                  onError={(e) => (e.target.src = FALLBACK_AVATAR)}
                />
                <div className="min-w-0">
                  <p className="truncate text-base font-bold text-gray-800">{user.name}</p>
                  {user.username && (
                    <p className="truncate text-sm text-gray-500">@{user.username}</p>
                  )}
                </div>
              </Link>

              <FollowButton userId={id} initialFollowing={Boolean(user.isFollowing)} size="lg" />
            </div>
          );
        })}
      </div>

      {suggestions.length > INITIAL_COUNT && (
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="mt-2 w-full shrink-0 rounded-xl py-2 text-sm font-medium text-indigo-500 hover:bg-indigo-50"
        >
          {showAll ? "Show less" : "Show more"}
        </button>
      )}
    </aside>
  );
}