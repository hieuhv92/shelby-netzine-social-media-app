import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'

// Define interfaces for type safety
interface PostLike {
  user_id: string;
}

interface PostComment {
  id: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Fetch post with user details
    const { data: post, error } = await supabase
      .from('posts')
      .select(`
        *,
        user:users(*)
      `)
      .eq('id', id)
      .single()

    if (error || !post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    // Explicitly type the results from Promise.all
    const [likesResult, commentsResult] = await Promise.all([
      supabase
        .from('likes')
        .select('user_id')
        .eq('post_id', id),
      supabase
        .from('comments')
        .select('id')
        .eq('post_id', id),
    ])

    // Assign counts (TypeScript might need 'post as any' if your base Post type 
    // doesn't include these dynamic fields)
    const postWithMeta = post as any
    postWithMeta.likes_count = likesResult.data?.length || 0
    postWithMeta.comments_count = commentsResult.data?.length || 0

    // Get current user's like status
    const currentUser = await getCurrentUser()

    if (currentUser) {
      // Fix: Added explicit type for 'like' to avoid implicit 'any' error
      const userLiked = (likesResult.data as PostLike[] | null)?.some(
        (like: PostLike) => like.user_id === currentUser.id
      )
      postWithMeta.is_liked = !!userLiked
    } else {
      postWithMeta.is_liked = false
    }

    return NextResponse.json({ post: postWithMeta })
  } catch (error: any) {
    console.error('Error fetching post:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to fetch post' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Verify ownership
    const { data: post } = await supabase
      .from('posts')
      .select('user_id')
      .eq('id', id)
      .single()

    if (!post || post.user_id !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting post:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete post' },
      { status: 500 }
    )
  }
}