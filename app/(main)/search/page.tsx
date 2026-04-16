"use client";

import { Suspense } from "react";
import SearchBar from "@/components/ui/SearchBar";
import SearchContent from "./SearchContent";

export default function SearchPage() {
    return (
        <main className="flex-grow border-l border-r border-gray-100 max-w-2xl min-h-screen">
            <div className="sticky top-0 bg-white/80 backdrop-blur-md z-10 px-4 py-2 border-b border-gray-100">
                <SearchBar />
            </div>

            <Suspense fallback={<div className="p-10 text-center">Loading search...</div>}>
                <SearchContent />
            </Suspense>
        </main>
    );
}
