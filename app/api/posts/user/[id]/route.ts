import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params as required by Next.js 15+ 
    const { id } = await params

    // Fetch all posts where user_id matches the profile ID
    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        *,
        user:users(*)
      `) // Fetch post data along with the author's profile info
      .eq('user_id', id)
      .order('created_at', { ascending: false }) // Show newest posts first

    // Handle Supabase errors
    if (error) {
      console.error('Supabase fetch posts error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    // Return the list of posts
    return NextResponse.json(posts)
  } catch (error: any) {
    console.error('Internal Server Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch posts' },
      { status: 500 }
    )
  }
}
