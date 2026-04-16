"use client";

import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

interface Trend {
    name: string;
    url: string;
    tweet_volume: number | null;
}

export default function TrendingList({ limit }: { limit?: number }) {
    const [trends, setTrends] = useState<Trend[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchTrends = async () => {
            try {
                const res = await fetch("/api/trending");
                if (!res.ok) throw new Error("Fetch failed");
                const data = await res.json();

                if (Array.isArray(data)) {
                    const filteredData = data.filter((t: any) => t.name);
                    setTrends(limit ? filteredData.slice(0, limit) : filteredData);
                }
            } catch (err) {
                console.error("Trending fetch error:", err);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTrends();
    }, [limit]);

    if (isError) return <p className="text-sm text-gray-500 p-4 text-center">Trending unavailable.</p>;

    if (isLoading) {
        return (
            <div className="animate-pulse flex flex-col">
                {[...Array(limit || 5)].map((_, i) => (
                    <div key={i} className="py-3 px-4 space-y-2">
                        {/* Top row skeleton (label and icon) */}
                        <div className="flex justify-between">
                            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                            <div className="h-3 bg-gray-200 rounded-full w-4"></div>
                        </div>
                        {/* Trend name skeleton */}
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        {/* Post count skeleton */}
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="flex flex-col">
            {trends.length === 0 ? (
                <p className="text-sm text-gray-500 p-4 text-center">No trends found.</p>
            ) : (
                trends.map((trend, index) => (
                    <a
                        key={index}
                        href={trend.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-col py-3 px-4 hover:bg-[#eff1f1] transition-all cursor-pointer group"
                    >
                        <div className="flex justify-between text-[#536471] text-[13px]">
                            <span>Trending in the United States</span>
                            <EllipsisHorizontalIcon className="w-[18px] group-hover:text-[#F4AF01]" />
                        </div>
                        <span className="font-bold text-[15px]">{trend.name}</span>
                        <span className="text-[#536471] text-xs">
                            {trend.tweet_volume
                                ? `${(trend.tweet_volume >= 1000 ? (trend.tweet_volume / 1000).toFixed(1) + 'K' : trend.tweet_volume)} posts`
                                : "Trending now"}
                        </span>
                    </a>
                ))
            )}
        </div>
    );
}
