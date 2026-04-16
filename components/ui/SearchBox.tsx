"use client";

import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useRouter } from "next/navigation";

const SearchBox = () => {
    const [query, setQuery] = useState("");
    const router = useRouter();

    // Handle Search on Enter key
    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && query.trim()) {
            router.push(`/search?q=${encodeURIComponent(query.trim())}`);
        }
    };

    // Clear search input
    const clearInput = () => {
        setQuery("");
    };

    return (
        <div className="group flex bg-[#EFF3F4] text-[#536471] h-[44px] w-full items-center space-x-3 rounded-full px-5 border border-transparent focus-within:border-[#F4AF01] focus-within:bg-white transition-all">
            {/* Search Icon: Changes color when parent is focused */}
            <MagnifyingGlassIcon className="w-[20px] h-[20px] group-focus-within:text-[#F4AF01]" />

            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Search"
                className="bg-transparent outline-none text-black w-full text-[15px] placeholder:text-[#536471]"
            />

            {/* Clear Button: Only visible when there is text */}
            {query && (
                <button
                    onClick={clearInput}
                    className="p-1 bg-[#F4AF01] rounded-full hover:bg-[#d99c01] transition-colors"
                >
                    <XMarkIcon className="w-4 h-4 text-white" />
                </button>
            )}
        </div>
    );
};

export default SearchBox;