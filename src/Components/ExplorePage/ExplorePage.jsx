import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { LuSearch, LuX, LuCompass, LuChevronDown } from "react-icons/lu";
import LoaderScreen from "../LoaderScreen/LoaderScreen";
import PostCard from "../PostCard/PostCard";
import FollowButton from "../FollowButton/FollowButton";
import { extractList } from "../../utils/extractList";

const BASE = "https://route-posts.routemisr.com";
const FALLBACK_AVATAR = "https://avatars.githubusercontent.com/u/86160567?s=200&v=4";
const authHeaders = () => ({ headers: { token: localStorage.getItem("token") } });

// how many posts we ask the API for
const POSTS_FETCH_LIMIT = 200;

// the API rejects limit=100 with a 400, so we try these in order (20 is known to work)
const PEOPLE_LIMITS = [50, 20];
let workingPeopleLimit = null; // remembered after the first success, so no failed request is repeated

// how many items appear at first and with each "Show more" click
const POSTS_PAGE = 30;
const PEOPLE_PAGE = 30;

async function fetchPeople() {
  const limits = workingPeopleLimit ? [workingPeopleLimit] : PEOPLE_LIMITS;
  let lastError;

  for (const limit of limits) {
    try {
      const res = await axios.get(`${BASE}/users/suggestions`, {
        params: { limit },
        ...authHeaders(),
      });
      workingPeopleLimit = limit;
      return res.data;
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
}

function ShowMore({ onClick, remaining }) {
  return (
    <div className="mt-6 flex justify-center">
      <button
        type="button"
        onClick={onClick}
        className="flex items-center gap-2 rounded-full bg-indigo-500 px-6 py-2.5 text-sm font-medium text-white shadow-md transition hover:bg-indigo-400 active:scale-95"
      >
        Show more
        <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">{remaining}</span>
        <LuChevronDown className="text-lg" />
      </button>
    </div>
  );
}

export default function ExplorePage() {
  const [term, setTerm] = useState("");
  const [tab, setTab] = useState("posts");
  const [postsLimit, setPostsLimit] = useState(POSTS_PAGE);
  const [peopleLimit, setPeopleLimit] = useState(PEOPLE_PAGE);

  // separate key from Home so the bigger limit doesn't change Home's cached data,
  // invalidating ["getPosts"] still refreshes this one too (prefix match)
  const { data: postsData, isLoading } = useQuery({
    queryKey: ["getPosts", "explore"],
    queryFn: () =>
      axios
        .get(`${BASE}/posts`, {
          params: { sort: "-createdAt", limit: POSTS_FETCH_LIMIT },
          ...authHeaders(),
        })
        .then((res) => res.data),
  });

  const {
    data: peopleData,
    isLoading: peopleLoading,
    isError: peopleError,
    error: peopleErr,
  } = useQuery({
    queryKey: ["followSuggestions", "explore"],
    queryFn: fetchPeople,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const query = term.trim().toLowerCase();

  const posts = postsData?.data?.posts || [];
  const people = extractList(peopleData);

  const matchedPosts = useMemo(() => {
    if (!query) return posts;
    return posts.filter(
      (p) =>
        p.body?.toLowerCase().includes(query) ||
        p.user?.name?.toLowerCase().includes(query) ||
        p.user?.username?.toLowerCase().includes(query)
    );
  }, [posts, query]);

  const matchedPeople = useMemo(() => {
    if (!query) return people;
    return people.filter(
      (u) =>
        u.name?.toLowerCase().includes(query) ||
        u.username?.toLowerCase().includes(query)
    );
  }, [people, query]);

  if (isLoading) return <LoaderScreen />;

  // a new search starts again from the first page
  function updateTerm(value) {
    setTerm(value);
    setPostsLimit(POSTS_PAGE);
    setPeopleLimit(PEOPLE_PAGE);
  }

  const shownPosts = matchedPosts.slice(0, postsLimit);
  const shownPeople = matchedPeople.slice(0, peopleLimit);

  const tabClass = (name) =>
    `rounded-full px-4 py-1.5 text-sm font-medium transition ${
      tab === name ? "bg-indigo-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`;

  const emptyBox = "rounded-xl bg-white p-8 text-center shadow-md";

  return (
    <div className="w-full pb-10">
      <div className="mb-6 rounded-xl bg-white p-6 shadow-md">
        <div className="mb-4 flex items-center gap-3">
          <LuCompass className="text-3xl text-indigo-500" />
          <h1 className="text-2xl font-bold text-gray-800">Explore</h1>
        </div>

        <div className="relative">
          <LuSearch className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-lg text-gray-400" />
          <input
            type="text"
            value={term}
            onChange={(e) => updateTerm(e.target.value)}
            placeholder="Search posts or people..."
            aria-label="Search"
            className="w-full rounded-full bg-gray-100 py-3 ps-11 pe-11 text-sm text-gray-800 outline-indigo-500"
          />
          {term && (
            <button
              type="button"
              onClick={() => updateTerm("")}
              aria-label="Clear search"
              className="absolute end-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 hover:bg-gray-200"
            >
              <LuX />
            </button>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <button type="button" onClick={() => setTab("posts")} className={tabClass("posts")}>
            Posts 
          </button>
          <button type="button" onClick={() => setTab("people")} className={tabClass("people")}>
            People {peopleLoading ? "..." : ""}
          </button>
        </div>
      </div>

      {tab === "posts" ? (
        matchedPosts.length === 0 ? (
          <p className={`${emptyBox} text-gray-500`}>
            {query ? `No posts match "${term}".` : "No posts yet."}
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 xl:grid-cols-3">
              {shownPosts.map((post) => (
                <PostCard key={post._id} postInfo={post} queryKey={["getPosts"]} compact />
              ))}
            </div>

            {matchedPosts.length > postsLimit && (
              <ShowMore
                remaining={matchedPosts.length - postsLimit}
                onClick={() => setPostsLimit((n) => n + POSTS_PAGE)}
              />
            )}
          </>
        )
      ) : peopleLoading ? (
        <p className={`${emptyBox} text-gray-500`}>Loading people...</p>
      ) : peopleError ? (
        <p className={`${emptyBox} text-red-500`}>
          Could not load people:{" "}
          {peopleErr?.response?.data?.message || peopleErr?.message || "unknown error"}
        </p>
      ) : matchedPeople.length === 0 ? (
        <p className={`${emptyBox} text-gray-500`}>
          {query ? `No people match "${term}".` : "No suggestions right now."}
        </p>
      ) : (
        <>
          <ul className="divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-md">
            {shownPeople.map((u) => {
              const id = u._id || u.id;
              return (
                <li key={id} className="flex items-center gap-4 p-4">
                  <Link to={`/user/${id}`} className="flex min-w-0 flex-1 items-center gap-4">
                    <img
                      src={u.photo}
                      alt={u.name}
                      className="h-14 w-14 shrink-0 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = FALLBACK_AVATAR;
                      }}
                    />
                    <div className="min-w-0">
                      <p className="truncate font-bold text-gray-800">{u.name}</p>
                      {u.username && (
                        <p className="truncate text-sm text-gray-500">@{u.username}</p>
                      )}
                    </div>
                  </Link>
                  <FollowButton
                    userId={id}
                    initialFollowing={
                      typeof u.isFollowing === "boolean" ? u.isFollowing : undefined
                    }
                    size="lg"
                  />
                </li>
              );
            })}
          </ul>

          {matchedPeople.length > peopleLimit && (
            <ShowMore
              remaining={matchedPeople.length - peopleLimit}
              onClick={() => setPeopleLimit((n) => n + PEOPLE_PAGE)}
            />
          )}
        </>
      )}
    </div>
  );
}