"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import clsx from 'clsx';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { XChainWalletSelector } from '@shelby-protocol/ui/components/x-chain-wallet-selector';
import { WalletIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function HeaderInfo() {
    const pathname = usePathname();
    const router = useRouter();
    const user = useSelector((state: RootState) => state.user);
    const { account } = useWallet();
    const walletSelectorRef = useRef<HTMLDivElement>(null);

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

        if (isPostDetail) {
            return (
                <div className="flex items-center">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-200 transition cursor-pointer mr-2"
                    >
                        <ArrowLeftIcon className="w-5 h-5 text-[#0F1419]" />
                    </button>
                    <h2 className="text-xl font-bold text-[#0F1419]">Post</h2>
                </div>
            );
        }

        // Standard Titles Mapping
        const titles: Record<string, string> = {
            '/': 'Home',
            '/notifications': 'Notifications',
            '/profile': 'Profile',
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
                <div className="flex flex-col items-end overflow-hidden">
                    {user.address && (
                        <span className="text-[11px] sm:text-xs font-semibold text-[#0F1419] truncate mb-1 px-1 uppercase tracking-tight">
                            {`${user.address.slice(0, 6)}...${user.address.slice(-4)}`}
                        </span>
                    )}

                    <div
                        ref={walletSelectorRef}
                        className="min-w-[110px] sm:min-w-[130px] w-full flex-shrink-0"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <XChainWalletSelector
                            size="sm"
                            className={clsx(
                                'brand-gradient shadow-sm flex items-center justify-center overflow-hidden text-[10px] sm:text-xs',
                                /* Adjusted height to h-8/h-9 to match the larger text size */
                                'h-8 sm:h-9 w-full rounded-md px-2 sm:px-4 justify-center xl:justify-start font-medium',
                                user.loading && 'opacity-50 pointer-events-none'
                            )}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}
