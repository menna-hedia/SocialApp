import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button,
} from "@heroui/react";
import { LuShare2 } from "react-icons/lu";
import { SyncLoader } from "react-spinners";
import { toast } from "react-toastify";

const BASE = "https://route-posts.routemisr.com";
const FALLBACK_AVATAR = "https://avatars.githubusercontent.com/u/86160567?s=200&v=4";
const toastOpts = { position: "top-center", autoClose: 1200, theme: "dark" };

export default function ShareModal({ postId, isOpen, onOpenChange, onShared }) {
  const queryClient = useQueryClient();
  const [caption, setCaption] = useState("");

  // loads the post to preview it (only while the modal is open)
  const { data, isLoading } = useQuery({
    queryKey: ["getPostDetails", postId],
    enabled: isOpen,
    queryFn: () =>
      axios
        .get(`${BASE}/posts/${postId}`, {
          headers: { token: localStorage.getItem("token") },
        })
        .then((res) => res.data),
  });

  const post = data?.data?.post;

  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      const headers = { token: localStorage.getItem("token") };
      const text = caption.trim();
      // the caption is optional: without it we send an empty body
      return axios.post(
        `${BASE}/posts/${postId}/share`,
        text ? { body: text } : {},
        { headers }
      );
    },
    onSuccess: () => {
      setCaption("");
      onOpenChange(false);
      onShared?.();
      queryClient.invalidateQueries({ queryKey: ["getPosts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      toast.success("Post shared", toastOpts);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Could not share post", toastOpts);
    },
  });

  // closing the modal clears what you typed
  function handleOpenChange(open) {
    if (!open) setCaption("");
    onOpenChange(open);
  }

  return (
    <Modal isOpen={isOpen} onOpenChange={handleOpenChange} size="lg" scrollBehavior="inside">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="justify-center">Share Post</ModalHeader>

            <ModalBody>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Say something about this post... (optional)"
                rows={3}
                className="w-full resize-none rounded-xl bg-gray-100 p-3 text-base text-gray-800 outline-indigo-500"
              />

              {/* preview of the post being shared */}
              <div className="rounded-xl border border-gray-200 p-3">
                {isLoading && (
                  <div className="flex justify-center py-6">
                    <SyncLoader color="#6366f1" size={8} />
                  </div>
                )}

                {post && (
                  <>
                    <div className="flex items-center gap-2">
                      <img
                        src={post.user?.photo}
                        alt={post.user?.name}
                        className="h-9 w-9 shrink-0 rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = FALLBACK_AVATAR;
                        }}
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-gray-800">{post.user?.name}</p>
                        <p className="text-xs text-gray-500">{post.createdAt?.split("T")[0]}</p>
                      </div>
                    </div>

                    {post.body && (
                      <p className="mt-2 line-clamp-4 break-words text-sm text-gray-700">{post.body}</p>
                    )}
                    {post.image && (
                      <img
                        src={post.image}
                        alt={post.body || "post"}
                        className="mt-2 max-h-56 w-full rounded-lg object-cover"
                      />
                    )}
                  </>
                )}

                {!isLoading && !post && (
                  <p className="py-2 text-center text-sm text-gray-500">Post preview is not available.</p>
                )}
              </div>
            </ModalBody>

            <ModalFooter>
              <Button
                onPress={() => mutate()}
                isLoading={isPending}
                startContent={!isPending && <LuShare2 />}
                className="rounded-4xl bg-indigo-500 text-white hover:bg-indigo-400"
              >
                Share
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}