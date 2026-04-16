import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'

/**
 * GET: Check if the current user is following a specific user
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id: followingId } = await params
    // Use Service Role client to bypass RLS on server-side
    const adminSupabase = createServerClient()

    const { data: follow } = await adminSupabase
      .from('follows')
      .select('id')
      .eq('follower_id', currentUser.id)
      .eq('following_id', followingId)
      .maybeSingle() // Use maybeSingle to avoid 406 errors if no record exists

    return NextResponse.json({
      isFollowing: !!follow,
    })
  } catch (error: any) {
    return NextResponse.json(
      { isFollowing: false },
      { status: 200 }
    )
  }
}

/**
 * POST: Create a follow relationship
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id: followingId } = await params

    // Prevent users from following themselves
    if (currentUser.id === followingId) {
      return NextResponse.json(
        { error: 'Cannot follow yourself' },
        { status: 400 }
      )
    }

    const adminSupabase = createServerClient()

    // Check if the follow relationship already exists
    const { data: existingFollow } = await adminSupabase
      .from('follows')
      .select('id')
      .eq('follower_id', currentUser.id)
      .eq('following_id', followingId)
      .maybeSingle()

    if (existingFollow) {
      return NextResponse.json({ success: true, isFollowing: true })
    }

    // Insert new follow record using admin privileges to bypass RLS
    const { error } = await adminSupabase
      .from('follows')
      .insert({
        follower_id: currentUser.id,
        following_id: followingId,
      })

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true, isFollowing: true })
  } catch (error: any) {
    console.error('Error following user:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to follow user' },
      { status: 500 }
    )
  }
}

/**
 * DELETE: Remove a follow relationship (Unfollow)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id: followingId } = await params
    const adminSupabase = createServerClient()

    // Execute delete using admin client
    const { error } = await adminSupabase
      .from('follows')
      .delete()
      .eq('follower_id', currentUser.id)
      .eq('following_id', followingId)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true, isFollowing: false })
  } catch (error: any) {
    console.error('Error unfollowing user:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to unfollow user' },
      { status: 500 }
    )
  }
}
