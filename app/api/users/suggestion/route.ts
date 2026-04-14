import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'

export async function GET() {
    try {
        const currentUser = await getCurrentUser()

        // 1. If no user is logged in, fetch any 3 random users as suggestions
        if (!currentUser) {
            const { data: publicUsers, error: publicError } = await supabase
                .from('users')
                .select('id, username, display_name, avatar_url')
                .limit(3)

            if (publicError) throw publicError
            return NextResponse.json(publicUsers || [])
        }

        // 2. Fetch IDs of users that the currentUser is ALREADY following
        const { data: followedData, error: followedError } = await supabase
            .from('follows')
            .select('following_id')
            .eq('follower_id', currentUser.id)

        if (followedError) throw followedError

        // Create a list of IDs to exclude (already followed users + the current user themselves)
        const followedIds = followedData?.map(f => f.following_id) || []
        followedIds.push(currentUser.id)

        // 3. Fetch suggested users who are NOT in the exclusion list
        // We use .not('id', 'in', (...)) to filter out these users
        const { data: suggestions, error: suggestionsError } = await supabase
            .from('users')
            .select('id, username, display_name, avatar_url')
            .not('id', 'in', `(${followedIds.join(',')})`)
            .limit(3)

        if (suggestionsError) throw suggestionsError

        return NextResponse.json(suggestions || [])
    } catch (error: any) {
        console.error('Suggestions API Error:', error)
        // Return an empty array on error to prevent UI crashes
        return NextResponse.json([], { status: 500 })
    }
}
