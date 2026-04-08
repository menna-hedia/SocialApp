import { Avatar, Button, Card, CardBody, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea, useDisclosure } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useRef, useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { LuImagePlus } from "react-icons/lu";
import { toast } from "react-toastify";
import { profileContext } from "../../context/ProfileContext";
import LoaderScreen from "../LoaderScreen/LoaderScreen";

export default function PostCreation() {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const [imagePreview, setImagePreview] = useState(null);

  const imageInput = useRef();
  const captionInput = useRef();

const { profile } = useContext(profileContext) || {};
const { photo = "", username = "User" } = profile || {};
    
  function handleChangeImage(e) {
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  }

  function handleClearImage() {
    setImagePreview(null);
    imageInput.current.value = "";
  }

  function handleCreatePost() {
    const postObj = new FormData();
    postObj.append("body", captionInput.current.value);

    if (imageInput.current.files[0]) {
      postObj.append("image", imageInput.current.files[0]);
    }

    return axios.post(`https://route-posts.routemisr.com/posts`, postObj, {
      headers: { token: localStorage.getItem('token') }
    })
  }

  const queryClient = useQueryClient();
  const { isPending, mutate } = useMutation({
    mutationFn: handleCreatePost,

    onSuccess: () => {
      handleClearImage();
      captionInput.current.value = "";
      onClose();
      queryClient.invalidateQueries({ queryKey: ["getPosts"] });
      toast.success("Post Created Succefully", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      })
    },
    onError: () => {
      toast.error('Error occurred ... try again later', {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      })
    },
    onSettled: () => { },
  })

  return (
  <>
    {profile ? (
      <Card className="my-2 w-200 mx-auto">
        <CardBody className="flex flex-row">
          <Avatar size="md" className="w-fit" src={profile.photo} />
          <div
            onClick={onOpen}
            className="cursor-pointer w-full ms-2 flex p-2 text-gray-500 rounded-2xl items-center hover:bg-gray-200"
          >
            <p>What's on your mind, {profile.username}</p>
          </div>
        </CardBody>
      </Card>
    ) : (
      <LoaderScreen/>
    )}

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center">Create Post</ModalHeader>
              <ModalBody>
                <div className="flex items-center gap-2">
                  <Avatar size="md" className="w-fit" src={photo} />
                  <h2>{username}</h2>
                </div>

                <Textarea ref={captionInput} placeholder="What's on your mind" />

                {imagePreview && <div className="relative w-100">
                  <img
                    alt="HeroUI hero Image"
                    src={imagePreview}
                    className="rounded-lg"
                  />
                  <IoCloseCircleOutline
                    onClick={handleClearImage}
                    className="absolute top-2 right-2 z-9999 text-white cursor-pointer text-2xl"
                  />
                </div>}
              </ModalBody>
              <ModalFooter className="flex items-center">
                <label className="flex-1">
                  <LuImagePlus className="text-blue-500 text-xl cursor-pointer" />
                  <input type="file" hidden
                    onChange={handleChangeImage}
                    ref={imageInput} />
                </label>
                <Button className="rounded-4xl text-white bg-red-500 hover:bg-red-400 focus-visible:outline-red-500" onPress={onClose}>
                  Close
                </Button>
                <Button className="rounded-4xl text-white bg-indigo-500 hover:bg-indigo-400 focus-visible:outline-indigo-500"
                  disabled={isPending}
                  onPress={mutate}>
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