import CardHeader from "../CardHeader/CardHeader";

export default function CommentCard({ commentDetails, commentId, postId, queryKey , hidden }) {
    const Comment = commentDetails;
    const commentCreator = Comment?.commentCreator || {};
    const { name, username, photo, _id } = commentCreator;

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
                commentId={commentId}
                postId={postId}
                body={Comment.content}
                hidden ={hidden}
            />
            <p className="m-2">{Comment.content}</p>
        </div>
    );
}