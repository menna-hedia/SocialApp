import { useContext, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { LuCamera, LuImage } from "react-icons/lu";
import { SyncLoader } from "react-spinners";
import { toast } from "react-toastify";
import { profileContext } from "../../context/ProfileContext";

const MAX_SIZE_MB = 5;
const toastOpts = { position: "top-right", autoClose: 1000 };

// shows the cover image, or a gradient placeholder when there is none.
// pass `editable` on your own profile to show the upload button.
export default function CoverPhoto({ cover, editable = false }) {
  const [failed, setFailed] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInput = useRef(null);

  const queryClient = useQueryClient();
  const { getMyProfile } = useContext(profileContext) || {};

  const { mutate: uploadCover, isPending } = useMutation({
    mutationFn: (file) => {
      const formData = new FormData();
      formData.append("cover", file);
      return axios.put("https://route-posts.routemisr.com/users/upload-cover", formData, {
        headers: { token: localStorage.getItem("token") },
      });
    },
    onSuccess: async () => {
      toast.success("Cover photo updated", toastOpts);
      setFailed(false);
      if (typeof getMyProfile === "function") await getMyProfile();
      setPreview(null);
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
    onError: (err) => {
      setPreview(null);
      toast.error(err.response?.data?.message || "Could not upload cover photo", toastOpts);
    },
  });

  function handleChange(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
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
    uploadCover(file);
  }

  const src = preview || cover;
  const showImage = Boolean(src) && !failed;

  return (
    <div className="relative mb-4 h-36 w-full overflow-hidden rounded-xl sm:h-48 lg:h-56">
      {showImage ? (
        <img
          src={src}
          alt="Cover"
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gray-200 text-white/90">
          <LuImage className="text-4xl" />
          <span className="text-sm font-medium">
            {editable ? "Add a cover photo" : "No cover photo"}
          </span>
        </div>
      )}

      {isPending && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <SyncLoader color="#ffffff" size={8} />
        </div>
      )}

      {editable && (
        <>
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            disabled={isPending}
            aria-label="Change cover photo"
            className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full bg-indigo-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LuCamera className="text-lg" />
            <span className="hidden sm:inline">{cover || preview ? "Change cover" : "Add cover"}</span>
          </button>
          <input ref={fileInput} type="file" accept="image/*" hidden onChange={handleChange} />
        </>
      )}
    </div>
  );
}