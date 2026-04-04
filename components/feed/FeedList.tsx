"use client";

import Composer from "@/components/feed/Composer";
import PostCard from "@/components/post/PostCard";
import { useEffect, useState } from 'react';
import type { Post } from '@/types';

export default function FeedList() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/api/posts');

                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }

                const data = await response.json();
                setPosts(data.posts || [])
            } catch (err) {
                console.error('Error fetching posts:', err);
                setError(err instanceof Error ? err.message : 'Failed to load posts');
            } finally {
                setIsLoading(false);
            }
        }

        fetchPosts();
    }, []);

    const addNewPostToFeed = (newPost) => {
        setPosts((posts) => [newPost, ...posts]);
    };

    if (isLoading) {
        return (
            <div className="text-center py-12">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-brand border-r-transparent"></div>
                <p className="text-muted mt-4">Loading posts...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-red-400 text-lg">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-brand rounded-lg hover:brightness-110"
                >
                    Retry
                </button>
            </div>
        )
    }

    return (
        <div className="flex-grow max-w-2xl border-x border-gray-100 min-h-screen">

            <Composer onSuccess={addNewPostToFeed} />

            {isLoading ? (
                <div className="p-10 text-center animate-pulse">Loading...</div>
            ) :
                (posts && posts.length > 0) ? (
                    posts.map((post) => (
                        <div key={post.id}>
                            <PostCard post={post} id={post.id} />
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-900 text-lg font-bold">No posts yet</p>
                        <p className="text-gray-500 mt-2">Be the first to share something!</p>
                    </div>
                )}
        </div>
    );
}
