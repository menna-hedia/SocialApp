import { useRef, useState } from "react";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { SyncLoader } from "react-spinners";
import { LuImagePlus, LuX } from "react-icons/lu";

export default function CommentUpdate({ postId, commentId, initialContent, initialImage, onClose, queryKey }) {
  const [content, setContent] = useState(initialContent || "");
  const [newImage, setNewImage] = useState(null);
  const [preview, setPreview] = useState(initialImage || null);
  const [removeImage, setRemoveImage] = useState(false);
  const imageInput = useRef(null);
  const queryClient = useQueryClient();

  function handleChangeImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewImage(file);
    setPreview(URL.createObjectURL(file));
    setRemoveImage(false);
  }

  function handleRemoveImage() {
    setNewImage(null);
    setPreview(null);
    // only tell the server to delete if there was an image saved on it
    setRemoveImage(Boolean(initialImage));
    if (imageInput.current) imageInput.current.value = "";
  }

  const { mutate: updateComment, isPending } = useMutation({
    mutationFn: () => {
  if (!postId || !commentId) {
    throw new Error("Missing postId or commentId. Cannot update comment.");
  }

  const url = `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`;
  const headers = { token: localStorage.getItem("token") };

  // new image picked: send FormData
  if (newImage) {
    const formData = new FormData();
    formData.append("content", content);
    formData.append("image", newImage);
    return axios.put(url, formData, { headers });
  }

  // image removed, keep text: try clearing the image field
  if (removeImage) {
    return axios.put(url, { content, image: "" }, { headers });
  }

  // text only
  return axios.put(url, { content }, { headers });
},
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getComments", postId] });
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ["getPosts"] });
      toast.success("Comment Updated Successfully", { position: "top-right", autoClose: 1000 });
      onClose();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Error occurred ... try again later",
        { position: "top-right", autoClose: 1000 });
    },
  });

  const canUpdate = (content.trim() !== "" || preview) && !isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6">
        <button onClick={onClose} className="absolute top-2 right-3 text-lg font-bold text-red-500" aria-label="Close">
          ×
        </button>
        <h3 className="mb-4 text-lg font-bold">Update Comment</h3>

        <textarea
          aria-label="Comment content"
          className="mb-3 w-full rounded border p-3 outline-indigo-500"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {preview && (
          <div className="relative mb-3 w-fit">
            <img src={preview} alt="preview" className="max-h-48 rounded-lg" />
            <button
  type="button"
  onClick={handleRemoveImage}
  aria-label="Remove image"
  className="absolute top-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition hover:bg-red-500"
>
  <LuX className="text-base" />
</button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-1 text-sm text-indigo-500">
            <LuImagePlus className="text-xl" />
            {preview ? "Change image" : "Add image"}
            <input type="file" accept="image/*" hidden ref={imageInput} onChange={handleChangeImage} />
          </label>

          <button
            onClick={() => updateComment()}
            disabled={!canUpdate}
            className={`flex items-center justify-center rounded-4xl bg-indigo-500 px-4 py-2 text-white hover:bg-indigo-400
              ${!canUpdate ? "cursor-not-allowed opacity-50" : ""}`}
          >
            {isPending ? <SyncLoader color="#ffffff" size={2} /> : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}