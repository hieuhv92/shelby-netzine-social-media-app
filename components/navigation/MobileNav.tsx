"use client";

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { usePathname } from "next/navigation";
import { RootState } from "@/lib/redux/store";
import {
    HomeIcon, MagnifyingGlassIcon, BellIcon, UserIcon,
    PlusIcon
} from "@heroicons/react/24/outline";
import {
    HomeIcon as HomeSolid,
    MagnifyingGlassIcon as SearchSolid,
    BellIcon as BellSolid,
    UserIcon as UserSolid
} from "@heroicons/react/24/solid";
import { toast } from "sonner";
import { openPostModal } from "@/lib/redux/slices/modalSlice";

export default function MobileNav() {
    const pathname = usePathname();
    const dispatch = useDispatch();
    const { isAuthenticated, username } = useSelector((state: RootState) => state.user);

    const handleProfileClick = (e: React.MouseEvent) => {
        if (!isAuthenticated) {
            e.preventDefault();
            toast.error("Please connect your wallet!", {
                style: {
                    background: '#F59E0B',
                    color: '#fff',
                    borderRadius: '8px',
                    fontWeight: '500'
                },
                duration: 4000
            });
        }
    };

    const renderIcon = (href: string, IconOutline: any, IconSolid: any) => {
        const isActive = pathname === href;
        const Icon = isActive ? IconSolid : IconOutline;
        return <Icon className={`w-7 h-7 transition-all duration-200 ${isActive ? "text-[#F4AF01] scale-110" : "text-gray-600"}`} />;
    };

    return (
        <>
            {/* Mobile Floating Action Button */}
            <button
                onClick={() => dispatch(openPostModal())}
                className="sm:hidden fixed bottom-[80px] right-4 bg-[#F4AF01] w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl z-50 active:scale-90 transition-all duration-200"
            >
                <PlusIcon className="w-8 h-8 stroke-[2.5]" />
            </button>

            <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100 px-6 py-2 flex justify-between items-center z-50 h-16">
                <Link href="/" className="p-2 active:bg-gray-100 rounded-full transition-colors">
                    {renderIcon("/", HomeIcon, HomeSolid)}
                </Link>

                <Link href="/explore" className="p-2 active:bg-gray-100 rounded-full transition-colors">
                    {renderIcon("/explore", MagnifyingGlassIcon, SearchSolid)}
                </Link>

                <Link href="#" className="p-2 active:bg-gray-100 rounded-full transition-colors">
                    {renderIcon("#", BellIcon, BellSolid)}
                </Link>

                {/* Profile Link */}
                <Link
                    href={isAuthenticated ? `/profile/${username}` : "#"}
                    onClick={handleProfileClick}
                    className={`p-2 active:bg-gray-100 rounded-full transition-colors ${!isAuthenticated ? "opacity-40" : ""}`}
                >
                    {pathname.includes("/profile")
                        ? <UserSolid className="w-7 h-7 text-[#F4AF01] scale-110" />
                        : <UserIcon className="w-7 h-7 text-gray-600" />
                    }
                </Link>
            </nav>
        </>
    );
}
