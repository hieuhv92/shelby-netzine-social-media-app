import Image from "next/image";
import { formatDate } from '@/lib/utils';

interface PostContentProps {
    username: string,
    displayName?: string,
    caption: string,
    timestamp?: string,
    replyTo?: string,
    fileType?: string,
    shelbyFileUrl?: string,
    avatarUrl?: string,
    detailAspectRatio?: number,
    insideModal?: boolean,
    isPostDetail?: boolean,
}

export default function PostContent({ username, caption, timestamp, replyTo, fileType, shelbyFileUrl, avatarUrl, insideModal, isPostDetail }: PostContentProps) {
    return (
        <div className="flex p-3 space-x-5">
            <Image
                src={avatarUrl || '/assets/avatar_default.jpg'}
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
                                            e.currentTarget.src = '/assets/placeholder_image_01.jpg';
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
