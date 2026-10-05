import { useContext, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { LuHeart, LuMessageCircle } from "react-icons/lu";
import { toast } from "react-toastify";
import { authContext } from "../../context/AuthContext";
import CardHeader from "../CardHeader/CardHeader";
import RepliesSection from "../RepliesSection/RepliesSection";

export default function CommentCard({ commentDetails, commentId, postId, queryKey, hidden }) {
    const [showReplies, setShowReplies] = useState(false);
    const { userId: myId } = useContext(authContext) || {};

    const comment = commentDetails;
    const { name, username, photo, _id } = comment?.commentCreator || {};

    const realCommentId = commentId || comment?._id;
    const realPostId = postId || comment?.post;

    // the count field name is a guess
    const repliesCount = comment?.repliesCount ?? comment?.replies?.length;

    const initialLiked = Boolean(
        comment?.isLiked ??
        comment?.liked ??
        (Array.isArray(comment?.likes) && comment.likes.some((l) => (l?._id || l) === myId))
    );
    const initialLikes = comment?.likesCount ?? comment?.likes?.length ?? 0;

    const [liked, setLiked] = useState(initialLiked);
    const [likes, setLikes] = useState(initialLikes);

    const { mutate: toggleLike, isPending: liking } = useMutation({
        mutationFn: () =>
            axios.put(
                `https://route-posts.routemisr.com/posts/${realPostId}/comments/${realCommentId}/like`,
                {},
                { headers: { token: localStorage.getItem("token") } }
            ),
        onMutate: () => {
            const previous = { liked, likes };
            setLiked(!liked);
            setLikes((c) => (liked ? Math.max(c - 1, 0) : c + 1));
            return previous;
        },
        onError: (err, _vars, previous) => {
            setLiked(previous.liked);
            setLikes(previous.likes);
            toast.error("Could not update like", { position: "top-right", autoClose: 1000 });
        },
    });

    const actionBtn =
        "inline-flex items-center gap-1.5 text-sm font-medium transition";

    return (
        <div className="rounded-lg p-2 mb-2">
            <CardHeader
                cardType="comment"
                photo={photo}
                queryKey={queryKey}
                name={name}
                description={username}
                userId={_id}
                style={"w-10 h-10"}
                commentId={realCommentId}
                postId={realPostId}
                body={comment?.content}
                image={comment?.image}
                hidden={hidden}
            />

            {comment?.content && <p className="m-2 break-words">{comment.content}</p>}
            {comment?.image && (
                <img
                    src={comment.image}
                    alt="comment attachment"
                    className="m-2 max-w-xs rounded-xl"
                />
            )}

            {realPostId && realCommentId && (
                <>
                    <div className="m-2 flex items-center gap-5">
                        <button
                            type="button"
                            onClick={() => toggleLike()}
                            disabled={liking}
                            aria-label={liked ? "Unlike comment" : "Like comment"}
                            className={`${actionBtn} ${liked ? "text-indigo-500" : "text-gray-500 hover:text-indigo-500"}`}
                        >
                            <LuHeart className={`text-base ${liked ? "fill-current" : ""}`} />
                            {likes}
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowReplies((v) => !v)}
                            className={`${actionBtn} text-indigo-500 hover:underline`}
                        >
                            <LuMessageCircle className="text-base" />
                            {showReplies
                                ? "Hide replies"
                                : repliesCount > 0
                                ? `Replies (${repliesCount})`
                                : "Reply"}
                        </button>
                    </div>

                    {showReplies && (
                        <RepliesSection
                            postId={realPostId}
                            commentId={realCommentId}
                            parentQueryKey={queryKey}
                        />
                    )}
                </>
            )}
        </div>
    );
}