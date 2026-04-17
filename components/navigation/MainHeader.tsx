"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import clsx from 'clsx';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { XChainWalletSelector } from '@shelby-protocol/ui/components/x-chain-wallet-selector';
import { WalletIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function MainHeader() {
    const pathname = usePathname();
    const router = useRouter();
    const user = useSelector((state: RootState) => state.user);
    const { account } = useWallet();
    const walletSelectorRef = useRef<HTMLDivElement>(null);
    const { viewingUser, posts } = useSelector((state: any) => state.profile);

    /**
     * TRIGGER WALLET SELECTOR:
     * Programmatically clicks the inner button of XChainWalletSelector
     * when the wallet icon is tapped.
     */
    const handleWalletIconClick = () => {
        if (walletSelectorRef.current) {
            const interactiveElement = walletSelectorRef.current.querySelector('button')
                || (walletSelectorRef.current.firstChild as HTMLElement);
            interactiveElement?.click();
        }
    };

    /**
     * DYNAMIC HEADER LEFT CONTENT:
     * Returns a Back button for Post Details, 
     * or a standard Page Title for other routes.
     */
    const renderHeaderLeft = () => {
        const isPostDetail = pathname.startsWith('/post');
        const isProfileDetail = pathname.startsWith('/profile');
        const isExplore = pathname.startsWith('/explore');
        const isSearch = pathname.startsWith('/search');
        const pathParts = pathname.split('/');

        // Logic for Connection pages (Followers/Following)
        const isConnections = pathParts.length === 4 && (pathParts[3] === 'followers' || pathParts[3] === 'following');
        const urlUsername = pathParts[2];
        const rawType = pathParts[3] || "";
        const connectionType = rawType.charAt(0).toUpperCase() + rawType.slice(1);

        // Identify pages that require a Back button
        const needsBackButton = isPostDetail || isProfileDetail || isExplore || isSearch;

        if (needsBackButton) {
            return (
                <div className="flex items-center">
                    {/* Standard Back Button */}
                    <button
                        onClick={() => router.back()}
                        className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-200 transition cursor-pointer mr-6"
                    >
                        <ArrowLeftIcon className="w-5 h-5 text-[#0F1419]" />
                    </button>

                    <div className="flex flex-col">
                        {/* Main Title Logic */}
                        <h2 className="text-xl font-bold text-[#0F1419] leading-tight">
                            {isPostDetail && "Post"}
                            {isExplore && "Explore"}
                            {isSearch && "Search"}
                            {isProfileDetail && (
                                isConnections ? connectionType : (viewingUser?.user?.display_name || "Profile")
                            )}
                        </h2>

                        {/* Subtitle Logic (Only Profile related pages) */}
                        {isProfileDetail && (
                            <p className="text-[13px] text-gray-500 font-normal">
                                {isProfileDetail && (
                                    isConnections
                                        ? `@${urlUsername || ""}`
                                        : `${viewingUser?.posts?.length || 0} Posts`
                                )}
                            </p>
                        )}
                    </div>
                </div>
            );
        }

        // Standard static pages (Home, Notifications, etc.)
        const titles: Record<string, string> = {
            '/': 'Home',
            '/notifications': 'Notifications',
        };

        return (
            <h2 className="text-lg sm:text-xl font-bold text-[#0F1419] truncate leading-tight">
                {titles[pathname] || 'Home'}
            </h2>
        );
    };

    return (
        <div className="py-2 px-3 sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100 flex items-center justify-between w-full transition-all">

            {/* LEFT SECTION: Back Button or Page Title */}
            <div className="flex items-center min-w-0 mr-2">
                {renderHeaderLeft()}
            </div>

            {/* RIGHT SECTION: Wallet Icon and Responsive Selector */}
            <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">

                {/* WALLET ICON TRIGGER */}
                <div
                    className="relative flex-shrink-0 cursor-pointer active:scale-95 transition-transform"
                    onClick={handleWalletIconClick}
                >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 hover:bg-gray-200 transition-colors shadow-sm">
                        <WalletIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#0F1419]" />
                    </div>

                    {/* Online/Connection Status Indicator */}
                    {account && (
                        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white animate-pulse"></span>
                    )}
                </div>

                {/* WALLET ADDRESS & SELECTOR */}
                <div className="flex flex-col items-end">
                    <div
                        ref={walletSelectorRef}
                        /* Increased z-index to ensure the Disconnect menu stays on top of other elements */
                        className="min-w-[120px] sm:min-w-[130px] w-full flex-shrink-0 relative z-50"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {user.loading ? (
                            /* 1. Show Skeleton while checking wallet status or logging in */
                            <div className="h-9 sm:h-9 w-full rounded-md bg-gray-100 animate-pulse border border-gray-100 flex items-center justify-center">
                                <div className="h-1.5 w-16 bg-gray-200 rounded-full" />
                            </div>
                        ) : (
                            /* 2. Render the actual Selector only after auth status is determined */
                            <XChainWalletSelector
                                size="sm"
                                className={clsx(
                                    'brand-gradient shadow-sm flex items-center justify-center overflow-hidden text-[12px] sm:text-xs',
                                    'h-8 sm:h-9 w-full rounded-md px-2 sm:px-4 justify-center xl:justify-start font-medium transition-opacity duration-300'
                                )}
                            />
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
