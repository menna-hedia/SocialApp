import React, { useContext, useState, useRef } from 'react';
import { authContext } from '../../context/AuthContext';
import axios from "axios";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import LoaderScreen from './../LoaderScreen/LoaderScreen';
import PostUpdate from './../PostUpdate/PostUpdate';
import CommentUpdate from './../CommentUpdate/CommentUpdate'; 

export default function CardHeader({ photo, name, description, style, userId, postId, cardType, commentId, queryKey, body , hidden }) {

    const [showDropdown, setShowDropdown] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    const dropdownRef = useRef();

    const { userId: id } = useContext(authContext);
    const isMyCard = userId === id;

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    function handleDeleteCard() {
        let url;
        if (commentId) {
            url = `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}`;
        } else if (postId) {
            url = `https://route-posts.routemisr.com/posts/${postId}`;
        } else return;

        return axios.delete(url, { headers: { token: localStorage.getItem("token") } });
    }

    const { mutate: handleDeleteMutation, isPending } = useMutation({
        mutationFn: handleDeleteCard,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getPosts"] });
            queryClient.invalidateQueries({ queryKey: ["getPostDetails", postId] });
            queryClient.invalidateQueries({ queryKey: ["getComments", postId] });
            queryClient.invalidateQueries({ queryKey: [queryKey] });

            toast.success(`${cardType} Deleted Successfully`, { position: "top-center", autoClose: 1000, theme: "dark" });
            if (postId && !commentId) navigate("/home");
        },
        onError: () => {
            toast.error('Error occurred ... try again later', { position: "top-center", autoClose: 1000, theme: "dark" });
        },
    });

    React.useEffect(() => {
        function handleClickOutside(e) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (isPending) return <LoaderScreen />;

    return (
        <>
            <div className="w-full py-2 pb-10 flex justify-between relative border-0">
                {isMyCard && 
                    <button onClick={() => setShowDropdown(!showDropdown)} 
                    className={` absolute right-0 text-body hover:text-heading ${hidden}`} type="button">
                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeWidth="3" d="M6 12h.01m6 0h.01m5.99 0h.01" />
                        </svg>
                    </button>
                }

                {showDropdown && (
                    <div ref={dropdownRef} className="absolute right-0 top-5 mt-3 w-44 bg-gray-100 rounded-lg">
                        <ul className="p-2 text-sm">
                            <li>
                                <button 
                                    className="block w-full text-left p-2 hover:bg-blue-200 text-blue-500 rounded"
                                    onClick={() => { setShowUpdateModal(true); setShowDropdown(false); }}
                                >
                                    Update
                                </button>
                            </li>
                            <li>
                                <button 
                                    className="w-full text-left p-2 hover:bg-red-100 text-red-500 rounded"
                                    onClick={handleDeleteMutation}
                                >
                                    Delete
                                </button>
                            </li>
                        </ul>
                    </div>
                )}

                <div className="flex items-center">
                    <div>
                        <img className={`${style} rounded-full`} src={photo} alt="user profile pic" onError={(e) => e.target.src = "https://avatars.githubusercontent.com/u/86160567?s=200&v=4"} />
                    </div>
                    <div>
                        <h5 className="mx-5 text-l font-bold text-heading">{name}</h5>
                        <span className="mx-5 text-sm text-body text-gray-500">{description}</span>
                    </div>
                </div>
            </div>

            {showUpdateModal && (
                commentId ? (
                    <CommentUpdate 
                        postId={postId} 
                        commentId={commentId}
                        initialContent={body}
                        queryKey = {queryKey}
                        onClose={() => setShowUpdateModal(false)}
                    />
                ) : (
                    <PostUpdate 
                        postId={postId} 
                        initialBody={body} 
                        onClose={() => setShowUpdateModal(false)} 
                    />
                )
            )}
        </>
    )
}