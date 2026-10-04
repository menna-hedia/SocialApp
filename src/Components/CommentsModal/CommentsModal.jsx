import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { SyncLoader } from "react-spinners";
import CommentCard from "../CommentCard/CommentCard";
import CommentCreation from "../CommentCreation/CommentCreation";

export default function CommentsModal({ postId, isOpen, onOpenChange }) {
  const queryKey = ["getComments", postId];

  const { data, isLoading, isError } = useQuery({
    queryKey,
    enabled: isOpen, // only fetch when the modal is opened
    queryFn: () =>
      axios
        .get(`https://route-posts.routemisr.com/posts/${postId}/comments`, {
          headers: { token: localStorage.getItem("token") },
        })
        .then((res) => res.data),
  });

  const comments = data?.data?.comments || [];

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} scrollBehavior="inside" size="lg">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="text-center">Comments</ModalHeader>

            <ModalBody>
              {isLoading && (
                <div className="flex justify-center py-6">
                  <SyncLoader color="#6366f1" size={8} />
                </div>
              )}

              {isError && (
                <p className="py-6 text-center text-sm text-red-500">
                  Could not load comments, try again later.
                </p>
              )}

              {!isLoading && !isError && comments.length === 0 && (
                <p className="py-6 text-center text-sm text-gray-500">
                  No comments yet. Be the first to comment.
                </p>
              )}

              {comments.map((comment) => (
                <div key={comment._id} className="rounded-xl bg-gray-100 p-2">
                  <CommentCard
                    commentDetails={comment}
                    commentId={comment._id}
                    postId={postId}
                    queryKey={queryKey}
                  />
                </div>
              ))}
            </ModalBody>

            <ModalFooter className="block">
              <CommentCreation inputStyle="bg-gray-100" queryKey={queryKey} postId={postId} />
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}