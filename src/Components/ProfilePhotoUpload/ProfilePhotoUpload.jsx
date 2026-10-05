import { useContext, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { LuCamera } from "react-icons/lu";
import { SyncLoader } from "react-spinners";
import { toast } from "react-toastify";
import { profileContext } from "../../context/ProfileContext";

const FALLBACK_AVATAR = "https://avatars.githubusercontent.com/u/86160567?s=200&v=4";
const MAX_SIZE_MB = 5;
const toastOpts = { position: "top-center", autoClose: 1500, theme: "dark" };

export default function ProfilePhotoUpload({ photo }) {
  const queryClient = useQueryClient();
  const ctx = useContext(profileContext) || {};
  const fileInput = useRef(null);
  const [preview, setPreview] = useState(null);

  const { mutate: uploadPhoto, isPending } = useMutation({
    mutationFn: (file) => {
      const formData = new FormData();
      formData.append("photo", file);
      return axios.put("https://route-posts.routemisr.com/users/upload-photo", formData, {
        headers: { token: localStorage.getItem("token") },
      });
    },
    onSuccess: () => {
      toast.success("Profile photo updated", toastOpts);

      // refresh the profile everywhere (navbar, sidebar, posts)
      const refetch = ctx.refetchProfile || ctx.refetch || ctx.getProfile || ctx.fetchProfile;
      if (typeof refetch === "function") {
        refetch();
        setPreview(null);
      } else {
        // no refetch function in the context: reload so the new photo shows up everywhere
        setTimeout(() => window.location.reload(), 800);
      }

      queryClient.invalidateQueries({ queryKey: ["getPosts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
    },
    onError: (err) => {
      setPreview(null);
      toast.error(err.response?.data?.message || "Could not upload photo", toastOpts);
    },
  });

  function handleChange(e) {
    const file = e.target.files?.[0];
    e.target.value = ""; // lets you pick the same file again later
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file", toastOpts);
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`Image must be smaller than ${MAX_SIZE_MB} MB`, toastOpts);
      return;
    }

    setPreview(URL.createObjectURL(file));
    uploadPhoto(file);
  }

  return (
    <div className="relative h-28 w-28 shrink-0">
      <img
        src={preview || photo || FALLBACK_AVATAR}
        alt="Profile"
        className="h-28 w-28 rounded-full border-2 border-gray-300 object-cover"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = FALLBACK_AVATAR;
        }}
      />

      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
          <SyncLoader color="#ffffff" size={6} />
        </div>
      )}

      <button
        type="button"
        onClick={() => fileInput.current?.click()}
        disabled={isPending}
        aria-label="Change profile photo"
        className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-white shadow-md ring-2 ring-white transition hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <LuCamera className="text-lg" />
      </button>

      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        hidden
        onChange={handleChange}
      />
    </div>
  );
}