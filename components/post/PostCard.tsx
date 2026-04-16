import { Post } from '@/types';
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import PostContent from "./PostContent";
import { openCommentModal, setCommentDetails } from "@/lib/redux/slices/modalSlice";
import { ArrowUpTrayIcon, ChartBarIcon, ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/outline";
import LikeButton from '../ui/LikeButton';
import { RootState } from '@/lib/redux/store';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { toast } from "sonner";

interface PostProps {
    post: any,
    id: string,
    isProfileView?: boolean
}

export default function PostCard({ post, id, isProfileView }: PostProps) {
    const user = post.user;
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state: RootState) => state.user);
    const { account } = useWallet();

    return (
        <div className="border-b border-gray-100 hover:bg-gray-100 transition duration-200 ease-out">
            <Link href={`/post/${id}`}>
                <PostContent
                    username={user?.username}
                    caption={post?.caption}
                    timestamp={post?.created_at}
                    fileType={post?.file_type}
                    shelbyFileUrl={post?.shelby_file_url}
                    avatarUrl={user?.avatar_url}
                />
            </Link>

            {
                !isProfileView && <div className="ml-16 p-3 flex space-x-14">
                    <div className="relative">
                        <ChatBubbleOvalLeftEllipsisIcon className="w-[22px] h-[22px] cursor-pointer
                    hover:text-[#F4AF01] transition"
                            onClick={() => {
                                // 1. Validation: Block opening modal if not authenticated
                                if (!isAuthenticated || !account) {
                                    toast.error("Please connect your wallet to join the conversation!", {
                                        style: { background: '#F59E0B', color: '#fff', borderRadius: '8px' },
                                        duration: 4000,
                                    });
                                    return; // Prevent opening the modal
                                }

                                // 2. If authenticated, set details and open modal
                                dispatch(setCommentDetails({
                                    displayName: user?.display_name,
                                    username: user?.username,
                                    userId: post.user_id,
                                    caption: post.caption,
                                    shelbyFileUrl: post.shelby_file_url,
                                    postId: post.id
                                }));
                                dispatch(openCommentModal());
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
            }

        </div>
    )
}
