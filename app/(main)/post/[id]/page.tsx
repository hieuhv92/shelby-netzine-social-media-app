'use client';

import { ArrowLeftIcon, ChatBubbleLeftEllipsisIcon, HeartIcon, ChartBarIcon, ArrowUpTrayIcon, ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { use, useEffect, useState, useRef } from "react";
import { Post, Comment as CommentType } from '@/types';
import { openCommentModal, setCommentDetails } from "@/lib/redux/slices/modalSlice";
import { useDispatch } from "react-redux";
import { usePost } from "@/contexts/PostProvider";
import Composer from "@/components/feed/Composer";

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
                    <span className="text-gray-500 text-[14px]">@{displayName}</span>
                </div>
                <p className="text-[15px] text-gray-800 mt-1 leading-normal">{content}</p>
            </div>
        </div>
    );
}

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const postId = resolvedParams.id;

    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<CommentType[]>([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const composerRef = useRef<HTMLDivElement>(null);

    // Get the sync function from our Global Context
    const { refreshOnePost } = usePost();

    // Helper function to only refresh comments list
    const fetchComments = async (): Promise<void> => {
        try {
            const res = await fetch(`/api/posts/${postId}/comments`);
            if (res.ok) {
                const data = await res.json();
                setComments(data.comments || []);
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
                    const data = await postRes.json();
                    setPost(data.post);
                }
                if (commRes.ok) {
                    const data = await commRes.json();
                    setComments(data.comments || []);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [postId]);

    // Handle updates after a new comment is posted
    const handleCommentSuccess = () => {
        fetchComments();        // 1. Refresh local comments list immediately
        setPost(prev => {
            if (!prev) return null;
            return {
                ...prev,
                comments_count: (prev.comments_count || 0) + 1
            };
        });
        refreshOnePost(postId);  // 2. Sync comment count back to the FeedList in Context
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
                                src="/assets/avatar.jpg"
                                width={44}
                                height={44}
                                alt="User Avatar"
                                className="w-11 h-11 rounded-full"
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
                                {post.file_type === 'image' ? (
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
                        <span className="font-bold">{post?.likes_count?.toLocaleString()}</span> likes
                    </div>

                    {/* Stats & Actions */}
                    <div className="border-b border-gray-100 p-3 flex justify-evenly">
                        <div className="relative">
                            <ChatBubbleOvalLeftEllipsisIcon
                                className="w-[22px] h-[22px] text-[#707E89] cursor-pointer hover:text-blue-400"
                                onClick={() => {
                                    dispatch(setCommentDetails({
                                        displayName: post.user?.display_name,
                                        username: post.user?.username,
                                        userId: post.user_id,
                                        caption: post.caption,
                                        shelbyFileUrl: post.shelby_file_url,
                                        postId: post.id
                                    }))
                                    scrollToComposer
                                    // dispatch(openCommentModal())
                                }}

                            />
                            <span className="absolute text-xs top-1 -right-3">
                                {post?.comments_count || 0}
                            </span>
                        </div>
                        <HeartIcon className="w-[22px] h-[22px] text-[#707E89] cursor-pointer hover:text-red-500" />
                        <ChartBarIcon className="w-[22px] h-[22px] text-[#707E89] cursor-pointer hover:text-blue-400" />
                        <ArrowUpTrayIcon className="w-[22px] h-[22px] text-[#707E89] cursor-pointer hover:text-blue-400" />
                    </div>
                    <div ref={composerRef} className="border-b border-gray-100">
                        <Composer
                            type="comment"
                            postId={postId}
                            insideModal={true}
                            onSuccess={handleCommentSuccess}
                        />
                    </div>

                    {/* Comments List */}
                    <div className="pb-20">
                        {comments.length > 0 ? (
                            comments.map((comment) => (
                                <CommentItem
                                    key={comment.id}
                                    username={comment.user?.username}
                                    displayName={comment.user?.display_name}
                                    content={comment.content}
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