"use client";

import React from "react";
import SignUpModal from "@/components/ui/modals/SignUpModal";
import LogInModal from "@/components/ui/modals/LogInModal";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import clsx from 'clsx';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { XChainWalletSelector } from '@shelby-protocol/ui/components/x-chain-wallet-selector';

export default function SignUpPrompt() {
    const { connected, account } = useWallet();
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const handleLogin = async () => {
            if (connected && account && !isLoggingIn) {
                setIsLoggingIn(true);

                try {
                    // Call backend to create/get user and set proper session
                    const response = await fetch("/api/auth/login", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            walletAddress: account.address.toString(),
                        }),
                    });

                    if (!response.ok) {
                        throw new Error("Login failed");
                    }

                    const data = await response.json();

                    if (data.authenticated) {
                        router.push("/");
                    }
                } catch (error) {
                    console.error("Login error:", error);
                    setIsLoggingIn(false);
                }
            }
        };

        handleLogin();
    }, [connected, account, router, isLoggingIn]);

    return (
        // !name &&
        <div className="fixed w-full h-[80px] bg-[#F4AF01] 
            bottom-0 flex justify-center items-center md:space-x-5 
            lg:justify-between lg:px-20 xl-px-40 2xl:px-80"
        >
            <div className="hidden md:flex flex-col text-white">
                <span className="text-xl font-bold">Don't miss out on the OpenHub</span>
                <span>People on Open Hub are always the first to know</span>
            </div>
            <div className="flex space-x-2 w-full md:w-fit p-3">
                <LogInModal />
                <SignUpModal />
            </div>
        </div >
    )
}
