import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: profileId } = await params

    // 1. Get current logged-in userId from Cookies
    const sessionCookie = request.cookies.get('session')
    let currentUserId: string | null = null

    if (sessionCookie) {
      try {
        const session = JSON.parse(sessionCookie.value)
        // Check if the session is still valid
        if (session.expiresAt > Date.now()) {
          currentUserId = session.userId
        }
      } catch (e) {
        console.error("Failed to parse session cookie")
      }
    }

    // 2. Fetch the target user's profile information
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', profileId)
      .single()

    if (error || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // 3. Execute counts and follow check in parallel for better performance
    const [followersRes, followingRes, followCheckRes] = await Promise.all([
      // Count followers of this profile
      supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', profileId),

      // Count how many people this profile is following
      supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', profileId),

      // Check if current user follows this profile (only if logged in)
      currentUserId
        ? supabase
          .from('follows')
          .select('id')
          .eq('follower_id', currentUserId)
          .eq('following_id', profileId)
          .maybeSingle()
        : Promise.resolve({ data: null })
    ])

    // 4. Return combined data
    return NextResponse.json({
      user,
      followersCount: followersRes.count || 0,
      followingCount: followingRes.count || 0,
      isFollowing: !!followCheckRes.data,
    })

  } catch (error: any) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch user' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Mapping only the fields that exist in your database
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({
        display_name: body.display_name,
        bio: body.bio,
        location: body.location,
        website: body.website,
        avatar_url: body.avatar_url,
        banner_url: body.banner_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      user: updatedUser,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
