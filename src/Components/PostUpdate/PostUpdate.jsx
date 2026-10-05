import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button,
} from "@heroui/react";
import { SyncLoader } from "react-spinners";
import { LuImagePlus, LuX, LuRotateCcw } from "react-icons/lu";
import SharedPost from "../SharedPost/SharedPost";
import { getOriginalPost } from "../../utils/getOriginalPost";

const FALLBACK_AVATAR = "https://avatars.githubusercontent.com/u/86160567?s=200&v=4";
const toastOpts = { position: "top-center", autoClose: 1500, theme: "dark" };

// the docs don't say how to delete an image, so we try these in order
const REMOVE_VARIANTS = [
  { image: "" },
  { image: null },
  { removeImage: true },
  { deleteImage: true },
];

// a post is a share when it wraps an original post (the flag names are guesses)
function isShared(post, original) {
  return Boolean(
    original || post?.isShare || post?.isShared || post?.type === "share"
  );
}

// 1) loads the post by itself, so it doesn't depend on props from the parents
export default function PostUpdate({ postId, initialBody, initialImage, authorPhoto, authorName, date, onClose }) {
  const { data, isLoading } = useQuery({
    queryKey: ["getPostDetails", postId],
    queryFn: () =>
      axios
        .get(`https://route-posts.routemisr.com/posts/${postId}`, {
          headers: { token: localStorage.getItem("token") },
        })
        .then((res) => res.data),
  });

  const post = data?.data?.post;
  if (post) console.log("editing post:", post);

  if (isLoading) {
    return (
      <Modal isOpen onOpenChange={(open) => !open && onClose()} size="2xl">
        <ModalContent>
          <ModalBody className="flex items-center justify-center py-16">
            <SyncLoader color="#6366f1" size={10} />
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  const original = getOriginalPost(post);

  // the props are only a fallback if the request fails
  return (
    <PostUpdateForm
      key={postId}
      postId={postId}
      body={post?.body ?? initialBody ?? ""}
      image={post?.image ?? initialImage ?? null}
      original={original}
      isShare={isShared(post, original)}
      authorPhoto={post?.user?.photo ?? authorPhoto}
      authorName={post?.user?.name ?? authorName}
      date={post?.createdAt?.split("T")[0] ?? date}
      onClose={onClose}
    />
  );
}

// 2) the edit form
function PostUpdateForm({ postId, body, image, original, isShare, authorPhoto, authorName, date, onClose }) {
  const [bodyText, setBodyText] = useState(body);
  const [newImage, setNewImage] = useState(null);
  const [preview, setPreview] = useState(isShare ? null : image);
  const [removeImage, setRemoveImage] = useState(false);
  const imageInput = useRef(null);
  const queryClient = useQueryClient();

  const textChanged = bodyText !== body;
  const hasChanges = textChanged || Boolean(newImage) || removeImage;

  // a share caption is optional, a normal post needs text or an image
  const hasContent = isShare || bodyText.trim() !== "" || Boolean(preview);

  function handleChangeImage(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setNewImage(file);
    setPreview(URL.createObjectURL(file));
    setRemoveImage(false);
  }

  function handleClearImage() {
    setNewImage(null);
    setPreview(null);
    // only tell the server to delete when the image was already saved on it
    setRemoveImage(Boolean(image));
  }

  function handleReset() {
    setBodyText(body);
    setNewImage(null);
    setPreview(isShare ? null : image);
    setRemoveImage(false);
  }

  async function savePost() {
    const url = `https://route-posts.routemisr.com/posts/${postId}`;
    const headers = { token: localStorage.getItem("token") };

    // shared post: only the caption can change, no image is ever sent
    if (isShare) {
      return axios.put(url, { body: bodyText }, { headers });
    }

    const sendBody = bodyText.trim() !== "" || textChanged;

    // new image picked (the text is optional)
    if (newImage) {
      const formData = new FormData();
      if (sendBody) formData.append("body", bodyText);
      formData.append("image", newImage);
      return axios.put(url, formData, { headers });
    }

    // saved image removed, keep the text
    if (removeImage) {
      let lastError;
      for (const variant of REMOVE_VARIANTS) {
        try {
          const payload = { ...(sendBody ? { body: bodyText } : {}), ...variant };
          const res = await axios.put(url, payload, { headers });
          console.log("image removed using:", variant);
          return res;
        } catch (err) {
          lastError = err;
          if (err.response?.status !== 400) throw err;
        }
      }
      throw lastError;
    }

    // text only
    const formData = new FormData();
    formData.append("body", bodyText);
    return axios.put(url, formData, { headers });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: savePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getPosts"] });
      queryClient.invalidateQueries({ queryKey: ["getPostDetails", postId] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      toast.success("Post Updated Successfully", toastOpts);
      onClose();
    },
    onError: (err) => {
      console.log("update post error:", err.response?.status, err.response?.data);
      toast.error(err.response?.data?.message || "Error updating post", toastOpts);
    },
  });

  const canUpdate = hasChanges && hasContent && !isPending;

  return (
    <Modal isOpen onOpenChange={(open) => !open && onClose()} size="2xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader className="justify-center">
          {isShare ? "Edit Shared Post" : "Edit Post"}
        </ModalHeader>

        <ModalBody>
          <div className="rounded-xl border border-gray-200 p-4">
            <div className="mb-3 flex items-center gap-3">
              <img
                src={authorPhoto}
                alt={authorName}
                className="h-12 w-12 rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = FALLBACK_AVATAR;
                }}
              />
              <div>
                <p className="font-bold text-gray-800">{authorName}</p>
                {date && <p className="text-xs text-gray-500">{date}</p>}
              </div>
            </div>

            <textarea
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              placeholder={isShare ? "Say something about this post..." : "What's on your mind?"}
              rows={Math.min(Math.max(bodyText.split("\n").length, 3), 10)}
              className="w-full resize-none rounded-lg bg-gray-50 p-3 text-base text-gray-800 outline-indigo-500"
            />

            {/* shared post: the original is read-only and has no image controls */}
            {isShare && (
              <>
                <SharedPost original={original} />
                <p className="text-xs text-gray-400">
                  Only your caption can be edited on a shared post.
                </p>
              </>
            )}

            {/* normal post: image preview with remove button */}
            {!isShare && preview && (
              <div className="relative mt-3">
                <img src={preview} alt="post" className="max-h-96 w-full rounded-lg object-cover" />
                <button
                  type="button"
                  onClick={handleClearImage}
                  aria-label="Remove image"
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-red-500"
                >
                  <LuX className="text-lg" />
                </button>
                {newImage && (
                  <span className="absolute bottom-2 left-2 rounded-full bg-indigo-500 px-3 py-1 text-xs font-medium text-white">
                    New image
                  </span>
                )}
              </div>
            )}

            {!isShare && removeImage && !preview && (
              <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-500">
                The image will be removed when you save.
              </p>
            )}

            {!hasContent && (
              <p className="mt-3 text-sm text-gray-500">
                Add some text or an image to save this post.
              </p>
            )}
          </div>
        </ModalBody>

        <ModalFooter className="flex items-center gap-2">
          {/* the image button is hidden for shared posts */}
          {!isShare && (
            <label className="flex cursor-pointer items-center gap-1 text-sm text-indigo-500">
              <LuImagePlus className="text-xl" />
              {preview ? "Change image" : "Add image"}
              <input type="file" accept="image/*" hidden ref={imageInput} onChange={handleChangeImage} />
            </label>
          )}

          <button
            type="button"
            onClick={handleReset}
            disabled={!hasChanges || isPending}
            className="flex flex-1 items-center gap-1 text-sm text-gray-500 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <LuRotateCcw />
            Reset
          </button>

          <Button variant="light" onPress={onClose} className="rounded-4xl">
            Cancel
          </Button>
          <Button
            onPress={() => mutate()}
            isDisabled={!canUpdate}
            isLoading={isPending}
            className="rounded-4xl bg-indigo-500 text-white hover:bg-indigo-400"
          >
            Save
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}