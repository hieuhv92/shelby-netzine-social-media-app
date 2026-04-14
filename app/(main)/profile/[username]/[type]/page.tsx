'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import UserCard from '@/components/users/UserCard'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function ConnectionsPage() {
    const params = useParams()
    const router = useRouter()

    // Extract id (UUID) and type (followers/following) directly from URL params
    const username = params?.username as string
    const type = params?.type as string

    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchConnections = async () => {
            setLoading(true)
            try {
                // Call the API route using the ID provided in the URL
                const res = await fetch(`/api/users/${username}/connections?type=${type}`)
                const data = await res.json()
                setUsers(data)
            } catch (error) {
                console.error("Failed to fetch connections:", error)
            } finally {
                setLoading(false)
            }
        }

        if (username && type) fetchConnections()
    }, [username, type])

    // Validate connection type to prevent invalid access
    if (type !== 'followers' && type !== 'following') return <div>Page not found</div>

    return (
        <div className="min-h-screen bg-white border-x border-gray-100 max-w-2xl">
            {/* Tab Navigation Section */}
            <div className="flex border-b border-gray-100 dark:border-zinc-800">
                <button
                    onClick={() => router.push(`/profile/${username}/followers`)}
                    className={`flex-1 py-4 text-[15px] font-bold transition-all ${type === 'followers'
                        ? 'border-b-4 border-yellow-400 text-gray-900 dark:text-white'
                        : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-zinc-900 border-b-4 border-transparent'
                        }`}
                >
                    Followers
                </button>

                <button
                    onClick={() => router.push(`/profile/${username}/following`)}
                    className={`flex-1 py-4 text-[15px] font-bold transition-all ${type === 'following'
                        ? 'border-b-4 border-yellow-400 text-gray-900 dark:text-white'
                        : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-zinc-900 border-b-4 border-transparent'
                        }`}
                >
                    Following
                </button>
            </div>

            {/* User List Content */}
            <div className="flex flex-col">
                {loading ? (
                    <div className="p-10 text-center flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                ) : users.length > 0 ? (
                    users.map((user: any) => (
                        <UserCard key={user.id} user={user} />
                    ))
                ) : (
                    <div className="p-10 text-center">
                        <p className="font-bold text-xl text-gray-900">No {type} yet</p>
                        <p className="text-gray-500 text-[15px]">When someone follows this account, they'll show up here.</p>
                    </div>
                )}
            </div>
        </div>
    )
}