import { Link } from "react-router-dom";
import CardHeader from "../CardHeader/CardHeader";
import CommentCard from "./../CommentCard/CommentCard";
import CommentCreation from "../CommentCreation/CommentCreation";
import PostActions from "../PostActions/PostActions";
import SharedPost from "../SharedPost/SharedPost";
import { getOriginalPost } from "../../utils/getOriginalPost";

const readMoreClasses =
    "inline-flex items-center text-body min-w-32 py-3 px-6 text-sm font-medium rounded-4xl text-white bg-indigo-500 hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500";

const arrowIcon = (
    <svg className="w-4 h-4 ms-1.5 rtl:rotate-180 -me-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5m14 0-4 4m4-4-4-4" />
    </svg>
);

export default function PostCard({ postInfo, queryKey, compact = false }) {
    const { body, image, user, createdAt, topComment, _id, commentsCount, likesCount, sharesCount } = postInfo;
    const { photo, name, _id: userId } = user || {};

    const original = getOriginalPost(postInfo);

    if (compact) {
        return (
            <div className="flex aspect-square w-full flex-col overflow-hidden rounded-xl bg-white p-4 shadow-lg">
                <div className="-mb-6 shrink-0">
                    <CardHeader
                        cardType="post"
                        photo={photo}
                        name={name}
                        description={createdAt?.split("T")[0]}
                        style={"w-10 h-10"}
                        userId={userId}
                        postId={_id}
                        body={body}
                    />
                </div>

                <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden">
                    {image && (
                        <div className="min-h-0 flex-1 overflow-hidden rounded-lg">
                            <img className="h-full w-full object-cover" src={image} alt={body} />
                        </div>
                    )}
                    {body && (
                        <p className={`break-words text-sm text-gray-700 ${image || original ? "line-clamp-2" : "line-clamp-6"}`}>
                            {body}
                        </p>
                    )}
                    <SharedPost original={original} clamp />
                </div>

                <div className="mt-3 shrink-0">
                    <Link to={`/postDetails/${_id}`} className={readMoreClasses}>
                        Read more
                        {arrowIcon}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-8 mx-6 mb-6 shadow-lg bg-white rounded-xl">
            <CardHeader cardType="post" photo={photo} name={name} description={createdAt?.split("T")[0]} style={"w-15 h-15"} userId={userId} postId={_id} />

            {image && (
                <div className="mx-auto w-full">
                    <img className="block w-full rounded-xl" src={image} alt={body} />
                </div>
            )}
            {body && <p className="my-6 text-lg">{body}</p>}

            {/* the original post, when this one is a share */}
            <SharedPost original={original} />

            <Link to={`/postDetails/${_id}`} className={`${readMoreClasses} m-4`}>
                Read more
                {arrowIcon}
            </Link>

            {topComment?.content && (
                <div className="mb-5 bg-gray-100 rounded-xl p-2">
                    <CommentCard commentDetails={topComment} queryKey={queryKey} hidden={"hidden"} />
                    <CommentCreation inputStyle={"bg-white my-2"} queryKey={queryKey} postId={_id} />
                </div>
            )}

            <PostActions
                postId={_id}
                likesCount={likesCount}
                commentsCount={commentsCount}
                sharesCount={sharesCount}
            />
        </div>
    );
}