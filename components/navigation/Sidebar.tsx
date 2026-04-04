"use client";
import {
    HomeIcon,
    HashtagIcon,
    BellIcon,
    InboxIcon,
    BookmarkIcon,
    UserIcon,
    EllipsisHorizontalCircleIcon,
    ArrowUpRightIcon,
    SparklesIcon
}
    from "@heroicons/react/24/outline";
import SidebarUserInfo from "./SidebarUserInfo";
import { useEffect, useRef, useState } from "react";
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import Link from 'next/link';

export default function Sidebar() {
    const [showMore, setShowMore] = useState(false);
    const moreMenuRef = useRef(null);
    const { account } = useWallet()

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

    return (
        <nav className="h-screen flex flex-col fixed top-0 p-3 xl:ml-24 w-max z-50">
            <div className="relative h-full flex flex-col">
                <div className="py-3">
                    <Link href="/">
                        <div className="p-2.5 rounded-full hover:bg-gray-200 hover:bg-opacity-30 transition duration-200 ease-out cursor-pointer group w-fit">
                            <Logo className="w-10 h-10 group-hover:scale-110 transition-transform duration-200" />
                        </div>
                    </Link>
                </div>

                <ul className="flex-grow relative">
                    <Link href="/" className="block w-fit">
                        <SidebarLink text="Home" Icon={HomeIcon} />
                    </Link>
                    <Link href="#" className="block w-fit cursor-default">
                        <SidebarLink
                            text="Explore"
                            Icon={HashtagIcon}
                        // active={false}
                        />
                    </Link>
                    <Link href="#" className="block w-fit cursor-default">
                        <SidebarLink
                            text="Notifications"
                            Icon={BellIcon}
                        // active={false}
                        />
                    </Link>

                    {/* More Link with Click Action */}
                    <div className="relative" ref={moreMenuRef}>
                        <div onClick={() => setShowMore(!showMore)} className="cursor-pointer">
                            <SidebarLink text="More" Icon={EllipsisHorizontalCircleIcon} />
                        </div>

                        {/* Tooltip / Dropdown Menu */}
                        {showMore && (
                            <div className="absolute bottom-full left-0 mb-2 w-56 bg-white shadow-xl border border-gray-100 rounded-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
                                <div className="flex flex-col py-2">
                                    <button
                                        className={`px-4 py-3 text-left transition w-full flex items-center justify-between cursor-pointer ${!account
                                            ? 'opacity-40 cursor-not-allowed text-gray-400'
                                            : 'hover:bg-amber-50 text-[#F4AF01] font-bold bg-amber-50/30'
                                            }`}
                                        disabled={!account}
                                        onClick={() => {
                                            if (!account) return;
                                            window.open(
                                                `https://docs.shelby.xyz/apis/faucet/shelbyusd?address=${account.address}`,
                                                '_blank',
                                                'noopener,noreferrer'
                                            );
                                            setShowMore(false);
                                        }}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <SparklesIcon className="w-4 h-4" />
                                            <span>Mint shelbyUSD</span>
                                        </div>

                                        {account && (
                                            <ArrowUpRightIcon className="w-4 h-4 ml-2 opacity-70" />
                                        )}
                                    </button>
                                    {/* <div className="border-t border-gray-100 my-1"></div> */}
                                </div>
                            </div>
                        )}
                    </div>

                    <button className="hidden xl:block bg-[#F4AF01] w-[200px] h-[52px] 
                    rounded-full text-white font-bold cursor-pointer shadow-md mt-4 hover:bg-[#d99b01] transition">
                        POST
                    </button>
                </ul>

                {/* <div className="mt-auto">
                    <SidebarUserInfo />
                </div> */}
            </div>
        </nav>
    );
}

interface SidebarLinkProps {
    text: string,
    Icon: React.ForwardRefExoticComponent<Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
        title?: string;
        titleId?: string;
    } & React.RefAttributes<SVGSVGElement>>
}

function SidebarLink({ text, Icon }: SidebarLinkProps) {
    return (
        <li className="flex items-center text-xl mb-2 space-x-3 p-2.5">
            <Icon className="h-7" />
            <span className="hidden xl:block">{text}</span>
        </li >
    )
}

const Logo = (props: { className?: string }) => {
    return (
        <svg
            className={props.className}
            xmlns="http://www.w3.org"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
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
