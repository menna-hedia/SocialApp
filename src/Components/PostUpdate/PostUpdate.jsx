import React, { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Textarea } from "@heroui/react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { LuImagePlus } from "react-icons/lu";
import { SyncLoader } from 'react-spinners';

export default function PostUpdate({ postId, initialBody, initialImage, onClose }) {
  const [imagePreview, setImagePreview] = useState(initialImage || null);
  const [bodyText, setBodyText] = useState(initialBody || "");

  const imageInput = useRef();

  const queryClient = useQueryClient();

  function handleChangeImage(e) {
    if (e.target.files[0]) {
      setImagePreview(URL.createObjectURL(e.target.files[0]));
    }
  }

  function handleClearImage() {
    setImagePreview(null);
    imageInput.current.value = "";
  }

  function updatePost() {
    const formData = new FormData();
    formData.append("body", bodyText);
    if (imageInput.current.files[0]) {
      formData.append("image", imageInput.current.files[0]);
    }

    return axios.put(`https://route-posts.routemisr.com/posts/${postId}`, formData, {
      headers: {
        token: localStorage.getItem("token"),
      },
    });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getPosts"] });
      queryClient.invalidateQueries({ queryKey: ["getPostDetails", postId] });
      toast.success("Post Updated Successfully", { position: "top-center", autoClose: 1000, theme: "dark" });
      onClose(); // close modal
    },
    onError: () => {
      toast.error("Error updating post", { position: "top-center", autoClose: 1000, theme: "dark" });
    },
  });

  return (
    <Modal isOpen onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader>Update Post</ModalHeader>
        <ModalBody>
          <Textarea
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
            placeholder="What's on your mind?"
          />

          {imagePreview && (
            <div className="relative w-full mt-3">
              <img src={imagePreview} alt="preview" className="rounded-lg w-full" />
              <IoCloseCircleOutline
                onClick={handleClearImage}
                className="absolute top-2 right-2 text-white cursor-pointer text-2xl"
              />
            </div>
          )}
        </ModalBody>
        <ModalFooter className="flex items-center gap-2">
          <label className="flex items-center gap-1 cursor-pointer">
            <LuImagePlus className="text-blue-500 text-xl" />
            <input type="file" hidden ref={imageInput} onChange={handleChangeImage} />
          </label>
          <Button onPress={onClose} className="bg-red-500 hover:bg-red-400 text-white rounded-4xl">
            Close
          </Button>
          <Button
            onPress={mutate}
            className="bg-indigo-500 hover:bg-indigo-400 text-white rounded-4xl"
            disabled={isPending}
          >
            {isPending ? <SyncLoader color="#ffffff" size={2} speedMultiplier={1} /> : "Update"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}