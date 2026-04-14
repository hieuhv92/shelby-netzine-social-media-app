import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: identifier } = await params // identifier could be ID or Username

    // 1. Get current logged-in userId from Cookies
    const sessionCookie = request.cookies.get('session')
    let currentUserId: string | null = null

    if (sessionCookie) {
      try {
        const session = JSON.parse(sessionCookie.value)
        if (session.expiresAt > Date.now()) {
          currentUserId = session.userId
        }
      } catch (e) {
        console.error("Failed to parse session cookie")
      }
    }

    // 2. Resolve user - Try searching by username first, then by ID if it's a UUID
    let user;
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(identifier);

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .or(`username.eq."${identifier}"${isUUID ? `,id.eq."${identifier}"` : ''}`)
      .single()

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    user = userData;
    const targetUserId = user.id; // This is always the UUID

    // 3. Execute counts and follow check using the resolved UUID
    const [followersRes, followingRes, followCheckRes] = await Promise.all([
      supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', targetUserId),

      supabase
        .from('follows')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', targetUserId),

      currentUserId
        ? supabase
          .from('follows')
          .select('id')
          .eq('follower_id', currentUserId)
          .eq('following_id', targetUserId)
          .maybeSingle()
        : Promise.resolve({ data: null })
    ])

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
