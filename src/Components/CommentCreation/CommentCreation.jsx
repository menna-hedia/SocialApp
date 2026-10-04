import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SyncLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useRef, useState } from "react";
import { LuImagePlus } from "react-icons/lu";
import { IoCloseCircleOutline } from "react-icons/io5";

export default function CommentCreation({ inputStyle, queryKey, postId }) {
  const [commentValue, setCommentValue] = useState("");
  const [commentImage, setCommentImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const imageInput = useRef(null);
  const queryClient = useQueryClient();

  function handleChangeImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCommentImage(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function handleClearImage() {
    setCommentImage(null);
    setImagePreview(null);
    if (imageInput.current) imageInput.current.value = "";
  }

  const { mutate: createComment, isPending } = useMutation({
    mutationFn: () => {
      if (!postId) throw new Error("Missing postId. Cannot create comment.");
      const formData = new FormData();
      formData.append("content", commentValue);
      if (commentImage) formData.append("image", commentImage);
      return axios.post(
        `https://route-posts.routemisr.com/posts/${postId}/comments`,
        formData,
        { headers: { token: localStorage.getItem("token") } }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      setCommentValue("");
      handleClearImage();
      toast.success("Comment Created Successfully", {
        position: "top-center",
        autoClose: 1000,
        theme: "dark",
      });
    },
    onError: (err) => {
      console.log(err.response?.data); // check the real error in the console
      toast.error(
        err.response?.data?.message || err.message || "Error occurred ... try again later",
        { position: "top-center", autoClose: 1500, theme: "dark" }
      );
    },
  });

  const canSend = (commentValue.trim() !== "" || commentImage) && !isPending;

  return (
    <div>
      {imagePreview && (
        <div className="relative mb-2 w-32">
          <img src={imagePreview} alt="preview" className="rounded-lg" />
          <IoCloseCircleOutline
            onClick={handleClearImage}
            className="absolute top-1 right-1 cursor-pointer text-2xl text-white drop-shadow"
          />
        </div>
      )}

      <div className="relative">
        <input
          type="text"
          aria-label="Comment content"
          className={`block w-full p-4 ps-9 pe-36 outline-indigo-500 transition-all ${inputStyle}
            text-heading text-sm rounded-xl placeholder:text-body`}
          placeholder="Create Comment..."
          value={commentValue}
          onChange={(e) => setCommentValue(e.target.value)}
        />

        <div className="absolute inset-y-0 end-2 flex items-center gap-2">
          <label className="cursor-pointer" aria-label="Add image">
            <LuImagePlus className="text-xl text-indigo-500" />
            <input
              type="file"
              accept="image/*"
              hidden
              ref={imageInput}
              onChange={handleChangeImage}
            />
          </label>

          <button
            type="button"
            disabled={!canSend}
            onClick={() => createComment()}
            className={`min-w-16 text-sm py-2 px-4 font-medium rounded-4xl text-white
              bg-indigo-500 hover:bg-indigo-400
              ${!canSend ? "cursor-not-allowed " : ""}`}
          >
            {isPending ? <SyncLoader color="#ffffff" size={2} speedMultiplier={1} /> : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}