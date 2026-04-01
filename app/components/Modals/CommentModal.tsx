"use client"

import { Modal } from '@mui/material'
import React from 'react'
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/redux/store";
import { openCommentModal, closeCommentModal } from "@/app/redux/slices/modalSlice";
import { PostHeader } from '../Post';
import PostInput from '../PostInput';
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function CommentModal() {
    const open = useSelector((state: RootState) => state.modals.commentModalOpen);
    const commentDetails = useSelector((state: RootState) => state.modals.commentPostDetails);
    const dispatch = useDispatch();
    const postId = commentDetails.postId;

    const fetchComments = async () => {
        try {
            const response = await fetch(`/api/posts/${postId}/comments`);
            if (!response.ok) {
                throw new Error("Failed to fetch comments");
            }
            const data = await response.json();
            setComments(data.comments || []);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };
    return (
        <>
            <Modal
                open={open}
                onClose={() => dispatch(closeCommentModal())}
                className="flex justify-center items-center"
            >

                <div className="w-full h-full sm:w-[600px] sm:h-fit bg-white
                sm:rounded-xl outline-none relative">
                    <XMarkIcon
                        className="w-7 mt-5 ms-5 cursor-pointer"
                        onClick={() => dispatch(closeCommentModal())}
                    />
                    <div className='pt-5 pb-10 px-0 sm:px-5 flex flex-col'>
                        <PostHeader
                            username={commentDetails.username}
                            caption={commentDetails.caption}
                            replyTo={commentDetails.username}
                            shelbyFileUrl={commentDetails.shelbyFileUrl}
                            insideModal={true}
                        />
                        <div className='mt-4'>
                            <PostInput
                                insideModal={true}
                                postId={commentDetails.postId}
                            />
                        </div>
                        <div className="absolute w-0.5 h-29 bg-gray-300 
                        left-[33px] sm:left-[53px] top-20 z-0
                        "></div>
                    </div>
                </div>

            </Modal >
        </>
    )
}