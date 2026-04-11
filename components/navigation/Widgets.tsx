"use client";

import { EllipsisHorizontalCircleIcon, EllipsisHorizontalIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Trend {
    name: string;
    url: string;
    tweet_volume: number | null;
}

export default function Widgets() {
    const [trends, setTrends] = useState<Trend[]>([]);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch("/api/trending")
            .then((res) => {
                if (!res.ok) throw new Error(res.status.toString());
                return res.json();
            })
            .then((data) => {
                if (Array.isArray(data)) {
                    const filteredTrends = data.filter((t: any) => t.name);
                    setTrends(filteredTrends.slice(0, 5));
                }
            })
            .catch((err) => {
                console.error("Trending fetch error:", err);
                setIsError(true);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    return (
        <div className="p-3 hidden lg:flex flex-col space-y-4 w-[400px] pl-10 sticky top-0 max-h-screen overflow-y-auto no-scrollbar pb-10">

            {/* 1. Search input */}
            <div className="sticky top-0 bg-white py-2 z-20">
                <div className="flex bg-[#EFF3F4] text-[#89959D] h-[44px] items-center space-x-3 rounded-full pl-5 border border-transparent focus-within:border-[#F4AF01] focus-within:bg-white transition-all">
                    <MagnifyingGlassIcon className="w-[20px] h-[20px]" />
                    <input
                        type="text"
                        placeholder="Search"
                        className="bg-transparent outline-none text-black w-full"
                    />
                </div>
            </div>

            {/* 2. What's Happening? */}
            <div className="bg-[#F7F9F9] rounded-2xl p-3">
                <h1 className="text-xl font-bold mb-2 px-1">What's Happening?</h1>

                {isError ? (
                    // Fallback UI when an error occurs
                    <p className="text-sm text-gray-500 p-2 text-center">
                        Currently unavailable. Please try again later.
                    </p>
                ) : isLoading ? (
                    // Skeleton state during initial load
                    <div className="animate-pulse space-y-6 p-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="space-y-2">
                                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                            </div>
                        ))}
                    </div>
                ) : trends.length === 0 ? (
                    // Displayed when fetch is successful but returns no results
                    <p className="text-sm text-gray-500 p-2 text-center">No trends found.</p>
                ) : (
                    // Mapping through trends to display information
                    trends.map((trend: any, index: number) => (
                        <a
                            key={index}
                            href={trend.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex flex-col py-3 px-1 hover:bg-[#eff1f1] transition-all cursor-pointer group"
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

            {/* 3. Who to Follow */}
            <div className="bg-[#F7F9F9] rounded-2xl p-3">
                <h1 className="text-xl font-bold mb-2">Who to Follow</h1>

                {/* Profile to follow 1 */}
                <div className="flex justify-between items-center py-3">
                    <div className="flex item-center space-x-3">
                        <Image
                            src="/assets/avatar_12.jpg"
                            width={56} height={56}
                            alt="profile picture"
                            className="w-14 h-14 rounded-full"
                        />
                        <div className="flex flex-col text-sm">
                            <span className="font-bold">Alexis Wan</span>
                            <span>@alexis_wan00102</span>
                        </div>
                    </div>

                    <button className="bg-[#0F1419] text-white w-[72px] h-[40px] rounded-full text-sm">
                        Follow
                    </button>
                </div>

                {/* Profile to follow 2 */}
                <div className="flex justify-between items-center py-3">
                    <div className="flex item-center space-x-3">
                        <Image
                            src="/assets/avatar_13.jpg"
                            width={56} height={56}
                            alt="profile picture"
                            className="w-14 h-14 rounded-full"
                        />
                        <div className="flex flex-col text-sm">
                            <span className="font-bold">Lily Rose</span>
                            <span>@lilyrose1012</span>
                        </div>
                    </div>

                    <button className="bg-[#0F1419] text-white w-[72px] h-[40px] rounded-full text-sm">
                        Follow
                    </button>
                </div>

                {/* Profile to follow 3 */}
                <div className="flex justify-between items-center py-3">
                    <div className="flex item-center space-x-3">
                        <Image
                            src="/assets/avatar_02.jpg"
                            width={56} height={56}
                            alt="profile picture"
                            className="w-14 h-14 rounded-full"
                        />
                        <div className="flex flex-col text-sm">
                            <span className="font-bold">Edward Brown</span>
                            <span>@edward0809</span>
                        </div>
                    </div>

                    <button className="bg-[#0F1419] text-white w-[72px] h-[40px] rounded-full text-sm">
                        Follow
                    </button>
                </div>
            </div>

            {/* 4. Footer links */}
            <div className="text-[#536471] text-[13px] px-4 space-x-2">
                <span>Terms of Service</span>
                <span>Privacy Policy</span>
                <span>© 2026 Netzine</span>
            </div>
        </div>
    )
}