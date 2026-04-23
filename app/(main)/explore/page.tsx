"use client";

import { useState } from "react";
import SearchBox from "@/components/ui/SearchBox";
import TrendingList from "@/components/feed/TrendingList";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";

// Mapping keywords for each tab to get relevant images
const TAB_BANNER_URLS: Record<string, string> = {
    "For you": "/assets/explore_default.jpg",
    "Trending": "/assets/explore_default.jpg",
    "News": "/assets/explore_default.jpg",
    "Sports": "/assets/explore_default.jpg",
    "Entertainment": "/assets/explore_default.jpg"
};

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
                {/* Common Hero Section for most tabs to keep it "xịn" */}
                {activeTab !== "For you" && (
                    <div className="relative h-64 w-full bg-gray-900 overflow-hidden cursor-pointer group">
                        {/* Dynamic Image */}
                        <div className="relative w-full h-full overflow-hidden group">
                            {/* Dynamic Image */}
                            <img
                                key={activeTab}
                                src={TAB_BANNER_URLS[activeTab]}
                                alt={activeTab}
                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                        </div>

                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                        {/* Content Overlay */}
                        <div className="absolute bottom-0 left-0 p-6 text-white w-full">
                            <div className="flex items-center space-x-2 mb-2">
                                <span className="flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>
                                <p className="text-[12px] font-bold uppercase tracking-widest text-gray-200">
                                    {activeTab === "For you" ? "Global Events" : activeTab} • LIVE
                                </p>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-extrabold leading-tight tracking-tight">
                                {activeTab === "For you"
                                    ? "What's happening around the world"
                                    : `Top updates in ${activeTab.toLowerCase()}`}
                            </h2>
                        </div>
                    </div>
                )}

                {/* Tab specific content */}
                <div className={activeTab !== "Trending" ? "mt-2" : ""}>
                    {activeTab === "Trending" ? (
                        <div className="flex flex-col">
                            <h2 className="text-xl font-bold p-4 border-b border-gray-100">Global Trends</h2>
                            <TrendingList />
                        </div>
                    ) : (
                        <TrendingList
                            limit={activeTab === "For you" ? 10 : undefined}
                            category={activeTab === "For you" ? undefined : activeTab.toLowerCase()}
                        />
                    )}
                </div>
            </div>
        </main>
    );
}