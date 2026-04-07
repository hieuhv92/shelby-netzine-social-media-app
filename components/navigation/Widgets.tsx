import { EllipsisHorizontalCircleIcon, EllipsisHorizontalIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

export default function Widgets() {
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
                <h1 className="text-xl font-bold mb-2">What's Happening?</h1>
                {/* The War3 */}
                <div className="flex flex-col py-3  space-y-0.5">
                    <div className="flex justify-between text-[#536471] text-[13px]">
                        <span>Trending in Global</span>
                        <EllipsisHorizontalIcon className="w-[20px]" />
                    </div>
                    <span className="font-bold text-sm">#TheWorldCup2026</span>
                    <span className="text-[#536471] text-xs">30k posts</span>
                </div>

                {/* ReactJS Trending */}
                <div className="flex flex-col py-3  space-y-0.5">
                    <div className="flex justify-between text-[#536471] text-[13px]">
                        <span>Trending in Global</span>
                        <EllipsisHorizontalIcon className="w-[20px]" />
                    </div>
                    <span className="font-bold text-sm">#ReactJS</span>
                    <span className="text-[#536471] text-xs">20k post</span>
                </div>

                {/* Donal Trump Trending */}
                <div className="flex flex-col py-3  space-y-0.5">
                    <div className="flex justify-between text-[#536471] text-[13px]">
                        <span>Trending in US</span>
                        <EllipsisHorizontalIcon className="w-[20px]" />
                    </div>
                    <span className="font-bold text-sm">#DonalTrump</span>
                    <span className="text-[#536471] text-xs">10k posts</span>
                </div>
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