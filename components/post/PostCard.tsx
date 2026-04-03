import { ArrowUpTrayIcon, ChartBarIcon, ChatBubbleOvalLeftEllipsisIcon, HeartIcon } from "@heroicons/react/24/outline";
import { Timestamp } from "next/dist/server/lib/cache-handlers/types";
import Image from "next/image";
import { Post } from '@/types';
import { formatDate } from '@/lib/utils';
import { openCommentModal, setCommentDetails } from "@/lib/redux/slices/modalSlice";
import { useDispatch } from "react-redux";
import Link from "next/link";

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
                <PostHeader
                    username={post.user?.username}
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
                <div className="relative">
                    <HeartIcon className="w-[22px] h-[22px] cursor-pointer
                    hover:text-[#F4AF01] transition"
                    />
                    <span className="absolute text-xs top-1 -right-3">
                        {post?.likes_count}
                    </span>
                </div>
                <div className="relative">
                    <ChartBarIcon className="w-[22px] h-[22px] cursor-not-allowed" />
                </div>
                <div className="relative">
                    <ArrowUpTrayIcon className="w-[22px] h-[22px] cursor-not-allowed" />
                </div>
            </div>
        </div>
    )
}

interface PostHeaderProps {
    username: string,
    displayName?: string,
    caption: string,
    timestamp?: string,
    replyTo?: string,
    fileType?: string,
    shelbyFileUrl?: string,
    detailAspectRatio?: number,
    insideModal?: boolean,
    isPostDetail?: boolean
}

export function PostHeader({ username, caption, timestamp, replyTo, fileType, shelbyFileUrl, insideModal, isPostDetail }: PostHeaderProps) {
    return (
        <div className="flex p-3 space-x-5">
            <Image
                src="/assets/no_avatar.jpg"
                width={44}
                height={44}
                alt="profile input"
                className="w-11 h-11 rounded-full z-10 bg-white"
            />
            <div className="text-[15px] flex flex-col space-y-1.5">
                <div className="flex space-x-1.5 text-[#707E89]">
                    {/* <span className="font-bold text-[#0F1419] 
                    inline-block whitespace-nowrap overflow-hidden text-ellipsis
                    max-w-[60px] min-[400px]:max-w-[100px] min-[500px]:max-w-[140px]
                    sm:max-w-[160px]
                    ">
                        Guest
                    </span> */}
                    <span className="inline-block whitespace-nowrap overflow-hidden text-ellipsis
                    max-w-[60px] min-[400px]:max-w-[100px] min-[500px]:max-w-[140px]
                    sm:max-w-[160px]
                    ">
                        @{username}
                    </span>
                    {
                        timestamp &&
                        <>
                            <span>&middot;</span>
                            {formatDate(timestamp)}
                        </>
                    }
                </div >
                <span>{caption}</span>

                {!isPostDetail && (
                    <>
                        {!insideModal ? (
                            <div className="max-w-md mx-auto w-full">
                                {fileType === 'image' ? (
                                    <img
                                        src={shelbyFileUrl}
                                        alt={caption || 'Post image'}
                                        className="w-full max-h-[512px] object-cover rounded-2xl border border-gray-100"
                                        loading="lazy"
                                        decoding="async"
                                        onError={(e) => {
                                            e.currentTarget.src = '/placeholder-image.svg';
                                        }}
                                    />
                                ) : (
                                    <video
                                        src={shelbyFileUrl}
                                        controls
                                        muted
                                        playsInline
                                        className="w-full max-h-[512px] object-cover rounded-2xl border border-gray-100"
                                        preload="metadata"
                                    />
                                )}
                            </div>
                        ) : (
                            <div className="mt-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-full">
                                <a
                                    href="#"
                                    title={shelbyFileUrl}
                                    className="text-[#8247E5] text-[14px] font-medium hover:underline pointer-events-none cursor-default opacity-90"
                                    aria-disabled="true"
                                >
                                    {shelbyFileUrl?.replace("https://", "").slice(0, 30)}...
                                </a>
                            </div>
                        )}
                    </>
                )}

                {replyTo &&
                    <span className="text-[15px] text-[#707E89]">
                        Replying to <span className="text-[#F4AF01]">@{replyTo}</span>
                    </span>
                }
            </div>
        </div >
    )
}
