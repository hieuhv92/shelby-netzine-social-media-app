"use client";

import { NetzinLogo } from "@/components/navigation/Sidebar";
import { ArrowLeftIcon, CalendarDaysIcon, MapPinIcon, LinkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setProfileError, setProfileLoading, setProfilePosts, setProfileUser } from "@/lib/redux/slices/profileSlice";
import { formatJoinDate } from '@/lib/utils';
import { openEditProfileModal } from "@/lib/redux/slices/modalSlice";
import PostCard from "@/components/post/PostCard";


export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState("Posts");
    const tabs = ["Posts", "Replies", "Highlights", "Media", "Likes"];

    const { viewingUser, posts, loading, error } = useSelector((state: any) => state.profile);
    const { userId: myId } = useSelector((state: any) => state.user);

    const params = useParams();
    const profileId = params.id;
    const dispatch = useDispatch();

    const fetchUserAndPosts = async () => {
        try {
            dispatch(setProfileLoading(true));
            dispatch(setProfileError(false));

            const [userRes, postsRes] = await Promise.all([
                fetch(`/api/users/${profileId}`),
                fetch(`/api/posts/user/${profileId}`)
            ]);

            if (!userRes.ok) throw new Error("User not found");

            const data = await userRes.json();
            const postsData = postsRes.ok ? await postsRes.json() : [];

            dispatch(setProfileUser(data));
            dispatch(setProfilePosts(postsData));
        } catch (err) {
            console.error("Fetch Profile Error:", err);
            dispatch(setProfileError(true));
        } finally {
            dispatch(setProfileLoading(false));
        }
    };

    useEffect(() => {
        // Reset data when starting to fetch a new profile
        dispatch(setProfileUser(null));
        dispatch(setProfilePosts([]));

        if (profileId) {
            fetchUserAndPosts();
        }

        // Cleanup function when component unmounts or profileId changes
        return () => {
            dispatch(setProfileUser(null));
            dispatch(setProfilePosts([]));
            dispatch(setProfileError(false));
        };
    }, [profileId, dispatch]);

    if (loading) return <ProfileSkeleton />;

    if (error || !viewingUser) {
        return (
            <div className="flex flex-col items-center justify-center p-10">
                <h2 className="text-xl font-bold text-gray-900">User not found</h2>
                <p className="text-gray-500">The account you are looking for doesn't exist.</p>
            </div>
        );
    }

    const isOwner = myId === profileId;

    return (
        <div className="flex flex-col">
            {/* 2. Banner Section */}
            <div className="relative group">
                {/* Banner Section */}
                <div className="h-48 bg-[#F9C84E] w-full relative overflow-hidden flex items-center justify-center">
                    {viewingUser?.user?.banner_url ? (
                        // Display actual user banner if it exists
                        <img
                            src={viewingUser.user.banner_url}
                            alt="profile banner"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        // Fallback to your branded placeholder
                        <>
                            {/* Watermark Logo with low opacity */}
                            <div className="absolute opacity-20 rotate-[20deg] scale-[2.2] translate-x-24">
                                <NetzinLogo className="w-40 h-40 text-white" />
                            </div>

                            {/* Gradient overlay to wash out the bottom part */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/10"></div>
                        </>
                    )}
                </div>

                {/* 3. Avatar Section stays the same */}
                <div className="absolute -bottom-16 left-4">
                    <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-sm overflow-hidden">
                        {viewingUser?.user?.avatar_url ? (
                            <img
                                src={viewingUser.user.avatar_url}
                                alt="Selected content preview"
                                className="w-full h-full object-cover max-h-[450px] transition-opacity duration-300"
                            />
                        ) : (
                            <img
                                src={"/assets/avatar.jpg"}
                                alt="user avatar"
                                className="w-full h-full object-cover"
                            />
                        )}

                    </div>
                </div>
            </div>

            {/* 4. Action Buttons (e.g., Edit Profile) */}
            <div className="flex justify-end p-4 h-20">
                {isOwner ? (
                    <button className="px-4 py-1.5 rounded-full border border-gray-300 font-bold hover:bg-gray-100 transition duration-200 text-[15px] text-gray-900"
                        onClick={() => dispatch(openEditProfileModal())}
                    >
                        Edit profile
                    </button>
                ) : (
                    <button className="px-4 py-1.5 rounded-full bg-black text-white font-bold hover:bg-gray-800 transition duration-200 text-[15px]">
                        Follow
                    </button>
                )}
            </div>

            {/* 5. User Info Details */}
            <div className="px-4 mt-1">
                <div>
                    <h2 className="text-xl font-extrabold leading-tight text-gray-900">
                        {viewingUser?.user?.display_name || viewingUser?.user?.username}
                    </h2>
                    <p className="text-gray-500 text-[15px]">@{viewingUser?.user?.username || 'shelby_dev'}</p>
                </div>

                <p className="mt-3 text-[15px] leading-normal text-gray-900">
                    {viewingUser?.user?.bio}
                </p>

                {/* Meta data: Location, Website, Join Date */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-gray-500 text-[15px]">
                    <div className="flex items-center">
                        <MapPinIcon className="w-4 h-4 mr-1" />
                        <span>{viewingUser?.user?.location}</span>
                    </div>
                    <div className="flex items-center text-blue-500 hover:underline cursor-pointer">
                        <LinkIcon className="w-4 h-4 mr-1" />
                        <span>{viewingUser?.user?.website}</span>
                    </div>
                    <div className="flex items-center">
                        <CalendarDaysIcon className="w-4 h-4 mr-1" />
                        {viewingUser?.user?.created_at ? (<span>{formatJoinDate(viewingUser?.user?.created_at)}</span>) :
                            (<span>Joined Recently</span>)
                        }
                    </div>
                </div>

                {/* Follower Stats */}
                <div className="flex space-x-5 mt-3 text-[15px]">
                    <p className="hover:underline cursor-pointer">
                        <span className="font-bold text-gray-900">{viewingUser?.followingCount || 0}</span> <span className="text-gray-500">Following</span>
                    </p>
                    <p className="hover:underline cursor-pointer">
                        <span className="font-bold text-gray-900">{viewingUser?.followersCount || 0}</span> <span className="text-gray-500">Followers</span>
                    </p>
                </div>
            </div>

            {/* 6. Tabs Navigation (Posts, Replies, etc.) */}
            <div className="flex border-b border-gray-100 mt-4 overflow-x-auto no-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className="flex-1 min-w-[80px] flex justify-center hover:bg-gray-100 transition duration-200 cursor-pointer"
                    >
                        <div className={`py-4 text-[15px] relative ${activeTab === tab ? "text-gray-900 font-bold" : "text-gray-500 font-medium"
                            }`}>
                            {tab}
                            {/* Indicator */}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#F4AF01] rounded-full" />
                            )}
                        </div>
                    </button>
                ))}
            </div>

            {/* 7. Posts List Area */}
            <div className="min-h-[500px]">
                {activeTab === "Posts" && (
                    <>
                        {posts && posts.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {posts.map((post: any) => (
                                    <div key={post.id}>
                                        <PostCard post={post} id={post.id} isProfileView={true} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            // Empty state if no posts found
                            <div className="p-12 text-center max-w-[calc(100%-40px)] mx-auto">
                                <p className="text-3xl font-extrabold text-gray-900 mb-2">
                                    @{viewingUser?.user?.username} hasn't posted
                                </p>
                                <p className="text-gray-500">
                                    When they do, those posts will show up here.
                                </p>
                            </div>
                        )}
                    </>
                )}

                {/* Placeholder for other tabs (Replies, Media, etc.) */}
                {activeTab !== "Posts" && (
                    <div className="p-12 text-center text-gray-500 opacity-60">
                        <p className="text-lg font-bold">Feature coming soon</p>
                        <p className="text-sm">We're working on the {activeTab} section!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

const ProfileSkeleton = () => (
    <div className="w-full animate-pulse">
        {/* Banner Skeleton */}
        <div className="h-48 bg-gray-200 w-full"></div>

        <div className="px-4 relative">
            {/* Avatar Skeleton */}
            <div className="absolute -top-16 left-4 w-32 h-32 rounded-full border-4 border-white bg-gray-300"></div>

            {/* Button Skeleton */}
            <div className="flex justify-end pt-3">
                <div className="h-9 w-24 bg-gray-200 rounded-full"></div>
            </div>

            {/* Info Skeleton */}
            <div className="mt-8 space-y-3">
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="flex gap-4 mt-4">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
            </div>
        </div>

        {/* Posts Skeleton */}
        <div className="mt-10 border-t border-gray-100 p-4 space-y-4">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </div>
                </div>
            ))}
        </div>
    </div>
);
