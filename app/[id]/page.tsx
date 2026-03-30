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

// const fetchPost = async (id: string) => {
//     const [post, setPost] = useState<Post | null>(null);
//     const [comments, setComments] = useState<CommentType[]>([]);
//     const [newComment, setNewComment] = useState('');
//     const [isLiked, setIsLiked] = useState(false);
//     const [likesCount, setLikesCount] = useState(0);
//     const [loading, setLoading] = useState(true);
//     const [submittingComment, setSubmittingComment] = useState(false);
//     const router = useRouter();
//     try {
//         const response = await fetch(`/api/posts/${id}`)
//         if (!response.ok) {
//             throw new Error('Failed to fetch post')
//         }
//         const data = await response.json()
//         setPost(data.post)
//         setIsLiked(data.post.is_liked || false)
//         setLikesCount(data.post.likes_count || 0)
//     } catch (error) {
//         console.error('Error fetching post:', error)
//     } finally {
//         setLoading(false)
//     }
// }

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
            setLoading(false)
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

    console.log("post: ", post);

    return (
        <div>
            <div className="bg-white min-h-screen">
                <main className="max-w-[1300px] mx-auto flex">

                    {/* Cột 1: Sidebar đã fixed, không chiếm diện tích ngang */}
                    <Sidebar />

                    {/* Cột 2: PostFeed - Cần đẩy lề để không bị Sidebar đè lên */}
                    <div className="flex-grow border-l border-r border-gray-100 max-w-2xl w-full 
                         ml-[80px] xl:ml-[370px]">
                        {/* ml-80px cho icon sidebar, 370px cho sidebar có chữ + margin-24 */}
                        <div className="py-2 px-3 text-lg sm:text-xl sticky top-0 z-50
    bg-white bg-opacity-80 backdrop-blur-sm font-bold 
    border-b border-gray-100 flex items-center"
                        >
                            {/* Nút Back kiểu X */}
                            <Link href="/">
                                <div className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-200 transition duration-200 ease-out cursor-pointer group">
                                    <ArrowLeftIcon className="w-5 h-5 text-[#0F1419]" />
                                </div>
                            </Link>

                            {/* Tiêu đề cách nút Back một khoảng vừa phải */}
                            <div className="ml-5 flex flex-col">
                                <h2 className="text-xl font-bold leading-tight">POST</h2>
                            </div>
                        </div>

                        <div className="flex flex-col p-3 space-y-5 border-b border-gray-100">
                            <div className="flex justify-between items-center mb-1.5">
                                <div className="flex space-x-3">
                                    <Image
                                        src={"/assets/avatar_01.jpg"}
                                        width={44}
                                        height={44}
                                        alt="Profile Picture"
                                        className="w-11 h-11"
                                    />
                                    <div className="flex flex-col text-[15px]">
                                        <span className="font-bold inline-block whitespace-nowrap overflow-hidden text-ellipsis
                    max-w-[60px] min-[400px]:max-w-[100px] min-[500px]:max-w-[140px]
                    sm:max-w-[160px]">
                                            {post?.user?.username}
                                        </span>
                                        <span className="text-[#707E89] inline-block whitespace-nowrap overflow-hidden text-ellipsis
                    max-w-[60px] min-[400px]:max-w-[100px] min-[500px]:max-w-[140px]
                    sm:max-w-[160px]">
                                            {/* {post.user?.display_name} */}
                                        </span>
                                    </div>
                                </div>
                                <EllipsisHorizontalCircleIcon className="w-5 h-5" />
                            </div>
                            <span className="text-[15px]">{post?.caption}</span>
                        </div>

                        <div className="border-b border-gray-100 p-3 text-[15px]">
                            <span className="font-bold">0</span> likes
                        </div>

                        <div className="border-b border-gray-100 p-3 text-[15px] 
                    flex justify-evenly
                    ">
                            <ChatBubbleLeftEllipsisIcon className="w-[22px] h-[22px] text-[#707E89] cursor-not-allowed" />
                            <HeartIcon className="w-[22px] h-[22px] text-[#707E89] cursor-not-allowed" />
                            <ChartBarIcon className="w-[22px] h-[22px] text-[#707E89] cursor-not-allowed" />
                            <ArrowUpTrayIcon className="w-[22px] h-[22px] text-[#707E89] cursor-not-allowed" />
                        </div>

                        <Comment />
                    </div>

                    {/* Cột 3: Widgets */}
                    <div className="hidden lg:inline ml-8 flex-grow max-w-[350px]">
                        <Widgets />
                    </div>

                </main>
                <CommentModal />
            </div>
        </div>
    )
}

function Comment() {
    return (
        <div className="border-b border-gary-100">
            <PostHeader
                name="Alex"
                username="alex123"
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
