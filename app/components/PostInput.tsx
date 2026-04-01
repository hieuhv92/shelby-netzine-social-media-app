"use client";

import { CalendarIcon, ChartBarIcon, FaceSmileIcon, MapPinIcon, PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { encodeFile } from '@/utils/encodeFile';
import { useSubmitFileToChain } from '@/hooks/useSubmitFileToChain';
import { useUploadFile } from '@/hooks/useUploadFile';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { closeCommentModal } from "../redux/slices/modalSlice";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface PostInputProps {
    insideModal?: boolean,
    postId?: string,
    onSuccess?: (newPost: any) => void;
}

export default function PostInput({ insideModal, postId, onSuccess }: PostInputProps) {
    const { account, wallet } = useWallet();
    const { uploadFileToRcp } = useUploadFile();
    const { submitFileToChain } = useSubmitFileToChain();

    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStage, setUploadStage] = useState<string>('');
    const [caption, setCaption] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const commentDetails = useSelector((state: RootState) => state.modals.commentPostDetails);
    const [newComment, setNewComment] = useState("");
    const dispatch = useDispatch();
    const router = useRouter();

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
        // Validation: Require at least Caption OR Media, and a connected Wallet
        if ((!caption.trim() && !mediaFile) || !account || !wallet) {
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

                setUploadStage('Encoding file...');
                setUploadProgress(10);
                const commitments = await encodeFile(mediaFile);

                setUploadStage('Submitting transaction to chain...');
                setUploadProgress(30);
                await submitFileToChain(commitments, mediaFile, uniqueBlobName);

                setUploadStage('Uploading to Shelby RPC...');
                setUploadProgress(60);
                await uploadFileToRcp(mediaFile, uniqueBlobName);

                const shelbyApiUrl = process.env.NEXT_PUBLIC_SHELBY_API_URL || 'https://api.shelbynet.shelby.xyz';
                fileUrl = `${shelbyApiUrl}/shelby/v1/blobs/${account.address.toString()}/${encodeURIComponent(uniqueBlobName)}`;
                fileId = `${account.address.toString()}/${uniqueBlobName}`;
            }

            // --- SAVE METADATA (Common for both cases) ---
            setUploadStage('Saving post...');
            setUploadProgress(90);

            const formData = new FormData();
            if (fileId) formData.append('shelbyFileId', fileId);
            if (fileUrl) formData.append('shelbyFileUrl', fileUrl);
            formData.append('fileType', fileType);
            if (caption) formData.append('caption', caption);

            const saveResponse = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!saveResponse.ok) throw new Error('Failed to save post');

            // --- SUCCESS HANDLING ---
            setUploadProgress(100);
            setUploadStage('Success!');

            // UI Reset
            if (mediaPreviewUrl) URL.revokeObjectURL(mediaPreviewUrl);
            setMediaFile(null);
            setMediaPreviewUrl(null);
            setCaption('');
            if (fileInputRef.current) fileInputRef.current.value = '';

            // Navigation & Data Refresh
            if (insideModal) {
                dispatch(closeCommentModal());
            } else {
                router.push("/"); // Redirect to Home
                router.refresh(); // Refresh Server Components data
            }

            toast.success("Post sent successfully!", {
                style: { background: '#F4AF01', color: '#fff' }
            });

            // Callback to update UI immediately
            if (onSuccess) {
                const data = await saveResponse.json();
                onSuccess(data.post);
            }

        } catch (error) {
            console.error('Post error:', error);
            alert("Something went wrong, please try again!");
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
            setUploadStage('');
        }
    };

    const sendComment = async (e: React.FormEvent) => {
        e.preventDefault();
        // if (!newComment.trim() || submittingComment) return;
        if (!newComment.trim()) return;

        // setSubmittingComment(true);
        try {
            const response = await fetch(`/api/posts/${postId}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ content: newComment }),
            });

            if (response.ok) {
                const data = await response.json();
                // setComments((prev) => [...prev, data.comment]);
                setNewComment("");
                toast.success("Comment sent successfully!", {
                    style: { background: '#F4AF01', color: '#fff' }
                });
                dispatch(closeCommentModal());
            }
        } catch (error) {
            console.error("Error submitting comment:", error);
        } finally {
            // setSubmittingComment(false);
        }
    };

    return (
        <div className="flex space-x-5 p-3 border-b border-gray-100">
            <div>
                <Image
                    src={insideModal ? "/assets/avatar.jpg" : "/assets/avatar.jpg"}
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
                    placeholder={insideModal ? "Send your reply" : "What's happening?"}
                    onChange={(event) => insideModal ? setNewComment(event.target.value) : setCaption(event.target.value)}
                    value={insideModal ? newComment : caption}
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
                    {!insideModal && (
                        <div className="flex space-x-1.5">
                            <PhotoIcon className="w-[22px] h-[22px] text-[#F4AF01]" onClick={handleIconClick} />
                            <ChartBarIcon className="w-[22px] h-[22px] text-[#F4AF01]" />
                            <FaceSmileIcon className="w-[22px] h-[22px] text-[#F4AF01]" />
                            <CalendarIcon className="w-[22px] h-[22px] text-[#F4AF01]" />
                            <MapPinIcon className="w-[22px] h-[22px] text-[#F4AF01]" />
                        </div>
                    )}

                    <button
                        onClick={(event) => insideModal ? sendComment(event) : sendPost()}
                        disabled={insideModal ? !newComment : !caption}
                        className=" bg-[#F4AF01] text-white w-[80px] h-[36px] 
                        rounded-full text-sm disabled:opacity-60 transition-all font-medium tracking-wide"
                    >
                        {insideModal ? "Reply" : "POST"}
                    </button>
                </div>

                {/* Upload Progress */}
                {isUploading && (
                    <div className="w-full  bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="px-4 py-3 border-t border-slate-200 bg-slate-50/50">
                            <div className="flex justify-between mb-2 text-xs font-bold text-slate-600">
                                <span>{uploadStage || "Uploading..."}</span>
                                <span className="font-semibold">{uploadProgress}%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                                <div
                                    className="bg-foreground h-1.5 rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                                <div
                                    className="bg-[#F4AF01] h-full rounded-full shadow-sm"
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div >
    )
}
