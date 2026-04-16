import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const query = searchParams.get('q')

        if (!query || query.trim() === "") {
            return NextResponse.json({ users: [], posts: [] })
        }

        const adminSupabase = createServerClient()
        const searchTerm = `%${query.trim()}%`

        // 1. Search Users: match username, display_name or wallet_address
        const { data: users, error: userError } = await adminSupabase
            .from('users')
            .select('id, username, display_name, avatar_url, wallet_address')
            .or(`username.ilike.${searchTerm},display_name.ilike.${searchTerm},wallet_address.ilike.${searchTerm}`)
            .limit(5)

        if (userError) throw userError

        // 2. Search Posts: match 'caption' and join with 'users' via 'user_id'
        const { data: posts, error: postError } = await adminSupabase
            .from('posts')
            .select(`
        *,
        users:user_id (id, username, display_name, avatar_url)
      `)
            .ilike('caption', searchTerm) // Changed 'content' to 'caption'
            .order('created_at', { ascending: false })
            .limit(20)

        if (postError) throw postError

        return NextResponse.json({
            users: users || [],
            posts: posts || []
        })
    } catch (error: any) {
        console.error('Search API Error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}