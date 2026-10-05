import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useDisclosure } from "@heroui/react";
import { LuHeart, LuMessageCircle, LuShare2, LuBookmark } from "react-icons/lu";
import { toast } from "react-toastify";
import CommentsModal from "../CommentsModal/CommentsModal";
import ShareModal from "../ShareModal/ShareModal";
import { useBookmarks, getBookmarkedPosts } from "../../hooks/useBookmarks";

const BASE = "https://route-posts.routemisr.com";
const authHeaders = () => ({ headers: { token: localStorage.getItem("token") } });
const toastOpts = { position: "top-center", autoClose: 1000, theme: "dark" };

export default function PostActions({
  postId,
  likesCount = 0,
  commentsCount = 0,
  sharesCount = 0,
  commentsQueryKey,
}) {
  const queryClient = useQueryClient();
  const comments = useDisclosure();
  const share = useDisclosure();

  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(likesCount);
  const [shares, setShares] = useState(sharesCount);

  // saved state comes from the shared bookmarks list, so it survives a refresh
  const { data: bookmarksData } = useBookmarks();
  const savedIds = new Set(getBookmarkedPosts(bookmarksData).map((p) => p?._id || p?.post?._id));
  const [savedOverride, setSavedOverride] = useState(null);
  const saved = savedOverride ?? savedIds.has(postId);

  const { mutate: toggleLike } = useMutation({
    mutationFn: () => axios.put(`${BASE}/posts/${postId}/like`, null, authHeaders()),
    onMutate: () => {
      const previous = { liked, likes };
      setLiked(!liked);
      setLikes((c) => (liked ? c - 1 : c + 1));
      return previous;
    },
    onError: (_err, _vars, previous) => {
      setLiked(previous.liked);
      setLikes(previous.likes);
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
      console.log("bookmark error:", err.response?.status, err.response?.data);
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