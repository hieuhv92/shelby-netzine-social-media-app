import Link from 'next/link';
import Image from 'next/image';

interface UserCardProps {
    user: {
        id: string
        username: string
        display_name: string
        avatar_url: string
    }
}

export default function UserCard({ user }: UserCardProps) {
    return (
        <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-all border-b border-gray-100 dark:border-zinc-800">
            <div className="flex items-center gap-3">
                {/* Avatar with Link */}
                <Link href={`/profile/${user.username}`} className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700">
                        <Image
                            src={user.avatar_url || 'assets/default-avatar.png'} // Ensure you have a default img in /public
                            alt={user.username}
                            fill
                            className="object-cover"
                        />
                    </div>
                </Link>

                {/* User Info */}
                <div className="flex flex-col min-w-0">
                    <Link
                        href={`/profile/${user.username}`}
                        className="font-bold text-gray-900 dark:text-white hover:underline truncate"
                    >
                        {user.display_name || user.username}
                    </Link>
                    <span className="text-gray-500 text-sm truncate">@{user.username}</span>
                </div>
            </div>

            {/* Action Button - Optional but makes the card look balanced */}
            <Link
                href={`/profile/${user.username}`}
                className="px-4 py-1.5 bg-black dark:bg-white dark:text-black text-white rounded-full text-sm font-bold hover:opacity-80 transition-opacity"
            >
                View
            </Link>
        </div>
    )
}
