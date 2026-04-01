"use client";

import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { signOutUser } from "../redux/slices/userSlice";
import { AppDispatch, RootState } from "../redux/store";
import clsx from 'clsx';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { XChainWalletSelector } from '@shelby-protocol/ui/components/x-chain-wallet-selector';

export default function SidebarUserInfo() {
    const dispatch: AppDispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user);
    const { account, wallet } = useWallet();
    async function handleSignOut() {
        // await signOut();
        dispatch(signOutUser());
    }

    return (
        <div className="absolute bottom-3 flex items-center
        space-x-3 xl:p-3 xl:pe-6 hover:bg-gray-100 
        rounded-full transition duration-200 cursor-pointer w-full max-w-fit xl:max-w-[260px]"
            onClick={() => handleSignOut()}
        >
            {account && (
                <div className="relative">
                    {/* User Avatar */}
                    <Image
                        src="/assets/avatar.jpg"
                        width={40}
                        height={40}
                        alt="Profile Picture"
                        className="w-10 h-10 rounded-full object-cover border border-gray-100"
                    />

                    {/* Online Status Dot */}
                    <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-white animate-pulse"></span>
                </div>
            )}

            <div className="hidden xl:flex flex-col text-sm">
                {/* <span className="font-bold text-[#0F1419] truncate">
                    {user?.username || "Anonymous User"}
                </span> */}
                {/* <span className="text-gray-500 truncate">
                    @{user?.display_name || "unknown"}
                </span> */}

                {/* Wallet Selector with small margin top */}
                <div className="mt-1">
                    <XChainWalletSelector
                        size="sm"
                        className={clsx(
                            'w-full brand-gradient shadow-sm',
                            'justify-start',
                            'overflow-hidden text-ellipsis whitespace-nowrap text-[12px]',
                        )}
                    />
                </div>
            </div>
        </div>
    )
}
