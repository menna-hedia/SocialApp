import {
  Avatar, Button, Card, CardBody, Modal, ModalBody, ModalContent,
  ModalFooter, ModalHeader, Textarea, useDisclosure,
} from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useRef, useState } from "react";
import { LuImagePlus, LuX, LuPlus } from "react-icons/lu";
import { toast } from "react-toastify";
import { profileContext } from "../../context/ProfileContext";
import LoaderScreen from "../LoaderScreen/LoaderScreen";

const toastOptions = { position: "top-right", autoClose: 1000 };

export default function PostCreation({ compact = false, asButton = false }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const [caption, setCaption] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const imageInput = useRef(null);

  const queryClient = useQueryClient();
  const { profile } = useContext(profileContext) || {};
  const { photo = "", username = "User" } = profile || {};

  function handleChangeImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function handleClearImage() {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImageFile(null);
    setImagePreview(null);
    if (imageInput.current) imageInput.current.value = "";
  }

  function resetForm() {
    handleClearImage();
    setCaption("");
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  // closing with Esc or a click on the backdrop also resets the form
  function handleOpenChange(open) {
    if (!open) resetForm();
    onOpenChange(open);
  }

  const { isPending, mutate } = useMutation({
    mutationFn: () => {
      const postObj = new FormData();
      const text = caption.trim();

      if (text) postObj.append("body", text);
      if (imageFile) postObj.append("image", imageFile);

      return axios.post("https://route-posts.routemisr.com/posts", postObj, {
        headers: { token: localStorage.getItem("token") },
      });
    }, ccess: () => {
      handleClose();
      queryClient.invalidateQueries({ queryKey: ["getPosts"] });
      queryClient.invalidateQueries({ queryKey: ["userPosts"] });
      toast.success("Post Created Successfully", toastOptions);
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message || "Error occurred ... try again later",
        toastOptions
      );
    },
  });

  const canPost = (caption.trim() !== "" || imageFile) && !isPending;

  return (
    <>
      {asButton ? (
        <button
          type="button"
          onClick={onOpen}
          aria-label="Add post"
          title="Add post"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-500 text-white shadow-md transition hover:bg-indigo-400 active:scale-95"
        >
          <LuPlus className="text-2xl" />
        </button>
      ) : compact ? (
        profile && (
          <div
            onClick={onOpen}
            className="flex w-full cursor-pointer items-center gap-3 rounded-full bg-gray-100 px-4 py-2.5 text-sm text-gray-500 transition hover:bg-gray-200"
          >
            <Avatar size="sm" src={profile.photo} />
            <p className="truncate">What's on your mind, {profile.username}?</p>
          </div>
        )
      ) : profile ? (
        <Card className="mx-auto w-full max-w-2xl">
          <CardBody className="flex flex-row items-center p-5">
            <Avatar size="lg" className="w-fit" src={profile.photo} />
            <div
              onClick={onOpen}
              className="ms-3 flex w-full cursor-pointer items-center rounded-2xl bg-gray-100 px-5 py-4 text-lg text-gray-500 hover:bg-gray-200"
            >
              <p>What's on your mind, {profile.username}</p>
            </div>
          </CardBody>
        </Card>
      ) : (
        <LoaderScreen />
      )}

      <Modal isOpen={isOpen} onOpenChange={handleOpenChange}>
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center">Create Post</ModalHeader>

              <ModalBody>
                <div className="flex items-center gap-2">
                  <Avatar size="md" className="w-fit" src={photo} />
                  <h2>{username}</h2>
                </div>

                <Textarea
                  value={caption}
                  onValueChange={setCaption}
                  placeholder="What's on your mind"
                  minRows={4}
                />

                {imagePreview && (
                  <div className="relative w-full">
                    <img alt="post preview" src={imagePreview} className="w-full rounded-lg" />
                    <button
                      type="button"
                      onClick={handleClearImage}
                      aria-label="Remove image"
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-red-500"
                    >
                      <LuX className="text-base" />
                    </button>
                  </div>
                )}
              </ModalBody>

              <ModalFooter className="flex items-center">
                <label className="flex-1 cursor-pointer" aria-label="Add image">
                  <LuImagePlus className="text-xl text-blue-500" />
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleChangeImage}
                    ref={imageInput}
                  />
                </label>

                <Button
                  className="rounded-4xl bg-indigo-500 text-white hover:bg-indigo-400"
                  isDisabled={!canPost}
                  isLoading={isPending}
                  onPress={() => mutate()}
                >
                  Post
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}