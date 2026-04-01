'use client';

import { ArrowLeftIcon, ArrowsRightLeftIcon, ArrowUpTrayIcon, ChartBarIcon, ChatBubbleLeftEllipsisIcon, EllipsisHorizontalCircleIcon, HeartIcon } from "@heroicons/react/24/outline";
import CommentModal from "../components/Modals/CommentModal";
import PostFeed from "../components/PostFeed";
import Sidebar from "../components/Sidebar";
import Widgets from "../components/Widgets";
import Link from "next/link";
import Image from "next/image";
import { PostHeader } from "../components/Post";
import { use, useEffect, useState } from "react";
import { Post, Comment as CommentType } from '@/types';
import { useRouter } from "next/navigation";


interface PostDetailProps {
    id: string
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const postId = resolvedParams.id;

    const [post, setPost] = useState<Post | null>(null)
    const [comments, setComments] = useState<Comment[]>([])
    const [newComment, setNewComment] = useState('')
    const [isLiked, setIsLiked] = useState(false)
    const [likesCount, setLikesCount] = useState(0)
    const [loading, setLoading] = useState(true)
    const [submittingComment, setSubmittingComment] = useState(false)
    const router = useRouter()


    useEffect(() => {
        fetchPost()
        fetchComments()
    }, [resolvedParams.id])


    const fetchPost = async () => {
        try {
            const response = await fetch(`/api/posts/${postId}`)
            if (!response.ok) {
                throw new Error('Failed to fetch post')
            }
            const data = await response.json()
            setPost(data.post)
            setIsLiked(data.post.is_liked || false)
            setLikesCount(data.post.likes_count || 0)
        } catch (error) {
            console.error('Error fetching post:', error)
        } finally {
            setLoading(false);
        }
    }

    const fetchComments = async () => {
        try {
            const response = await fetch(`/api/posts/${postId}/comments`)
            if (!response.ok) {
                throw new Error('Failed to fetch comments')
            }
            const data = await response.json()
            setComments(data.comments || [])
        } catch (error) {
            console.error('Error fetching comments:', error)
        }
    }

    return (
        <div className="bg-white min-h-screen">
            <main className="max-w-[1300px] mx-auto flex">

                {/* Column 1: Sidebar (Always visible) */}
                <Sidebar />

                {/* Column 2: Post Content */}
                <div className="flex-grow border-l border-r border-gray-100 max-w-2xl w-full ml-[80px] xl:ml-[370px]">

                    {/* Sticky Header with Back Button */}
                    <div className="py-2 px-3 text-lg sm:text-xl sticky top-0 z-50 bg-white bg-opacity-80 backdrop-blur-sm font-bold border-b border-gray-100 flex items-center">
                        <Link href="/">
                            <div className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-200 transition duration-200 ease-out cursor-pointer group">
                                <ArrowLeftIcon className="w-5 h-5 text-[#0F1419]" />
                            </div>
                        </Link>
                        <div className="ml-5 flex flex-col">
                            <h2 className="text-xl font-bold leading-tight">Post</h2>
                        </div>
                    </div>

                    {/* Loading State Logic inside the feed */}
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-strong"></div>
                        </div>
                    ) : !post ? (
                        <div className="p-10 text-center text-gray-500 font-medium">
                            Post not found or has been deleted.
                        </div>
                    ) : (
                        <>
                            {/* Main Post Section */}
                            <div className="flex flex-col p-3 space-y-5 border-b border-gray-100">
                                <div className="flex justify-between items-center mb-1.5">
                                    <div className="flex space-x-3">
                                        <Image
                                            src={"/assets/avatar.jpg"}
                                            width={44}
                                            height={44}
                                            alt="User Avatar"
                                            className="w-11 h-11 rounded-full"
                                        />
                                        <div className="flex flex-col text-[15px]">
                                            <span className="font-bold">{post?.user?.username}</span>
                                            <span className="text-[#707E89]">@{post?.user?.display_name}</span>
                                        </div>
                                    </div>
                                    <EllipsisHorizontalCircleIcon className="w-5 h-5 text-gray-500 cursor-pointer" />
                                </div>

                                <span className="text-[15px]">{post?.caption}</span>

                                <div className="max-w-md mx-auto w-full">
                                    {post?.file_type === 'image' ? (
                                        <img
                                            src={post?.shelby_file_url}
                                            className="w-full max-h-[512px] object-cover rounded-2xl border border-gray-100"
                                            alt="Post content"
                                        />
                                    ) : (
                                        <video
                                            src={post?.shelby_file_url}
                                            controls
                                            className="w-full rounded-2xl border border-gray-100"
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Interaction Stats */}
                            <div className="border-b border-gray-100 p-3 text-[15px]">
                                <span className="font-bold">{post?.likes_count?.toLocaleString()}</span> likes
                            </div>

                            {/* Interaction Buttons */}
                            <div className="border-b border-gray-100 p-3 flex justify-evenly">
                                <ChatBubbleLeftEllipsisIcon className="w-[22px] h-[22px] text-[#707E89] cursor-pointer hover:text-blue-400" />
                                <HeartIcon className="w-[22px] h-[22px] text-[#707E89] cursor-pointer hover:text-red-500" />
                                <ChartBarIcon className="w-[22px] h-[22px] text-[#707E89] cursor-pointer hover:text-blue-400" />
                                <ArrowUpTrayIcon className="w-[22px] h-[22px] text-[#707E89] cursor-pointer hover:text-blue-400" />
                            </div>

                            {/* Comments List */}
                            {/* {post?.comments?.map((comment) => (
                                <Comment key={comment.id} comment={comment} />
                            ))} */}
                        </>
                    )}
                </div>

                {/* Column 3: Widgets (Always visible) */}
                <div className="hidden lg:inline ml-8 flex-grow max-w-[350px]">
                    <Widgets />
                </div>
            </main>
            <CommentModal />
        </div>
    );
}

function Comment() {
    return (
        <div className="border-b border-gary-100">
            <PostHeader
                username="alex123"
                displayName="Alex"
                caption="Hello World!"
            />
            <div className="flex space-x-14 p-3 ms-16">
                <ChatBubbleLeftEllipsisIcon className="w-[22px] h-[22px] cursor-not-allowed" />
                <HeartIcon className="w-[22px] h-[22px] cursor-not-allowed" />
                <ChartBarIcon className="w-[22px] h-[22px] cursor-not-allowed" />
                <ArrowUpTrayIcon className="w-[22px] h-[22px] cursor-not-allowed" />
            </div>
        </div>
    )
}
