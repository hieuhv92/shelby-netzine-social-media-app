'use client';

import Image from "next/image";
import { use, useEffect, useState, useRef } from "react";
import { setCommentDetails } from "@/lib/redux/slices/modalSlice";
import { useDispatch, useSelector } from "react-redux";
import Composer from "@/components/feed/Composer";
import { RootState } from "@/lib/redux/store";
import { ChartBarIcon, ArrowUpTrayIcon, ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline";
import {
    addCommentToCurrentPost,
    incrementCommentCount,
    setCommentsForCurrentPost,
    setCurrentPost
} from "@/lib/redux/slices/postSlice";
import LikeButton from "@/components/ui/LikeButton";

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const postId = resolvedParams.id;

    // Get data from Redux
    const post = useSelector((state: RootState) => state.post.currentPost);

    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const composerRef = useRef<HTMLDivElement>(null);

    const fetchComments = async (): Promise<void> => {
        try {
            const res = await fetch(`/api/posts/${postId}/comments`);
            if (res.ok) {
                const data = await res.json();
                dispatch(setCommentsForCurrentPost(data.comments || []));
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    // Initial data fetch (Post details + Comments)
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [postRes, commRes] = await Promise.all([
                    fetch(`/api/posts/${postId}`),
                    fetch(`/api/posts/${postId}/comments`)
                ]);

                if (postRes.ok) {
                    const postData = await postRes.json();
                    const commData = commRes.ok ? await commRes.json() : { comments: [] };

                    // Combine post info and comments list into one object
                    const fullPostData = {
                        ...postData.post,
                        comments: commData.comments || []
                    };

                    // DISPATCH TO REDUX: This updates both UI and counts
                    dispatch(setCurrentPost(fullPostData));
                }
            } catch (error) {
                console.error("Failed to fetch post details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Cleanup: Clear current post when leaving the page to avoid showing old data
        return () => {
            dispatch(setCurrentPost(null));
        };
    }, [postId, dispatch]);

    const handleCommentSuccess = (responseData: any) => {
        if (responseData.comment) {
            dispatch(addCommentToCurrentPost(responseData.comment));
        } else {
            dispatch(incrementCommentCount({ postId }));
            fetchComments();
        }
    };

    const scrollToComposer = () => {
        composerRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Renders ONLY the middle column content
    return (
        <div className="bg-white min-h-screen">
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                </div>
            ) : !post ? (
                <div className="p-10 text-center text-gray-500 font-medium">
                    Post not found.
                </div>
            ) : (
                <>
                    {/* Main Post Section */}
                    <div className="flex flex-col p-3 space-y-4 border-b border-gray-100">
                        <div className="flex space-x-3">
                            <Image
                                src={post.user?.avatar_url || "/assets/avatar.jpg"}
                                width={44}
                                height={44}
                                alt="User Avatar"
                                className="w-11 h-11 rounded-full object-cover"
                            />
                            <div className="flex flex-col">
                                <span className="font-bold">{post.user?.username}</span>
                                {post.user?.display_name &&
                                    <span className="text-gray-500 text-sm">@{post.user?.display_name}</span>
                                }
                            </div>
                        </div>

                        <span className="text-[17px] leading-normal">{post.caption}</span>

                        {post.shelby_file_url && (
                            <div className="rounded-2xl overflow-hidden border border-gray-100">
                                {post.file_type === 'image' || !post.file_type ? (
                                    <img src={post.shelby_file_url}
                                        alt="Post image"
                                        className="w-full h-auto"
                                        onError={(e) => {
                                            e.currentTarget.src = '/assets/placeholder_image_01.jpg';
                                        }}
                                    />
                                ) : (
                                    <video src={post.shelby_file_url} controls className="w-full" />
                                )}
                            </div>
                        )}
                    </div>

                    {/* Interaction Stats */}
                    <div className="border-b border-gray-100 p-3 text-[15px]">
                        <span className="font-bold">{(post.likes_count || 0).toLocaleString()}</span> likes
                    </div>

                    {/* Stats & Actions */}
                    <div className="border-b border-gray-100 p-3 flex justify-evenly">
                        <div className="relative">
                            <ChatBubbleOvalLeftEllipsisIcon
                                className="w-[22px] h-[22px] text-[#707E89] cursor-pointer hover:text-[#F4AF01] transition"
                                onClick={() => {
                                    dispatch(setCommentDetails({
                                        displayName: post.user?.display_name,
                                        username: post.user?.username,
                                        userId: post.user_id,
                                        caption: post.caption,
                                        shelbyFileUrl: post.shelby_file_url,
                                        postId: post.id
                                    }))
                                    scrollToComposer();
                                }}
                            />
                            <span className="absolute text-xs top-1 -right-3">
                                <span>{post.comments_count || 0}</span>
                            </span>
                        </div>

                        <LikeButton post={post} />

                        <ChartBarIcon className="w-[22px] h-[22px] text-[#707E89] cursor-not-allowed hover:text-[#F4AF01] transition" />
                        <ArrowUpTrayIcon className="w-[22px] h-[22px] text-[#707E89] cursor-not-allowed hover:text-[#F4AF01] transition" />
                    </div>

                    <div ref={composerRef} className="border-b border-gray-100">
                        <Composer
                            type="comment"
                            postId={postId}
                            insideModal={false}
                            onSuccess={handleCommentSuccess}
                        />
                    </div>

                    {/* Comments List - FIX: Get post.comments from Redux */}
                    <div className="pb-20">
                        {post.comments && post.comments.length > 0 ? (
                            post.comments.map((comment: any) => (
                                <CommentItem
                                    key={comment.id}
                                    username={comment.user?.username}
                                    displayName={comment.user?.display_name}
                                    content={comment.caption || comment.content}
                                />
                            ))
                        ) : (
                            <div className="p-10 text-center text-gray-400 text-sm">
                                No comments yet. Be the first to reply!
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

// Sub-component for individual comments
function CommentItem({ username, displayName, content }: any) {
    return (
        <div className="p-4 border-b border-gray-100 flex space-x-3 hover:bg-gray-50 transition">
            <div className="flex-shrink-0">
                <Image
                    src="/assets/avatar.jpg"
                    width={40}
                    height={40}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full"
                />
            </div>
            <div className="flex-col w-full">
                <div className="flex items-center space-x-1">
                    <span className="font-bold text-[15px]">{username}</span>
                    {displayName && <span className="text-gray-500 text-[14px]">@{displayName}</span>}
                </div>
                <p className="text-[15px] text-gray-800 mt-1 leading-normal">{content}</p>
            </div>
        </div>
    );
}
