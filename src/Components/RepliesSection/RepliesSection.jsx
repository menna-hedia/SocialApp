import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { LuImagePlus, LuX } from "react-icons/lu";
import { SyncLoader } from "react-spinners";
import { toast } from "react-toastify";
import { extractList } from "../../utils/extractList";

const BASE = "https://route-posts.routemisr.com";
const authHeaders = () => ({ headers: { token: localStorage.getItem("token") } });
const FALLBACK_AVATAR = "https://avatars.githubusercontent.com/u/86160567?s=200&v=4";
const toastOpts = { position: "top-center", autoClose: 1200, theme: "dark" };

// highlights @mentions inside a reply
function renderContent(text = "") {
  return text.split(/(@\w+)/g).map((part, i) =>
    part.startsWith("@") ? (
      <span key={i} className="font-semibold text-indigo-500">{part}</span>
    ) : (
      part
    )
  );
}

export default function RepliesSection({ postId, commentId, parentQueryKey }) {
  const queryClient = useQueryClient();
  const repliesKey = ["commentReplies", postId, commentId];

  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const imageInput = useRef(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: repliesKey,
    queryFn: () =>
      axios
        .get(`${BASE}/posts/${postId}/comments/${commentId}/replies`, {
          params: { page: 1, limit: 10 },
          ...authHeaders(),
        })
        .then((res) => res.data),
  });

  const replies = extractList(data);
  

  function handleChangeImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  function clearImage() {
    if (preview) URL.revokeObjectURL(preview);
    setImageFile(null);
    setPreview(null);
    if (imageInput.current) imageInput.current.value = "";
  }

  const { mutate: sendReply, isPending } = useMutation({
    mutationFn: () => {
      const formData = new FormData();
      // an empty string makes the API reject the request, so we send it only when there is text
      if (content.trim() !== "") formData.append("content", content.trim());
      if (imageFile) formData.append("image", imageFile);
      return axios.post(
        `${BASE}/posts/${postId}/comments/${commentId}/replies`,
        formData,
        authHeaders()
      );
    },
    onSuccess: () => {
      setContent("");
      clearImage();
      queryClient.invalidateQueries({ queryKey: repliesKey });
      queryClient.invalidateQueries({ queryKey: ["getComments", postId] });
      if (parentQueryKey) queryClient.invalidateQueries({ queryKey: parentQueryKey });
      toast.success("Reply added", toastOpts);
    },
    onError: (err) => {
      console.log("reply error:", err.response?.status, err.response?.data);
      toast.error(err.response?.data?.message || "Could not add reply", toastOpts);
    },
  });

  const canSend = content.trim() !== "" && !isPending;

  return (
    <div className="ms-4 mt-2 border-s-2 border-indigo-100 ps-4">
      {isLoading && (
        <div className="flex justify-center py-3">
          <SyncLoader color="#6366f1" size={6} />
        </div>
      )}

      {isError && <p className="py-2 text-sm text-red-500">Could not load replies.</p>}

      {!isLoading && !isError && replies.length === 0 && (
        <p className="py-2 text-sm text-gray-500">No replies yet.</p>
      )}

      <ul className="space-y-3">
        {replies.map((reply) => {
          const author = reply.commentCreator || reply.replyCreator || reply.user || {};
          return (
            <li key={reply._id || reply.id} className="flex gap-3">
              <img
                src={author.photo}
                alt={author.name}
                className="h-8 w-8 shrink-0 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = FALLBACK_AVATAR;
                }}
              />
              <div className="min-w-0 rounded-xl bg-white px-3 py-2 shadow-sm">
                <p className="text-sm font-bold text-gray-800">{author.name}</p>
                {reply.content && (
                  <p className="break-words text-sm text-gray-700">{renderContent(reply.content)}</p>
                )}
                {reply.image && (
                  <img src={reply.image} alt="reply attachment" className="mt-2 max-w-[220px] rounded-lg" />
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {/* write a reply */}
      <div className="mt-3">
        {preview && (
          <div className="relative mb-2 w-28">
            <img src={preview} alt="preview" className="rounded-lg" />
            <button
              type="button"
              onClick={clearImage}
              aria-label="Remove image"
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-red-500"
            >
              <LuX className="text-sm" />

            </button>
          </div>
        )}

        <div className="relative">
          <input
            type="text"
            aria-label="Write a reply"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && canSend && sendReply()}
            placeholder="Write a reply..."
            className="block w-full rounded-xl bg-white p-3 pe-32 text-sm outline-indigo-500"
          />

          <div className="absolute inset-y-0 end-2 flex items-center gap-2">
            <label className="cursor-pointer" aria-label="Add image">
              <LuImagePlus className="text-xl text-indigo-500" />
              <input type="file" accept="image/*" hidden ref={imageInput} onChange={handleChangeImage} />

            </label>

            <button
              type="button"
              disabled={!canSend}
              onClick={() => sendReply()}
              className={`min-w-14 rounded-4xl bg-indigo-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-400 ${!canSend ? "cursor-not-allowed opacity-60" : ""
                }`}
            >
              {isPending ? <SyncLoader color="#ffffff" size={2} /> : "Reply"}
            </button>
          </div>
        </div>{imageFile && content.trim() === "" && (
          <p className="mt-1 text-xs text-gray-500">Add a short text to send your image.</p>
        )}
      </div>
    </div>
  );
}