import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(
    req: Request,
    { params }: { params: any }
) {
    try {
        const resolvedParams = await params;
        const identifier = resolvedParams.id;

        if (!identifier || identifier === "undefined") {
            return NextResponse.json({ error: 'Identifier is required' }, { status: 400 });
        }

        const { searchParams } = new URL(req.url)
        const type = searchParams.get('type')

        if (!['followers', 'following'].includes(type as string)) {
            return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
        }

        // --- STEP 0: Resolve actual UUID from username or ID ---
        // Check if identifier is a valid UUID format
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(identifier);

        const { data: userRecord, error: userError } = await supabase
            .from('users')
            .select('id')
            .or(`username.eq."${identifier}"${isUUID ? `,id.eq."${identifier}"` : ''}`)
            .single()

        if (userError || !userRecord) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const targetUserId = userRecord.id;

        // --- STEP 1: Get the list of IDs from the 'follows' table ---
        const columnToSelect = type === 'followers' ? 'follower_id' : 'following_id'
        const filterColumn = type === 'followers' ? 'following_id' : 'follower_id'

        const { data: relations, error: relError } = await supabase
            .from('follows')
            .select(columnToSelect)
            .eq(filterColumn, targetUserId)

        if (relError) throw relError

        if (!relations || relations.length === 0) {
            return NextResponse.json([])
        }

        // --- STEP 2: Extract IDs into an array ---
        const userIds = relations.map((r: any) => r[columnToSelect])

        // --- STEP 3: Fetch detailed user profiles for the list ---
        const { data: users, error: detailsError } = await supabase
            .from('users')
            .select('id, username, display_name, avatar_url')
            .in('id', userIds)

        if (detailsError) throw detailsError

        return NextResponse.json(users || [])

    } catch (error: any) {
        console.error('API CONNECTIONS ERROR:', error.message)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}