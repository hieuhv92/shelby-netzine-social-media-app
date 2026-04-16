"use client";

import { useState } from "react";
import SearchBox from "@/components/ui/SearchBox";
import TrendingList from "@/components/feed/TrendingList";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";

export default function ExplorePage() {
    const tabs = ["For you", "Trending", "News", "Sports", "Entertainment"];
    const [activeTab, setActiveTab] = useState("For you");

    return (
        <main className="flex-grow border-l border-r border-gray-100 max-w-2xl min-h-screen">
            {/* 1. Header with Search and Settings */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-md z-20">
                <div className="flex items-center px-4 py-2 space-x-4">
                    <div className="flex-1">
                        <SearchBox />
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <Cog6ToothIcon className="w-6 h-6 text-gray-700" />
                    </button>
                </div>

                {/* 2. Navigation Tabs */}
                <div className="flex border-b border-gray-100 overflow-x-auto no-scrollbar bg-white">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`
                                flex-1 
                                min-w-fit 
                                px-4
                                py-4 
                                text-sm
                                font-medium 
                                hover:bg-gray-100 
                                transition-all 
                                relative 
                                text-center 
                                whitespace-nowrap /* Prevent text wrapping */
                                ${activeTab === tab ? "text-black font-bold" : "text-gray-500"}
                            `}
                        >
                            <span className="text-[14px]">
                                {tab}
                            </span>

                            {/* Active Indicator Line */}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 right-0 h-[4px] bg-[#F4AF01] rounded-full mx-auto w-10" />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* 3. Tab Content */}
            <div className="flex flex-col">
                {activeTab === "For you" && (
                    <>
                        {/* Hero Section - Featured content for you */}
                        <div className="relative h-64 w-full bg-gray-200 overflow-hidden cursor-pointer group">
                            <img
                                src="/assets/banner_default.jpg"
                                alt="Featured"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute bottom-0 left-0 p-4 text-white bg-gradient-to-t from-black/60 to-transparent w-full">
                                <p className="text-sm font-medium">Global Events • LIVE</p>
                                <h2 className="text-2xl font-bold">What's happening around the world</h2>
                            </div>
                        </div>
                        <div className="mt-2">
                            <TrendingList limit={10} />
                        </div>
                    </>
                )}

                {activeTab === "Trending" && (
                    <div className="flex flex-col">
                        <h2 className="text-xl font-bold p-4 border-b border-gray-100">United States Trends</h2>
                        <TrendingList /> {/* Shows full list */}
                    </div>
                )}

                {/* Placeholder for other categories */}
                {["News", "Sports", "Entertainment"].includes(activeTab) && (
                    <div className="flex flex-col items-center justify-center p-20 text-gray-500">
                        <p className="text-lg font-medium">No {activeTab} content right now</p>
                        <p className="text-sm">Check back later to see what's happening!</p>
                    </div>
                )}
            </div>
        </main>
    );
}