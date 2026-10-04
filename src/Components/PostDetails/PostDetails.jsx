import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import LoaderScreen from "./../LoaderScreen/LoaderScreen";
import CardHeader from "./../CardHeader/CardHeader";
import CommentCard from "./../CommentCard/CommentCard";
import CommentCreation from './../CommentCreation/CommentCreation';
import PostActions from "../PostActions/PostActions";


export default function PostDetails({ queryKey }) {


    const { id } = useParams();

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

    const { data, isLoading, isFetching } = useQuery({
        queryKey: ["getPostDetails", id],
        queryFn: getPostDetails,
        // getAllComments,
    });

    const { data: commentsData, isLoading: commentsLoading } = useQuery({
        queryKey:[ queryKey],
        queryFn: getAllComments,
    });

    if (isLoading || isFetching || commentsLoading) {
        return <LoaderScreen></LoaderScreen>;
    }

    const { body, image, user, createdAt, commentsCount, likesCount, sharesCount } = data.data.post;
    const { photo, name , _id } = user;
    const comments = commentsData?.data?.comments || [];

    return (
        <>
            <div className="flex flex-col items-start mx-auto bg-white p-10 rounded-xl md:max-w-300">
                {/* profile & options  */}
              
                    <CardHeader
    cardType="post"
    photo={photo}
    name={name}
    description={createdAt.split("T")[0]}
    style={"w-18 h-18"}
    userId={_id}
    postId={id}
/>
    

                {/* post contents  */}
                <div className="flex flex-col md:flex-row md:justify-start items-start md:items-start w-full">
                    {image && (
                        <div className=" max-w-xl max-sm:max-w-lg">
                            <img className="rounded-xl block" src={image} alt={body} />
                        </div>
                    )}

                    <div className="m-6 flex flex-col justify-center md:p-4 w-full">
                        <p className=" text-xl">{body}</p>

                        <CommentCreation inputStyle={"my-6 bg-gray-100"} buttonStyle={" end-3 bottom-8 "} postId={id} queryKey={queryKey} />

                        <PostActions
    postId={id}
    likesCount={likesCount}
    commentsCount={commentsCount}
    sharesCount={sharesCount}
    isDetails
/>

                        {comments.map((comment) => (
                            <div className=" mt-6 bg-gray-100 rounded-xl p-2 block w-100" key={comment._id}  >
                                <CommentCard commentDetails={comment} commentId={comment._id} postId={id}/>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
