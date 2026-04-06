import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// --- INTERFACES ---
export interface Comment {
    id: string;
    post_id: string;
    user_id: string;
    caption: string;
    user: {
        username: string;
        display_name: string;
        avatar_url: string;
    };
    created_at: string;
}

export interface Post {
    id: string;
    caption: string;
    likes_count: number;
    comments_count: number;
    is_liked: boolean;
    user_id: string;
    user?: {
        username: string;
        display_name: string;
        avatar_url: string;
    };
    shelby_file_url?: string;
    comments?: Comment[]; // Fix: Property 'comments' now exists on Post
}

interface PostState {
    posts: Post[];
    isLoading: boolean;
    currentPost: Post | null;
}

// --- INITIAL STATE ---
const initialState: PostState = {
    posts: [],
    isLoading: true,
    currentPost: null,
};

// --- SLICE ---
const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },

        // Populate feed list (Home)
        setPosts: (state, action: PayloadAction<Post[]>) => {
            state.posts = action.payload;
            state.isLoading = false;
        },

        // Set active post for Detail page
        setCurrentPost: (state, action: PayloadAction<Post | null>) => {
            state.currentPost = action.payload;
        },

        // Prepend new post to feed (Optimistic)
        addPostToFeed: (state, action: PayloadAction<Post>) => {
            state.posts = [action.payload, ...state.posts];
        },

        // Unified function to update a post in both Feed and Detail views
        updatePostData: (state, action: PayloadAction<Post>) => {
            const updatedPost = action.payload;
            // Sync in FeedList
            state.posts = state.posts.map(p => p.id === updatedPost.id ? updatedPost : p);
            // Sync in DetailPage if currently viewing the same post
            if (state.currentPost?.id === updatedPost.id) {
                state.currentPost = updatedPost;
            }
        },

        // Increment comment count for UI feedback (Optimistic)
        incrementCommentCount: (state, action: PayloadAction<{ postId: string }>) => {
            const { postId } = action.payload;

            // Sync in Feed
            const postInFeed = state.posts.find(p => p.id === postId);
            if (postInFeed) {
                postInFeed.comments_count = (postInFeed.comments_count || 0) + 1;
            }

            // Sync in Detail
            if (state.currentPost?.id === postId) {
                state.currentPost.comments_count = (state.currentPost.comments_count || 0) + 1;
            }
        },

        // Add new comment to active post and update counts
        addCommentToCurrentPost: (state, action: PayloadAction<Comment>) => {
            const newComment = action.payload;

            // 1. Update Detail page view
            if (state.currentPost && state.currentPost.id === newComment.post_id) {
                if (!state.currentPost.comments) {
                    state.currentPost.comments = [];
                }
                state.currentPost.comments = [newComment, ...state.currentPost.comments];
                state.currentPost.comments_count += 1;
            }

            // 2. Sync comment count in FeedList (Home)
            const postInFeed = state.posts.find(p => p.id === newComment.post_id);
            if (postInFeed) {
                postInFeed.comments_count += 1;
            }
        },
        setCommentsForCurrentPost: (state, action: PayloadAction<Comment[]>) => {
            if (state.currentPost) {
                state.currentPost.comments = action.payload;
            }
        },
        toggleLikePost: (state, action: PayloadAction<{ postId: string }>) => {
            const { postId } = action.payload;

            // 1.Update Feed List
            const postInFeed = state.posts.find(p => p.id === postId);
            if (postInFeed) {
                postInFeed.is_liked = !postInFeed.is_liked;
                postInFeed.likes_count += postInFeed.is_liked ? 1 : -1;
            }

            // 2. Update the current post
            if (state.currentPost?.id === postId) {
                state.currentPost.is_liked = !state.currentPost.is_liked;
                state.currentPost.likes_count += state.currentPost.is_liked ? 1 : -1;
            }
        },
    },
});

export const {
    setPosts,
    setLoading,
    updatePostData,
    addPostToFeed,
    setCurrentPost,
    incrementCommentCount,
    addCommentToCurrentPost,
    setCommentsForCurrentPost,
    toggleLikePost
} = postSlice.actions;

export default postSlice.reducer;
