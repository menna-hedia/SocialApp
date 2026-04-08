import React, { useState } from 'react';
import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from "react-toastify";
import { SyncLoader } from 'react-spinners';

export default function CommentUpdate({ postId, commentId, initialContent, onClose, queryKey }) {
  const [content, setContent] = useState(initialContent || "");
  const queryClient = useQueryClient();

  const { mutate: updateComment, isPending } = useMutation({
    mutationFn: () => {
      if (!postId || !commentId) {
        throw new Error("Missing postId or commentId. Cannot update comment.");
      }

      return axios.put(
        `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`,
        { content }, 
        {
          headers: {
            token: localStorage.getItem('token'),
          }
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getComments", postId] });
      queryClient.invalidateQueries({ queryKey: queryKey });
      toast.success("Comment Updated Successfully", { position: "top-center", autoClose: 1000, theme: "dark" });
      onClose();
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.message || "Error occurred ... try again later",
         { position: "top-center", autoClose: 2000, theme: "dark" });
    }
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-500 font-bold text-lg"
        >
          ×
        </button>
        <h3 className="text-lg font-bold mb-4">Update Comment</h3>

        <label htmlFor="commentContent" className="sr-only">Comment Content</label>
        <textarea
          id="commentContent"
          name="commentContent"
          className="w-full p-3 border rounded mb-3"
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button
          onClick={updateComment}
          disabled={content.trim() === ""}
          className={`bg-indigo-500 text-white px-4 py-2 rounded-4xl 
            hover:bg-indigo-400 flex items-center justify-center 
            ${content.trim() === "" ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isPending ? <SyncLoader color="#ffffff" size={2} /> : "Update"}
        </button>
      </div>
    </div>
  );
}