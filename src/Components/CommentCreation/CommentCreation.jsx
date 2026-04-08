import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { SyncLoader } from 'react-spinners';
import { toast } from "react-toastify";

export default function CommentCreation({ inputStyle, buttonStyle, queryKey, postId }) {

  const [commentValue, setCommentValue] = useState("");
  const queryClient = useQueryClient();

  const { mutate: createComment, isPending } = useMutation({
    mutationFn: () => {
      if (!postId) throw new Error("Missing postId. Cannot create comment.");
      return axios.post(
        `https://route-posts.routemisr.com/posts/${postId}/comments`,
        { content: commentValue },
        { headers: { token: localStorage.getItem('token') } }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKey });
      setCommentValue("");
      toast.success("Comment Created Successfully", {
        position: "top-center",
        autoClose: 1000,
        theme: "dark",
      });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Error occurred ... try again later", {
        position: "top-center",
        autoClose: 1500,
        theme: "dark",
      });
    }
  });

  return (
    <div className="relative">
      <label htmlFor="commentInput" className="sr-only">Comment Content</label>
      <input
        type="text"
        id="commentInput"
        name="commentInput"
        className={`block w-full p-4 ps-9 outline-indigo-500 transition-all ${inputStyle}
         text-heading text-sm rounded-xl placeholder:text-body`}
        placeholder="Create Comment..."
        value={commentValue}
        onChange={(e) => setCommentValue(e.target.value)}
      />

      <button
        type="button"
        disabled={commentValue.trim() === ""}
        className={`absolute ${buttonStyle} mx-auto block min-w-auto text-sm py-2 px-4 font-medium rounded-4xl text-white
         bg-indigo-500 hover:bg-indigo-400 focus-visible:outline-indigo-500 
         ${commentValue.trim() === "" ? 'cursor-not-allowed' : ''}`}
        onClick={createComment}
      >
        {isPending ? <SyncLoader color="#ffffff" size={2} speedMultiplier={1} /> : "Send"}
      </button>
    </div>
  );
}