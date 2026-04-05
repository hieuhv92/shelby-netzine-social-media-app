"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { signInSuccess, signOutUser, setLoading } from "@/lib/redux/slices/userSlice";
import { RootState } from "@/lib/redux/store";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.user);
    const { account, connected } = useWallet();
    const isLoggingIn = useRef(false);

    useEffect(() => {
        const handleAuth = async () => {
            const walletAddress = account?.address?.toString();

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

            if (!connected && user.address) {
                dispatch(signOutUser());
            }
        };

        handleAuth();
    }, [connected, account?.address, user.address, dispatch]);

    return <>{children}</>;
}
