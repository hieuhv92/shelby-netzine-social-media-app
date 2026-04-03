"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { signOutUser, signInSuccess } from "@/lib/redux/slices/userSlice";
import { AppDispatch, RootState } from "@/lib/redux/store";
import clsx from 'clsx';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { XChainWalletSelector } from '@shelby-protocol/ui/components/x-chain-wallet-selector';

export default function SidebarUserInfo() {
    const dispatch: AppDispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user);
    const { account, wallet, connected } = useWallet();

    // Ref to track API call status and prevent redundant requests
    const isLoggingIn = useRef(false);

    useEffect(() => {
        const handleLogIn = async () => {
            // CRITICAL CONDITIONS:
            // 1. Wallet must be connected (account?.address exists)
            // 2. Current wallet address must be DIFFERENT from the one in Redux (prevents infinite loops)
            // 3. Not currently in the middle of an API call (isLoggingIn.current)
            const currentWalletAddress = account?.address?.toString();

            if (connected && currentWalletAddress && currentWalletAddress !== user.address && !isLoggingIn.current) {
                try {
                    isLoggingIn.current = true;
                    console.log("🚀 Initiating Login API for:", currentWalletAddress);

                    const response = await fetch('/api/auth/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ walletAddress: currentWalletAddress }),
                    });

                    if (!response.ok) throw new Error('Login failed');

                    const data = await response.json();

                    // Update Redux state upon successful API response
                    // This aligns user.address with currentWalletAddress, preventing further calls
                    dispatch(signInSuccess({
                        address: currentWalletAddress,
                        walletName: wallet?.adapter.name,
                        // Add other user data from backend if necessary
                    }));

                } catch (error) {
                    console.error('Login error:', error);
                } finally {
                    isLoggingIn.current = false;
                }
            }

            // Handle wallet disconnection: Clear Redux if wallet is disconnected but session remains
            if (!connected && user.address) {
                dispatch(signOutUser());
            }
        };

        handleLogIn();
    }, [connected, account?.address, user.address, wallet, dispatch]);

    return (
        <div className="absolute bottom-3 flex items-center space-x-3 xl:p-3 xl:pe-6 hover:bg-gray-100 rounded-full transition duration-200 w-full max-w-fit xl:max-w-[260px]">
            {account && (
                <div className="relative">
                    {/* User Avatar */}
                    <Image
                        src="/assets/avatar.jpg"
                        width={40}
                        height={40}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover border border-gray-100"
                    />
                    {/* Online Status Indicator */}
                    <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-white animate-pulse"></span>
                </div>
            )}

            <div className="hidden xl:flex flex-col text-sm flex-1">
                {/* Display truncated wallet address or username from Redux */}
                {/* <span className="font-bold text-[#0F1419] truncate">
                    {user.address ? `${user.address.slice(0, 6)}...${user.address.slice(-4)}` : "Anonymous"}
                </span> */}

                {/* Stop propagation to prevent accidental parent clicks */}
                <div className="mt-1" onClick={(e) => e.stopPropagation()}>
                    <XChainWalletSelector
                        size="sm"
                        className={clsx('w-full brand-gradient shadow-sm justify-start overflow-hidden text-[12px]')}
                    />
                </div>

                {/* Separate Sign Out button for better UX */}
                {/* {user.address && (
                    <button
                        onClick={() => dispatch(signOutUser())}
                        className="text-[10px] text-red-500 text-left hover:underline mt-1"
                    >
                        Sign out
                    </button>
                )} */}
            </div>
        </div>
    );
}