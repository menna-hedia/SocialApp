import { Link } from "react-router-dom";
import CardHeader from "../CardHeader/CardHeader";
import CommentCard from './../CommentCard/CommentCard';
import CommentCreation from "../CommentCreation/CommentCreation";

export default function PostCard({ postInfo, queryKey }) {

    const { body, image, user, createdAt, topComment, _id, commentsCount, likesCount, sharesCount } = postInfo;
    const { photo, name , _id:userId } = user;


    const firstComment = topComment;

    return (
        <>
            {/* full card  */}
            <div className="max-w-xl max-sm:max-w-lg mx-auto p-8 m-6 shadow-lg bg-white rounded-xl border">
                {/* profile & options  */}
                <CardHeader cardType="post" photo={photo} name={name} description={createdAt.split('T')[0]} style={"w-15 h-15"} userId={userId} postId={_id}/>

                {/* post contents  */}
                {image && <div className=" max-w-xl max-sm:max-w-lg mx-auto">
                    <img className="rounded-xl block" src={image} alt={body} />
                </div>}
                <p className="my-6">
                    {body}
                </p>
                <hr className="h-px my-5 bg-gray-200 border-0" />

                {/* card footer  */}
                <div className="flex justify-between">
                    <ul className="flex justify-between items-center text-blue-700">
                        <li>{likesCount} Likes</li>
                        <li className="px-6 ">{commentsCount} Comments</li>
                        <li>{sharesCount} Shares</li>
                    </ul>

                    <Link to={`/postDetails/${_id}`} className="inline-flex items-center text-body block min-w-32 py-3 px-6 text-sm font-medium rounded-4xl text-white bg-indigo-500 hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                        Read more
                        <svg className="w-4 h-4 ms-1.5 rtl:rotate-180 -me-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5m14 0-4 4m4-4-4-4" />
                        </svg>
                    </Link>
                </div>

                <div className="mt-5 bg-gray-100 rounded-xl p-2">
                    {firstComment?.content && (
                        <CommentCard commentDetails={firstComment} queryKey={queryKey} hidden={"hidden"}/>
                    )}
                    <CommentCreation inputStyle={"bg-white my-2"} buttonStyle={"end-2 bottom-1.5"} queryKey={queryKey} postId={_id} />
                </div>

            </div>
        </>
    )
}


