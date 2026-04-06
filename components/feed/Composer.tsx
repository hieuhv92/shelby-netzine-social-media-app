"use client";

import Image from "next/image";
import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { encodeFile } from '@/utils/encodeFile';
import { useSubmitFileToChain } from '@/hooks/useSubmitFileToChain';
import { useUploadFile } from '@/hooks/useUploadFile';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useDispatch, useSelector } from "react-redux";
import { closeCommentModal, closePostModal } from "@/lib/redux/slices/modalSlice";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";
import { RootState } from "@/lib/redux/store";
import { CalendarIcon, ChartBarIcon, FaceSmileIcon, MapPinIcon, PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { addPostToFeed, incrementCommentCount } from "@/lib/redux/slices/postSlice";
interface ComposerProps {
    type: 'post' | 'comment';
    insideModal?: boolean,
    postId?: string,
    onSuccess?: (newPost: any) => void;
    isPostDetailPage?: boolean;
}

export default function Composer({ type, insideModal, postId, onSuccess }: ComposerProps) {
    const { account, wallet } = useWallet();
    const { uploadFileToRcp } = useUploadFile();
    const { submitFileToChain } = useSubmitFileToChain();

    const [inputText, setInputText] = useState('');
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStage, setUploadStage] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const dispatch = useDispatch();
    const router = useRouter();
    const pathname = usePathname();
    const currentUser = useSelector((state: RootState) => state.user);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            setMediaFile(file);
            // Create a URL for local preview
            setMediaPreviewUrl(URL.createObjectURL(file));
        } else {
            setMediaFile(null);
            setMediaPreviewUrl(null);
        }
        // Optional: reset the file input value after selection if needed for re-uploading same file
        // e.target.value = ""; 
    };

    const handleIconClick = () => {
        // Programmatically click the hidden file input
        fileInputRef.current?.click();
    };

    const handleRemoveMedia = () => {
        setMediaFile(null);
        setMediaPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // Clear the file input
        }
    };

    const sendPost = async () => {
        // Validation: Require at least inputText OR Media
        if (!inputText.trim() && !mediaFile) {
            toast.error("Please enter some text or upload an image/video!", {
                style: {
                    background: '#F4AF01',
                    color: '#fff',
                    borderRadius: '8px',
                },
                duration: 3000,
            });
            return;
        }

        // Validation: Connected Wallet
        if (!account || !wallet) {
            toast.error("Please connect your wallet to continue!", {
                style: {
                    background: '#EF4444',
                    color: '#fff',
                    borderRadius: '8px',
                },
                duration: 4000,
            });
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);
        setUploadStage('Preparing...');

        try {
            let fileId = null;
            let fileUrl = null;
            let fileType = 'text'; // Default to text

            // --- MEDIA CASE: Run Shelby Blockchain Workflow ---
            if (mediaFile) {
                fileType = mediaFile.type.startsWith('image/') ? 'image' : 'video';
                const timestamp = Date.now();
                const uniqueBlobName = `${timestamp}-${mediaFile.name}`;

                setUploadStage('Preparing media...');
                setUploadProgress(10);
                const commitments = await encodeFile(mediaFile);

                setUploadStage('Securing on-chain...');
                setUploadProgress(30);
                await submitFileToChain(commitments, mediaFile, uniqueBlobName);

                setUploadStage('Syncing to Shelby...');
                setUploadProgress(60);
                await uploadFileToRcp(mediaFile, uniqueBlobName);

                const shelbyApiUrl = process.env.NEXT_PUBLIC_SHELBY_API_URL || 'https://api.shelbynet.shelby.xyz';
                fileUrl = `${shelbyApiUrl}/shelby/v1/blobs/${account.address.toString()}/${encodeURIComponent(uniqueBlobName)}`;
                fileId = `${account.address.toString()}/${uniqueBlobName}`;
            }

            // --- SAVE METADATA (Common for both cases) ---
            setUploadStage('Finalizing post...');
            setUploadProgress(90);

            const formData = new FormData();
            if (fileId) formData.append('shelbyFileId', fileId);
            if (fileUrl) formData.append('shelbyFileUrl', fileUrl);
            formData.append('fileType', fileType);
            if (inputText) formData.append('caption', inputText);

            const saveResponse = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!saveResponse.ok) throw new Error('Failed to save post');

            // --- SUCCESS HANDLING ---
            setUploadProgress(100);
            setUploadStage('Success!');

            // Reset Composer state
            if (mediaPreviewUrl) URL.revokeObjectURL(mediaPreviewUrl);
            setMediaFile(null);
            setMediaPreviewUrl(null);
            setInputText('');
            if (fileInputRef.current) fileInputRef.current.value = '';

            // Instant UI update: Add new post to the top of the feed
            const responseJson = await saveResponse.json();
            let newPost = responseJson.post;
            if (newPost) {
                if (!newPost.user && currentUser.username) {
                    newPost = {
                        ...newPost,
                        user: {
                            username: currentUser.username,
                            display_name: currentUser.display_name,
                            avatar_url: currentUser.avatar_url || "/assets/avatar.jpg"
                        }
                    };
                }
                dispatch(addPostToFeed(newPost));
            }

            toast.success("Post sent successfully!", {
                style: { background: '#F4AF01', color: '#fff' }
            });

            dispatch(closePostModal());
            if (pathname.includes("/post/")) {
                router.push("/");
            }

        } catch (error) {
            console.error('Post error:', error);
            toast.error("Something went wrong, please try again!", {
                style: {
                    background: '#EF4444',
                    color: '#fff',
                    borderRadius: '8px',
                },
                duration: 4000,
            });
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
            setUploadStage('');
        }
    };

    const sendComment = async (e: React.FormEvent) => {
        e.preventDefault();
        // if (!inputText.trim() || submittingComment) return;
        if (!inputText.trim()) return;

        // Validation: Connected Wallet
        if (!account || !wallet) {
            toast.error("Please connect your wallet to continue!", {
                style: {
                    background: '#EF4444',
                    color: '#fff',
                    borderRadius: '8px',
                },
                duration: 4000,
            });
            return;
        }

        // setSubmittingComment(true);
        try {
            const response = await fetch(`/api/posts/${postId}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content: inputText }),
            });

            // Inside sendPost function
            if (response.ok) {
                const responseData = await response.json();
                setInputText("");
                // Callback to update UI immediately
                if (onSuccess) {
                    onSuccess(responseData);
                } else if (postId) {
                    dispatch(incrementCommentCount({ postId }));
                }
                dispatch(closeCommentModal());
                toast.success("Comment sent successfully!", {
                    style: { background: '#F4AF01', color: '#fff' }
                });
            }
        } catch (error) {
            console.error("Error submitting comment:", error);
        } finally {
            // setSubmittingComment(false);
        }
    };

    return (
        <div className={`flex space-x-5 p-3 ${insideModal ? 'border-none' : 'border-b border-gray-100'}`}>
            <div>
                <Image
                    src={"/assets/avatar.jpg"}
                    width={44} height={44}
                    alt="profile input"
                    className="w-11 h-11 rounded-full z-10 bg-white" />
            </div>

            <div className="w-full">
                {/* Hidden file input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                />
                <textarea
                    className="resize-none outline-none w-full min-h-[50px] text-lg"
                    placeholder={type === 'post' ? "What's happening?" : "Post your reply"}
                    onChange={(e) => setInputText(e.target.value)}
                    value={inputText}
                />

                {/* Media Preview Area */}
                {mediaPreviewUrl && (
                    <div className="relative mt-3 mb-2">
                        <div
                            onClick={handleRemoveMedia}
                            className="absolute top-2 left-2 z-10 cursor-pointer bg-gray-900/75 hover:bg-gray-800/90 p-1.5 rounded-full transition-colors"
                        >
                            <XMarkIcon className="w-5 h-5 text-white" strokeWidth={2.5} />
                        </div>

                        <div className="rounded-2xl overflow-hidden border border-gray-200">
                            {mediaFile?.type.startsWith('image/') ? (
                                <img
                                    src={mediaPreviewUrl}
                                    alt="Preview"
                                    className="w-full h-auto object-cover max-h-[400px]"
                                />
                            ) : (
                                <video
                                    src={mediaPreviewUrl}
                                    controls
                                    className="w-full h-auto max-h-[400px]"
                                />
                            )}
                        </div>
                    </div>
                )}

                <div className="flex justify-between pt-5 border-t border-gray-100 pb-3">
                    {type === 'post' && (
                        <div className="flex space-x-1.5">
                            <PhotoIcon className="w-[22px] h-[22px] text-[#F4AF01]" onClick={handleIconClick} />
                            <ChartBarIcon className="w-[22px] h-[22px] text-[#F4AF01]" />
                            <FaceSmileIcon className="w-[22px] h-[22px] text-[#F4AF01]" />
                            <CalendarIcon className="w-[22px] h-[22px] text-[#F4AF01]" />
                            <MapPinIcon className="w-[22px] h-[22px] text-[#F4AF01]" />
                        </div>
                    )}

                    <button
                        onClick={(event) => (type === 'post') ? sendPost() : sendComment(event)}
                        disabled={isUploading || !inputText}
                        className=" bg-[#F4AF01] text-white w-[80px] h-[36px] 
                        rounded-full text-sm disabled:opacity-60 transition-all font-medium tracking-wide"
                    >
                        {type === 'post' ? 'POST' : 'Reply'}
                    </button>
                </div>

                {/* Upload Progress Area */}
                {isUploading && (
                    <div className="mt-4 p-3 bg-slate-50/50 rounded-xl border border-slate-100 animate-in fade-in duration-300">
                        <div className="flex justify-between mb-2">
                            {/* Status text: Small, Gray, and Pulsing for better UX */}
                            <span className="text-[11px] uppercase tracking-wider font-bold text-slate-500 animate-pulse">
                                {uploadStage || "Processing..."}
                            </span>
                            <span className="text-[11px] font-black text-brand">
                                {uploadProgress}%
                            </span>
                        </div>

                        {/* Progress Track */}
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div
                                className="bg-[#F4AF01] h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(244,175,1,0.4)]"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                    </div>
                )}

            </div>
        </div >
    )
}
