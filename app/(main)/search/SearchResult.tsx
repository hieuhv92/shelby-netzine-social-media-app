"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import PostCard from "@/components/post/PostCard";
import UserCard from "@/components/users/UserCard";

export default function SearchResult() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const [results, setResults] = useState({ users: [], posts: [] });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getResults = async () => {
            if (!query) return;
            setLoading(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                setResults(data);
            } catch (error) {
                console.error("Search fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        getResults();
    }, [query]);

    return (
        <div className="flex flex-col">
            {/* UI rendering logic for results here (Users, Posts...) */}
            {loading ? <p className="p-10 text-center">Searching...</p> : (
                <>
                    {/* Users Results */}
                    {results?.users.length > 0 && (
                        <div className="border-b border-gray-100 pb-2">
                            <h2 className="text-xl font-bold p-4">People</h2>
                            {results.users.map((user: any) => (
                                <UserCard key={user.id} user={user} />
                            ))}
                        </div>
                    )}

                    {/* Posts Results */}
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold p-4">Posts</h2>
                        {results?.posts.length === 0 ? (
                            <p className="p-4 text-gray-500">No results for "{query}"</p>
                        ) : (
                            results.posts.map((post: any) => (
                                <PostCard post={post} id={post.id} key={post.id} />
                            ))
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
