"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { signInSuccess, signOutUser, setLoading } from "@/lib/redux/slices/userSlice";
import { RootState } from "@/lib/redux/store";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user);
    const { account, connected, isLoading: walletLoading } = useWallet();
    const isLoggingIn = useRef(false);

    useEffect(() => {
        const handleAuth = async () => {
            // 1. Wait for the Wallet Adapter to initialize from browser storage
            if (walletLoading) return;

            const walletAddress = account?.address?.toString();

            // 2. Case: Wallet is connected but not yet synced with Redux/Backend
            if (connected && walletAddress && walletAddress !== user.address && !isLoggingIn.current) {
                try {
                    isLoggingIn.current = true;
                    dispatch(setLoading(true));

                    const response = await fetch('/api/auth/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ walletAddress }),
                    });

                    if (response.ok) {
                        const data = await response.json();
                        dispatch(signInSuccess({
                            address: walletAddress,
                            username: data.user?.username,
                            display_name: data.user?.display_name,
                            avatar_url: data.user?.avatar_url
                        }));
                    }
                } catch (error) {
                    console.error("Auth sync error:", error);
                } finally {
                    isLoggingIn.current = false;
                    dispatch(setLoading(false));
                }
            }

            // 3. Case: No wallet connection (after F5 or manual Disconnect)
            if (!connected) {
                if (user.address) {
                    dispatch(signOutUser());
                }
                // Turn off loading to exit Skeleton state and show the "Connect" button
                dispatch(setLoading(false));
            }
        };

        handleAuth();
        // Re-run effect when the adapter finishes loading or connection state changes
    }, [connected, walletLoading, account?.address, user.address, dispatch]);

    return <>{children}</>;
}
