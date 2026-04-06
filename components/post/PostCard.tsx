import { Post } from '@/types';
import { useDispatch } from "react-redux";
import Link from "next/link";
import PostContent from "./PostContent";
import { openCommentModal, setCommentDetails } from "@/lib/redux/slices/modalSlice";
import { ArrowUpTrayIcon, ChartBarIcon, ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline";
import LikeButton from '../ui/LikeButton';

interface PostProps {
    post: Post,
    id: string
}

export default function PostCard({ post, id }: PostProps) {
    const user = post.user;
    const dispatch = useDispatch();

    return (
        <div className="border-b border-gray-100">
            <Link href={'/post/' + id}>
                <PostContent
                    username={user?.username}
                    caption={post?.caption}
                    timestamp={post?.created_at}
                    fileType={post?.file_type}
                    shelbyFileUrl={post?.shelby_file_url}
                />
            </Link>

            <div className="ml-16 p-3 flex space-x-14">
                <div className="relative">
                    <ChatBubbleOvalLeftEllipsisIcon className="w-[22px] h-[22px] cursor-pointer
                    hover:text-[#F4AF01] transition"
                        onClick={() => {
                            dispatch(setCommentDetails({
                                displayName: user?.display_name,
                                username: user?.username,
                                userId: post.user_id,
                                caption: post.caption,
                                shelbyFileUrl: post.shelby_file_url,
                                postId: post.id
                            }))
                            dispatch(openCommentModal())
                        }}
                    />
                    <span className="absolute text-xs top-1 -right-3">
                        {post?.comments_count}
                    </span>
                </div>

                <LikeButton post={post} />

                <div className="relative">
                    <ChartBarIcon className="w-[22px] h-[22px] cursor-not-allowed hover:text-[#F4AF01]" />
                </div>
                <div className="relative">
                    <ArrowUpTrayIcon className="w-[22px] h-[22px] cursor-not-allowed hover:text-[#F4AF01]" />
                </div>
            </div>
        </div>
    )
}
