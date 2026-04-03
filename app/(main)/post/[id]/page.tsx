'use client';

import { ArrowLeftIcon, ChatBubbleLeftEllipsisIcon, HeartIcon, ChartBarIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";
import { use, useEffect, useState } from "react";
import { Post, Comment as CommentType } from '@/types';
import { useRouter } from "next/navigation";

// Sub-component for individual comments
function CommentItem({ username, displayName, content }: any) {
    return (
        <div className="p-3 border-b border-gray-100 flex space-x-3">
            <div className="w-11 h-11 bg-gray-200 rounded-full flex-shrink-0" />
            <div>
                <div className="flex space-x-1 items-center">
                    <span className="font-bold text-[15px]">{username}</span>
                    <span className="text-gray-500 text-[14px]">@{displayName}</span>
                </div>
                <p className="text-[15px] text-gray-800">{content}</p>
            </div>
        </div>
    );
}

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const postId = resolvedParams.id;

    const [post, setPost] = useState<Post | null>(null)
    const [comments, setComments] = useState<CommentType[]>([])
    const [loading, setLoading] = useState(true)
    const router = useRouter()

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
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [postId]);

    // Renders ONLY the middle column content
    return (
        <div className="bg-white min-h-screen">
            {/* Sticky Header */}
            <div className="py-2 px-3 sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100 flex items-center">
                <button
                    onClick={() => router.back()}
                    className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-200 transition cursor-pointer"
                >
                    <ArrowLeftIcon className="w-5 h-5 text-[#0F1419]" />
                </button>
                <h2 className="text-xl font-bold ml-5">Post</h2>
            </div>

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
                                <span className="text-gray-500 text-sm">@{post.user?.display_name}</span>
                            </div>
                        </div>

                        <span className="text-[17px] leading-normal">{post.caption}</span>

                        {post.shelby_file_url && (
                            <div className="rounded-2xl overflow-hidden border border-gray-100">
                                {post.file_type === 'image' ? (
                                    <img src={post.shelby_file_url} alt="Post image" className="w-full h-auto" />
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
                        <ChatBubbleLeftEllipsisIcon className="w-[22px] h-[22px] text-[#707E89] cursor-pointer hover:text-blue-400" />
                        <HeartIcon className="w-[22px] h-[22px] text-[#707E89] cursor-pointer hover:text-red-500" />
                        <ChartBarIcon className="w-[22px] h-[22px] text-[#707E89] cursor-pointer hover:text-blue-400" />
                        <ArrowUpTrayIcon className="w-[22px] h-[22px] text-[#707E89] cursor-pointer hover:text-blue-400" />
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