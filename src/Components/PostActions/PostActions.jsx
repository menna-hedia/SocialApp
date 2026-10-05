import { useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useDisclosure } from "@heroui/react";
import { LuHeart, LuMessageCircle, LuShare2, LuBookmark } from "react-icons/lu";
import { toast } from "react-toastify";
import CommentsModal from "../CommentsModal/CommentsModal";
import ShareModal from "../ShareModal/ShareModal";
import { useBookmarks, getBookmarkedPosts } from "../../hooks/useBookmarks";
import { authContext } from "../../context/AuthContext";

const BASE = "https://route-posts.routemisr.com";
const authHeaders = () => ({ headers: { token: localStorage.getItem("token") } });
const toastOpts = { position: "top-right", autoClose: 1000 };

export default function PostActions({
  postId,
  post,
  likesCount = 0,
  commentsCount = 0,
  sharesCount = 0,
  commentsQueryKey,
}) {
  const queryClient = useQueryClient();
  const { userId } = useContext(authContext) || {};
  const comments = useDisclosure();
  const share = useDisclosure();

  const likeStateKey = ["postLike", userId, postId];
  const serverLiked =
    typeof post?.isLiked === "boolean"
      ? post.isLiked
      : typeof post?.liked === "boolean"
        ? post.liked
        : Array.isArray(post?.likes)
          ? post.likes.some((like) => (like?._id || like) === userId)
          : undefined;
  const { data: likeState } = useQuery({
    queryKey: likeStateKey,
    queryFn: () => ({ liked: serverLiked ?? false, likes: likesCount }),
    initialData: { liked: serverLiked ?? false, likes: likesCount },
    staleTime: Infinity,
    gcTime: Infinity,
    enabled: false,
  });
  const liked = likeState.liked;
  const likes = likeState.likes;
  const [shares, setShares] = useState(sharesCount);

  useEffect(() => {
    const current = queryClient.getQueryData(["postLike", userId, postId]);
    if (serverLiked === undefined && likesCount === current?.likes) return;
    queryClient.setQueryData(["postLike", userId, postId], (current) => ({
      liked: serverLiked ?? current?.liked ?? false,
      likes: likesCount,
    }));
  }, [serverLiked, likesCount, queryClient, userId, postId]);

  // saved state comes from the shared bookmarks list, so it survives a refresh
  const { data: bookmarksData } = useBookmarks();
  const savedIds = new Set(getBookmarkedPosts(bookmarksData).map((p) => p?._id || p?.post?._id));
  const [savedOverride, setSavedOverride] = useState(null);
  const saved = savedOverride ?? savedIds.has(postId);

  const { mutate: toggleLike } = useMutation({
    mutationFn: () => axios.put(`${BASE}/posts/${postId}/like`, null, authHeaders()),
    onMutate: () => {
      const previous = queryClient.getQueryData(likeStateKey) ?? {
        liked: serverLiked ?? false,
        likes: likesCount,
      };
      queryClient.setQueryData(likeStateKey, {
        liked: !previous.liked,
        likes: Math.max(0, previous.likes + (previous.liked ? -1 : 1)),
      });
      return { previous };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getPosts"] });
      queryClient.invalidateQueries({ queryKey: ["getPostDetails", postId] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(likeStateKey, context.previous);
      toast.error("Could not update like", toastOpts);
    },
  });

  const { mutate: toggleSave } = useMutation({
    mutationFn: () => axios.put(`${BASE}/posts/${postId}/bookmark`, {}, authHeaders()),
    onMutate: () => {
      const previous = saved;
      setSavedOverride(!previous);
      return { previous };
    },
    onSuccess: async (_res, _vars, context) => {
      await queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      setSavedOverride(null);
      toast.success(context?.previous ? "Removed from saved" : "Post saved", toastOpts);
    },
    onError: (err, _vars, context) => {
      setSavedOverride(context?.previous ?? null);
      toast.error(err.response?.data?.message || "Could not save post", toastOpts);
    },
  });

  const base =
    "flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium text-gray-500 transition hover:bg-indigo-50 hover:text-indigo-500";

  return (
    <>
      <div className="flex items-center gap-1 border-t border-gray-200 pt-3">
        <button
          type="button"
          onClick={() => toggleLike()}
          className={`${base} ${liked ? "!text-indigo-500" : ""}`}
          aria-label="Like"
        >
          <LuHeart className={`text-xl ${liked ? "fill-current" : ""}`} />
          <span>{likes}</span>
        </button>

        <button type="button" onClick={comments.onOpen} className={base} aria-label="Comments">
          <LuMessageCircle className="text-xl" />
          <span>{commentsCount}</span>
        </button>

        <button type="button" onClick={share.onOpen} className={base} aria-label="Share">
          <LuShare2 className="text-xl" />
          <span>{shares}</span>
        </button>

        <button
          type="button"
          onClick={() => toggleSave()}
          className={`${base} ${saved ? "!text-indigo-500" : ""}`}
          aria-label={saved ? "Remove from saved" : "Save post"}
        >
          <LuBookmark className={`text-xl ${saved ? "fill-current" : ""}`} />
        </button>
      </div>

      <CommentsModal
        postId={postId}
        isOpen={comments.isOpen}
        onOpenChange={comments.onOpenChange}
        queryKey={commentsQueryKey}
      />

      <ShareModal
        postId={postId}
        isOpen={share.isOpen}
        onOpenChange={share.onOpenChange}
        onShared={() => setShares((c) => c + 1)}
      />
    </>
  );
}