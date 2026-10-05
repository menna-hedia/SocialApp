import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import LoaderScreen from "./../LoaderScreen/LoaderScreen";
import CardHeader from "./../CardHeader/CardHeader";
import CommentCard from "./../CommentCard/CommentCard";
import CommentCreation from "./../CommentCreation/CommentCreation";
import PostActions from "../PostActions/PostActions";
import SharedPost from "../SharedPost/SharedPost";
import { getOriginalPost } from "../../utils/getOriginalPost";

export default function PostDetails() {
    const { id } = useParams();
    const commentsKey = ["getComments", id];

    function getPostDetails() {
        return axios
            .get(`https://route-posts.routemisr.com/posts/${id}`, {
                headers: { token: localStorage.getItem("token") },
            })
            .then((response) => response.data);
    }

    function getAllComments() {
        return axios
            .get(`https://route-posts.routemisr.com/posts/${id}/comments`, {
                headers: { token: localStorage.getItem("token") },
            })
            .then((response) => response.data);
    }

    const { data, isLoading, isError } = useQuery({
    queryKey: ["getPostDetails", id],
    queryFn: getPostDetails,
    retry: false,
});

const { data: commentsData, isLoading: commentsLoading } = useQuery({
    queryKey: commentsKey,
    queryFn: getAllComments,
    retry: false,
    enabled: !isError,
});

    // only the first load shows the loader: a refetch must not unmount the page (and the edit modal)
    if (isLoading || commentsLoading) {
    return <LoaderScreen />;
}

if (isError || !data?.data?.post) {
    return (
        <div className="rounded-xl bg-white p-8 text-center shadow-md">
            <p className="text-lg font-semibold text-gray-800">This post isn't available</p>
            <p className="mt-1 text-sm text-gray-500">It may have been deleted.</p>
            <Link
                to="/home"
                className="mt-5 inline-block rounded-4xl bg-indigo-500 px-6 py-3 text-sm font-medium text-white hover:bg-indigo-400"
            >
                Back to home
            </Link>
        </div>
    );
}

    const post = data.data.post;
    const { body, image, user, createdAt, commentsCount, likesCount, sharesCount } = post;
    const { photo, name, _id } = user || {};
    const comments = commentsData?.data?.comments || [];
    const original = getOriginalPost(post);

    return (
        <div className="mx-auto flex w-full flex-col items-start rounded-xl bg-white p-6 shadow-md md:p-10">
            {/* profile & options */}
            <CardHeader
                cardType="post"
                photo={photo}
                name={name}
                description={createdAt?.split("T")[0]}
                style={"w-18 h-18"}
                userId={_id}
                postId={id}
                body={body}
                image={image}
            />

            {/* post contents */}
            <div className="flex w-full flex-col items-start md:flex-row md:justify-start">
                {image && (
                    <div className="max-w-xl max-sm:max-w-lg">
                        <img className="block rounded-xl" src={image} alt={body} />
                    </div>
                )}

                <div className="flex w-full min-w-0 flex-col justify-center md:m-6 md:p-4">
                    {body && <p className="break-words text-xl">{body}</p>}

                    {/* the original post, when this one is a share */}
                    <SharedPost original={original} />

                    <CommentCreation inputStyle={"my-6 bg-gray-100"} postId={id} queryKey={commentsKey} />

                    <PostActions
                        postId={id}
                        likesCount={likesCount}
                        commentsCount={commentsCount}
                        sharesCount={sharesCount}
                        commentsQueryKey={commentsKey}
                    />

                    {comments.map((comment) => (
                        <div className="mt-6 block w-full rounded-xl bg-gray-100 p-2" key={comment._id}>
                            <CommentCard
                                commentDetails={comment}
                                commentId={comment._id}
                                postId={id}
                                queryKey={commentsKey}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}