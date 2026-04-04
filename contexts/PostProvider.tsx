"use client";
import React, { createContext, useContext, useState } from 'react';
import { Post } from '@/types';

interface PostContextType {
    posts: Post[];
    isLoading: boolean;
    fetchAllPosts: () => Promise<void>;
    refreshOnePost: (postId: string) => Promise<void>;
    addNewPost: (newPost: Post) => void;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

export const PostProvider = ({ children }: { children: React.ReactNode }) => {
    // Set default to true to prevent "No posts" flash on initial load
    const [isLoading, setIsLoading] = useState(true);
    const [posts, setPosts] = useState<Post[]>([]);

    // Fetch all posts from API
    const fetchAllPosts = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/posts');
            const data = await response.json();
            setPosts(data.posts || []);
        } catch (err) {
            console.error("Error fetching posts:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // Refresh a specific post by ID (Used after comments/likes)
    const refreshOnePost = async (postId: string) => {
        try {
            const response = await fetch(`/api/posts/${postId}`);
            const data = await response.json();
            // Backend returns structure { post: { ... } }
            const updatedPost = data.post;

            if (updatedPost) {
                setPosts(prev => prev.map(p => p.id === postId ? updatedPost : p));
            }
        } catch (err) {
            console.error("Error refreshing single post:", err);
        }
    };

    // Prepend a new post to the list for instant UI feedback
    const addNewPost = (newPost: Post) => {
        setPosts(prev => [newPost, ...prev]);
    };

    return (
        <PostContext.Provider value={{ posts, isLoading, fetchAllPosts, refreshOnePost, addNewPost }}>
            {children}
        </PostContext.Provider>
    );
};

export const usePost = () => {
    const context = useContext(PostContext);
    if (!context) throw new Error("usePost must be used within a PostProvider");
    return context;
};
