import { Post, toggleLikePost } from "@/lib/redux/slices/postSlice";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconFilled } from "@heroicons/react/24/solid";
import { useDispatch } from "react-redux";

interface LikeButtonProps {
    post: Post;
    showCount?: boolean; // Optional: display the like count
    iconSize?: string;   // Optional: icon size classes
}

const LikeButton = ({ post, showCount = true, iconSize = "w-[22px] h-[22px]" }: LikeButtonProps) => {
    const dispatch = useDispatch();

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();

        // 1. Determine the HTTP method based on the CURRENT state in Redux
        const method = post.is_liked ? 'DELETE' : 'POST';

        // 2. Optimistic Update: Immediately update UI in Redux
        dispatch(toggleLikePost({ postId: post.id }));

        try {
            const response = await fetch(`/api/posts/${post.id}/like`, {
                method: method, // POST to like, DELETE to unlike
            });

            if (response.status === 401) {
                // Rollback if user is not authenticated
                dispatch(toggleLikePost({ postId: post.id }));
                window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
                return;
            }

            if (!response.ok) {
                throw new Error("API Error");
            }
        } catch (error) {
            // 3. Rollback UI state if network or server error occurs
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
