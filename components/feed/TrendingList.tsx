"use client";

import { useState, useEffect, useMemo } from "react";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";

// Category keywords for filtering
const CATEGORY_KEYWORDS: Record<string, string[]> = {
    news: ["news", "politics", "world", "breaking", "election", "government", "war", "economy"],
    sports: ["football", "soccer", "nba", "match", "cup", "vs", "player", "coach", "league", "final"],
    entertainment: ["music", "movie", "celebrity", "artist", "album", "trailer", "concert", "cinema", "show"],
};

interface Trend {
    name: string;
    url: string;
    tweet_volume: number | null;
}

interface TrendingListProps {
    limit?: number;
    category?: string; // Optional: news, sports, entertainment
}

export default function TrendingList({ limit, category }: TrendingListProps) {
    const [allTrends, setAllTrends] = useState<Trend[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchTrends = async () => {
            try {
                // Fetching from your existing API route
                const res = await fetch("/api/trending");
                if (!res.ok) throw new Error("Fetch failed");
                const data = await res.json();

                if (Array.isArray(data)) {
                    // Only keep trends that have a name
                    const validData = data.filter((t: any) => t.name);
                    setAllTrends(validData);
                }
            } catch (err) {
                console.error("Trending fetch error:", err);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTrends();
    }, []);

    // Filter logic based on the active tab (category)
    const filteredTrends = useMemo(() => {
        let result = [...allTrends];

        if (category && CATEGORY_KEYWORDS[category.toLowerCase()]) {
            const keywords = CATEGORY_KEYWORDS[category.toLowerCase()];
            const match = allTrends.filter((trend) =>
                keywords.some((kw) => trend.name.toLowerCase().includes(kw))
            );

            // If no match found, fallback to generic trends to keep UI populated
            result = match.length > 0 ? match : allTrends.slice(0, 10);
        }

        return limit ? result.slice(0, limit) : result;
    }, [allTrends, category, limit]);

    if (isError) return <p className="text-sm text-gray-500 p-4 text-center">Trending unavailable.</p>;

    if (isLoading) {
        return (
            <div className="animate-pulse flex flex-col">
                {[...Array(limit || 5)].map((_, i) => (
                    <div key={i} className="py-3 px-4 space-y-2">
                        <div className="flex justify-between">
                            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                            <div className="h-3 bg-gray-200 rounded-full w-4"></div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full">
            {filteredTrends.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-10 text-gray-500">
                    <p className="text-sm font-medium">No trends available for this category.</p>
                </div>
            ) : (
                filteredTrends.map((trend, index) => (
                    <a
                        key={`${trend.name}-${index}`}
                        href={trend.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col py-3 px-4 hover:bg-gray-100 transition-colors cursor-pointer group"
                    >
                        <div className="flex justify-between text-[#536471] text-[13px]">
                            <span>
                                {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} · Trending` : "Trending in US"}
                            </span>
                            <EllipsisHorizontalIcon className="w-[18px] group-hover:text-[#F4AF01]" />
                        </div>
                        <span className="font-bold text-[15px] mt-0.5">{trend.name}</span>
                        <span className="text-[#536471] text-xs mt-1">
                            {trend.tweet_volume
                                ? `${trend.tweet_volume >= 1000
                                    ? (trend.tweet_volume / 1000).toFixed(1) + 'K'
                                    : trend.tweet_volume} posts`
                                : ""}
                        </span>
                    </a>
                ))
            )}
        </div>
    );
}
