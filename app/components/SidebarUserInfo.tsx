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
    const user = useSelector((state: RootState) => state.user)
    async function handleSignOut() {
        // await signOut();
        dispatch(signOutUser())
    }

    const { account, wallet } = useWallet();

    return (
        <div className="absolute bottom-3 flex items-center
            space-x-2 xl:p-3 xl:pe-6 hover:bg-gray-200 hover:bg-opacity-10
            rounded-full transition cursor-pointer"
            onClick={() => handleSignOut()}
        >
            {account ? <Image
                src="/assets/avatar_07.jpg"
                width={36} height={36}
                alt="Profile Picture"
                className="w-9 h-9"
            /> : ''}
            <div className="hidden xl:flex flex-col text-sm">
                <span className="font-bold">{user?.name}</span>
                <span className="text-gray-500">{user?.username}</span>
                <XChainWalletSelector
                    size="sm"
                    className={clsx(
                        'w-full brand-gradient shadow-sm',
                        // sidebar is always expanded → keep alignment stable to avoid layout "jump" on hover
                        'justify-start',
                        'overflow-hidden text-ellipsis whitespace-nowrap',
                    )
                    }
                />
            </div>
        </div>
    )
}
