"use client";

import { useState, useEffect } from "react";

interface FollowButtonProps {
    userId: string;
    initialIsFollowing?: boolean;
    onStatusChange?: (newStatus: boolean) => void;
    className?: string;
}

export default function FollowButton({
    userId,
    initialIsFollowing = false,
    onStatusChange,
    className = ""
}: FollowButtonProps) {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [isProcessing, setIsProcessing] = useState(false);

    // Sync state if initialIsFollowing changes (useful for dynamic lists)
    useEffect(() => {
        setIsFollowing(initialIsFollowing);
    }, [initialIsFollowing]);

    const handleFollow = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setIsProcessing(true);
        const previousStatus = isFollowing;

        // Optimistic Update
        setIsFollowing(!previousStatus);
        if (onStatusChange) onStatusChange(!previousStatus);

        try {
            const method = previousStatus ? "DELETE" : "POST";
            const res = await fetch(`/api/users/${userId}/follow`, { method });

            if (!res.ok) throw new Error();
        } catch (err) {
            // Rollback on error
            setIsFollowing(previousStatus);
            if (onStatusChange) onStatusChange(previousStatus);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <button
            disabled={isProcessing}
            onClick={handleFollow}
            className={`group/btn relative font-bold rounded-full text-sm transition-all duration-200 flex justify-center items-center overflow-hidden border
        ${isFollowing
                    ? "bg-white text-black border-gray-300 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                    : "bg-[#0F1419] text-white border-transparent hover:bg-[#272c31]"
                } 
        ${isProcessing ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className} 
      `}
            style={{ width: "105px", height: "34px" }} // Default size
        >
            {isProcessing ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
                <div className="flex justify-center items-center w-full h-full">
                    {isFollowing ? (
                        <div className="relative w-full h-full flex justify-center items-center">
                            <span className="group-hover/btn:hidden">Following</span>
                            <span className="hidden group-hover/btn:inline text-red-600">Unfollow</span>
                        </div>
                    ) : (
                        "Follow"
                    )}
                </div>
            )}
        </button>
    );
}
