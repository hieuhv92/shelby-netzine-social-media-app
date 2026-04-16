import { Post, toggleLikePost } from "@/lib/redux/slices/postSlice";
import { signOutUser } from "@/lib/redux/slices/userSlice";
import { RootState } from "@/lib/redux/store";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconFilled } from "@heroicons/react/24/solid";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

interface LikeButtonProps {
    post: Post;
    showCount?: boolean; // Optional: display the like count
    iconSize?: string;   // Optional: icon size classes
}

const LikeButton = ({ post, showCount = true, iconSize = "w-[22px] h-[22px]" }: LikeButtonProps) => {
    const dispatch = useDispatch();

    // Get authentication state from Redux and wallet connection from hook
    const { isAuthenticated } = useSelector((state: RootState) => state.user);
    const { account } = useWallet();

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();

        // 1. Validation: Block interaction if not authenticated or wallet not connected
        // This maintains consistency with Follow and Composer logic
        if (!isAuthenticated || !account) {
            toast.error("Please connect your wallet to like posts!", {
                style: { background: '#F59E0B', color: '#fff', borderRadius: '8px' },
                duration: 4000,
            });
            return; // Terminate early before performing Optimistic Update
        }

        // 2. Determine HTTP method based on CURRENT Redux state
        const method = post.is_liked ? 'DELETE' : 'POST';

        // 3. Optimistic Update: Immediately update UI in Redux for better UX
        dispatch(toggleLikePost({ postId: post.id }));

        try {
            const response = await fetch(`/api/posts/${post.id}/like`, {
                method: method,
            });

            if (!response.ok) {
                // If session expired (401), trigger sign out to sync state
                if (response.status === 401) {
                    dispatch(signOutUser());
                }
                throw new Error("API Error");
            }
        } catch (error) {
            // 4. Rollback UI state if network or server error occurs
            dispatch(toggleLikePost({ postId: post.id }));
            console.error('Error toggling like:', error);
        }
    };


    return (
        <div className="relative flex items-center">
            {post.is_liked ? (
                <HeartIconFilled
                    className={`${iconSize} cursor-pointer text-[#F4AF01] transition transform active:scale-125`}
                    onClick={handleLike}
                />
            ) : (
                <HeartIcon
                    className={`${iconSize} text-[#707E89] cursor-pointer hover:text-[#F4AF01] transition transform active:scale-125`}
                    onClick={handleLike}
                />
            )}

            {showCount && (
                <span className={`absolute text-xs top-1 -right-3 ${post.is_liked ? 'text-[#F4AF01]' : 'text-[#707E89]'}`}>
                    {post.likes_count || 0}
                </span>
            )}
        </div>
    );
};

export default LikeButton;
