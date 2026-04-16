"use client";

import SidebarUserInfo from "./SidebarUserInfo";
import { useEffect, useRef, useState } from "react";
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import Link from 'next/link';
import { openPostModal } from "@/lib/redux/slices/modalSlice";
import { useDispatch, useSelector } from "react-redux";

import {
    HomeIcon,
    BellIcon,
    EllipsisHorizontalCircleIcon,
    SparklesIcon,
    Cog6ToothIcon,
    PaintBrushIcon,
    QuestionMarkCircleIcon,
    CurrencyDollarIcon,
    PlusIcon,
    UserIcon,
    MagnifyingGlassIcon
}
    from "@heroicons/react/24/outline";
import { RootState } from "@/lib/redux/store";

export default function Sidebar() {
    const [showMore, setShowMore] = useState(false);
    const moreMenuRef = useRef<HTMLDivElement>(null);
    const { account } = useWallet();
    const dispatch = useDispatch();
    const { userId, address, isAuthenticated, username } = useSelector((state: RootState) => state.user);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
                setShowMore(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Function to handle Minting
    const handleMintClick = () => {
        if (!account) return;
        window.open(
            `https://docs.shelby.xyz/apis/faucet/shelbyusd?address=${account.address}`,
            '_blank',
            'noopener,noreferrer'
        );
    };

    return (
        <nav className="h-screen flex flex-col fixed top-0 p-3 xl:ml-24 w-max z-50">
            <div className="relative h-full flex flex-col">
                <div className="py-2 flex justify-center xl:justify-start">
                    <Link href="/">
                        <div className="w-14 h-14 rounded-full hover:bg-gray-200 hover:bg-opacity-30 transition duration-200 ease-out 
                        cursor-pointer group flex items-center justify-center">
                            <NetzinLogo className="w-9 h-9 xl:w-9 xl:h-9 group-hover:scale-110 transition-transform duration-200" />
                        </div>
                    </Link>
                </div>

                <ul className="flex-grow relative">
                    <Link href="/" className="block w-fit">
                        <SidebarLink text="Home" Icon={HomeIcon} />
                    </Link>
                    <Link href={"/explore"} className="block w-fit cursor-default">
                        <SidebarLink
                            text="Explore"
                            Icon={MagnifyingGlassIcon}
                            disabled={false}
                        // active={false}
                        />
                    </Link>
                    <Link href="#" className="block w-fit cursor-default">
                        <SidebarLink
                            text="Notifications"
                            Icon={BellIcon}
                            disabled={true}
                        // active={false}
                        />
                    </Link>

                    {/* Profile Link */}
                    {!isAuthenticated ? (
                        <div
                            className="opacity-50 cursor-not-allowed w-fit"
                            onClick={() => alert("Please connect your wallet!")}
                        >
                            <SidebarLink text="Profile" Icon={UserIcon} />
                        </div>
                    ) : (
                        <Link href={`/profile/${username}`} className="block w-fit">
                            <SidebarLink text="Profile" Icon={UserIcon} />
                        </Link>
                    )}

                    {/* More Link with Click Action */}
                    <div className="relative" ref={moreMenuRef}>
                        {/* <div onClick={() => setShowMore(!showMore)} className="cursor-pointer"> */}
                        <div>
                            <SidebarLink
                                text="More"
                                Icon={EllipsisHorizontalCircleIcon}
                                disabled={true}
                            />
                        </div>

                        {/* Tooltip / Dropdown Menu */}
                        {showMore && (
                            <div className="absolute bottom-full left-0 mb-3 w-56 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
                                <div className="flex flex-col py-2">
                                    <Link href="#" onClick={() => setShowMore(false)}>
                                        <div className="px-4 py-3 flex items-center space-x-3 hover:bg-gray-100 transition duration-200 cursor-pointer">
                                            <Cog6ToothIcon className="w-5 h-5 text-gray-700" />
                                            <span className="text-[15px] font-medium text-gray-900">Settings</span>
                                        </div>
                                    </Link>
                                    <Link href="#" onClick={() => setShowMore(false)}>
                                        <div className="px-4 py-3 flex items-center space-x-3 hover:bg-gray-100 transition duration-200 cursor-pointer">
                                            <QuestionMarkCircleIcon className="w-5 h-5 text-gray-700" />
                                            <span className="text-[15px] font-medium text-gray-900">Help Center</span>
                                        </div>
                                    </Link>

                                    <div className="border-t border-gray-100 my-1"></div>

                                    <div className="px-4 py-3 flex items-center space-x-3 hover:bg-gray-100 transition duration-200 cursor-pointer">
                                        <PaintBrushIcon className="w-5 h-5 text-gray-700" />
                                        <span className="text-[15px] font-medium text-gray-900">Display</span>
                                    </div>

                                </div>
                            </div>
                        )}
                    </div>

                    {/* Post Button Container */}
                    <div className="mt-4" onClick={() => dispatch(openPostModal())}>
                        {/* Desktop Button: Show on XL screens, Hide on smaller screens */}
                        <button className="hidden xl:block bg-[#F4AF01] w-[200px] h-[52px] 
        rounded-full text-white font-bold cursor-pointer shadow-md hover:bg-[#d99b01] transition">
                            POST
                        </button>

                        {/* Mobile/Tablet Button */}
                        <button
                            className="xl:hidden bg-[#F4AF01] w-12 h-12 rounded-full flex items-center justify-center 
    text-white cursor-pointer shadow-md hover:bg-[#d99b01] transition mx-auto"
                            onClick={() => dispatch(openPostModal())}
                        >
                            <PlusIcon className="w-6 h-6 stroke-[2.5]" />
                        </button>
                    </div>
                </ul>

                {/* Bottom Section (Fixed Items) */}
                <div className="mt-auto flex flex-col space-y-2">
                    {/* Mint Button - Moved here */}
                    <div
                        onClick={handleMintClick}
                        className={`block w-fit transition ${!account
                            ? 'opacity-40 cursor-not-allowed grayscale'
                            : 'cursor-pointer group'
                            }`}
                    >
                        <SidebarLink
                            text="Mint ShelbyUSD"
                            // Icon={SparklesIcon}
                            Icon={CurrencyDollarIcon}
                            className="text-amber-500 font-bold"
                            active={false}
                        />
                    </div>

                    {/* User Info */}
                    {/* <div className="pt-2">
                        <SidebarUserInfo />
                    </div> */}
                </div>
            </div>
        </nav>
    );
}

interface SidebarLinkProps {
    text: string,
    Icon: React.ForwardRefExoticComponent<any>;
    className?: string;
    active?: boolean;
    disabled?: boolean;
}

function SidebarLink({ text, Icon, className, disabled }: SidebarLinkProps) {
    return (
        <li
            className={`
                relative flex items-center text-xl mb-2 space-x-3 p-2.5 rounded-full transition duration-200 ease-out w-fit group
                ${disabled
                    ? "opacity-40" // Dimmed effect + restricted cursor
                    : "hover:bg-gray-200 hover:bg-opacity-30 cursor-pointer"
                }
                ${className || ""}
            `}
            // Native browser tooltip
            title={disabled ? "Coming Soon" : ""}
        >
            <Icon className="h-7" />
            <span className="hidden xl:block">{text}</span>

            {/* Custom Tailwind Tooltip */}
            {disabled && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50 shadow-md">
                    Coming Soon
                </div>
            )}
        </li>
    )
}

const OriginalLogo = (props: { className?: string }) => {
    return (
        <svg
            className={props.className}
            xmlns="http://w3.org"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v3M12 19v3M22 12h-3M5 12H2" />
            <path d="M18.36 5.64l-2.12 2.12M7.76 16.24l-2.12 2.12" />
        </svg>
    );
};

export const NetzinLogo = (props: { className?: string }) => {
    return (
        <svg
            className={props.className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M6 20V4l12 16V4" />
            <path d="M14 4h4" />
            <path d="M6 20h4" />
        </svg>
    );
};
