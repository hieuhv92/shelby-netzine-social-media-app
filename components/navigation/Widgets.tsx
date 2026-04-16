"use client";

import { EllipsisHorizontalCircleIcon, EllipsisHorizontalIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";
import FollowButton from "../ui/FollowButton";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { updateFollowStats } from "@/lib/redux/slices/profileSlice";
import SearchBar from "../ui/SearchBar";
import TrendingList from "../feed/TrendingList";
import { usePathname } from "next/navigation";

interface Trend {
    name: string;
    url: string;
    tweet_volume: number | null;
}

interface User {
    id: string;
    username: string;
    display_name: string;
    avatar_url: string;
    isFollowing?: boolean;
}

export default function Widgets() {
    const [trends, setTrends] = useState<Trend[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const pathname = usePathname();
    const isSearchOrExplore = pathname.startsWith('/explore') || pathname.startsWith('/search');

    const dispatch = useDispatch();
    // Get the current user profile data from Redux to sync follow status
    const viewingUser = useSelector((state: RootState) => state.profile.viewingUser);

    // 1. Initial fetch
    useEffect(() => {
        const fetchWidgetData = async () => {
            try {

                const resUsers = await fetch("/api/users/suggestion");
                if (!resUsers.ok) throw new Error("Fetch failed");
                const usersData = await resUsers.json();
                setUsers(usersData);
            } catch (err) {
                console.error("Widget fetch error:", err);
                setIsError(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchWidgetData();
    }, []);

    // 2. Sync Widget state when Profile state changes (Add this)
    useEffect(() => {
        // Only update if we have a viewingUser in Redux
        if (viewingUser?.user?.id) {
            setUsers(prevUsers =>
                prevUsers.map(u =>
                    u.id === viewingUser.user.id
                        ? { ...u, isFollowing: viewingUser.isFollowing }
                        : u
                )
            );
        }
    }, [viewingUser?.isFollowing, viewingUser?.user?.id]);

    return (
        <div className="p-3 hidden lg:flex flex-col space-y-4 w-[400px] pl-10 sticky top-0 max-h-screen overflow-y-auto no-scrollbar pb-10">
            {/* 1. Search input */}
            {!isSearchOrExplore && <SearchBar />}

            {/* 2. What's Happening? */}
            <div className="bg-[#F7F9F9] rounded-2xl pb-2">
                <h1 className="text-xl font-bold p-4">What's Happening?</h1>
                <TrendingList limit={5} />
            </div>

            {/* 3. Who to Follow */}
            <div className="bg-[#F7F9F9] rounded-2xl p-3">
                <h1 className="text-xl font-bold mb-2 px-1">Who to Follow</h1>

                {isLoading ? (
                    // Loading skeleton
                    <div className="animate-pulse space-y-4 p-2">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center space-x-3">
                                <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                                <div className="flex-1 space-y-2">
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : users.length === 0 ? (
                    <p className="text-sm text-gray-500 p-2 text-center">No suggestions.</p>
                ) : (
                    users.map((user) => (
                        <div key={user.id} className="flex justify-between items-center py-3 px-1 hover:bg-[#eff1f1] transition-all cursor-pointer rounded-xl group">
                            <Link
                                href={`/profile/${user.username}`}
                                className="flex items-center space-x-3 flex-1 min-w-0"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0">
                                        <Image
                                            src={user.avatar_url || "/assets/avatar_default.jpg"}
                                            width={48}
                                            height={48}
                                            alt={user.username}
                                            className="w-12 h-12 rounded-full object-cover border border-gray-100 shadow-sm"
                                        />
                                    </div>
                                    <div className="flex flex-col text-[15px]">
                                        <span className="font-bold hover:underline leading-5">{user.display_name}</span>
                                        <span className="text-[#536471] text-sm">@{user.username}</span>
                                    </div>
                                </div>
                            </Link>

                            <FollowButton
                                userId={user.id}
                                initialIsFollowing={!!user.isFollowing}
                                onStatusChange={(newStatus) => {
                                    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isFollowing: newStatus } : u));
                                    const currentProfileId = viewingUser?.user?.id;
                                    if (currentProfileId === user.id) {
                                        dispatch(updateFollowStats(newStatus));
                                    }
                                }}
                            />
                        </div>
                    ))
                )}
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