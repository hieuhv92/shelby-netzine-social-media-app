"use client";

import Composer from "@/components/feed/Composer";
import PostCard from "@/components/post/PostCard";
import { useEffect, useState } from 'react';
import { usePost } from "@/contexts/PostProvider";

export default function FeedList() {
    const [error, setError] = useState<string | null>(null);
    const { posts, isLoading, fetchAllPosts } = usePost();

    useEffect(() => {
        // Initial data fetch on mount
        fetchAllPosts();
    }, []);

    return (
        <div className="flex-grow max-w-2xl border-x border-gray-100 min-h-screen">
            {/* Post creation - Internally handles state via Context */}
            <Composer type="post" />

            {/* 1. Priority: Show loading spinner if fetching */}
            {isLoading ? (
                <div className="text-center py-12">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand border-r-transparent"></div>
                    <p className="text-muted mt-4">Loading posts...</p>
                </div>
            ) :
                /* 2. Show posts list if data exists */
                posts.length > 0 ? (
                    posts.map((post) => (
                        <div key={post.id}>
                            <PostCard post={post} id={post.id} />
                        </div>
                    ))
                ) : (
                    /* 3. Show empty state only when loading is finished and no posts found */
                    <div className="text-center py-12">
                        <p className="text-gray-900 text-lg font-bold">No posts yet</p>
                        <p className="text-gray-500 mt-2">Be the first to share something!</p>
                    </div>
                )}
        </div>
    );
}
