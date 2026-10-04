import { useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FaUserPlus, FaUserCheck } from "react-icons/fa";
import { toast } from "react-toastify";
import { authContext } from "../../context/AuthContext";

const storageKey = (myId) => `followedUsers:${myId}`;

function readFollowed(myId) {
  try {
    return JSON.parse(localStorage.getItem(storageKey(myId))) || {};
  } catch {
    return {};
  }
}

function saveFollowed(myId, userId, value) {
  try {
    const all = readFollowed(myId);
    all[userId] = value;
    localStorage.setItem(storageKey(myId), JSON.stringify(all));
  } catch {
    // storage unavailable: ignore
  }
}

export default function FollowButton({ userId, initialFollowing, size = "sm" }) {
  const queryClient = useQueryClient();
  const { userId: myId } = useContext(authContext) || {};
  const stateKey = ["followState", userId];

  // the server value wins when the API sends one, otherwise use what this browser remembers
  const startValue =
    typeof initialFollowing === "boolean"
      ? initialFollowing
      : Boolean(readFollowed(myId)[userId]);

  const { data: isFollowing } = useQuery({
    queryKey: stateKey,
    queryFn: () => startValue,
    initialData: startValue,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      axios.put(
        `https://route-posts.routemisr.com/users/${userId}/follow`,
        {},
        { headers: { token: localStorage.getItem("token") } }
      ),

    onMutate: () => {
      const previous = queryClient.getQueryData(stateKey) ?? false;
      queryClient.setQueryData(stateKey, !previous);
      return { previous };
    },

    onSuccess: (res) => {
      console.log("follow response:", res.data);
      const next = queryClient.getQueryData(stateKey);
      saveFollowed(myId, userId, next);
      queryClient.invalidateQueries({ queryKey: ["userProfile", userId] });
      toast.success(res.data?.message || "Done", {
        position: "top-center", autoClose: 1000, theme: "dark",
      });
    },

    onError: (err, _vars, context) => {
      console.log("follow error:", err.response?.status, err.response?.data);
      queryClient.setQueryData(stateKey, context?.previous ?? false);
      toast.error(err.response?.data?.message || "Error occurred ... try again later", {
        position: "top-center", autoClose: 1500, theme: "dark",
      });
    },
  });

  return (
    <button
      type="button"
      onClick={() => mutate()}
      disabled={isPending}
      className={`inline-flex shrink-0 items-center justify-center gap-1.5 rounded-4xl font-medium transition
        ${size === "lg" ? "px-5 py-3 text-sm" : "px-3 py-3 text-xs"}
        ${isFollowing
          ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
          : "bg-indigo-500 text-white hover:bg-indigo-400"}
        ${isPending ? "cursor-not-allowed opacity-50" : ""}`}
    >
      {isFollowing ? <FaUserCheck /> : <FaUserPlus />}
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
}