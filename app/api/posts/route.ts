import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getSession } from '@/lib/auth'

// Define interfaces for database entities
interface Post {
  id: string;
  user_id: string;
  created_at: string;
  [key: string]: any; // Allows for joined user data and dynamic fields
}

interface RelationEntry {
  post_id: string;
}

export async function GET() {
  try {
    const session = await getSession()
    const currentUserId = session?.userId

    // Fetch posts with related user information
    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        *,
        user:users!posts_user_id_fkey (
          id,
          wallet_address,
          username,
          display_name,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) {
      console.error('Error fetching posts:', error)
      return NextResponse.json(
        { error: 'Failed to fetch posts' },
        { status: 500 }
      )
    }

    // Safely type the fetched posts and extract IDs
    const typedPosts = posts as Post[] | null
    const postIds = typedPosts?.map((p: Post) => p.id) || []

    // Batch fetch likes and comments to avoid N+1 query problems
    const [likesData, commentsData, userLikesData] = await Promise.all([
      supabase
        .from('likes')
        .select('post_id')
        .in('post_id', postIds),

      supabase
        .from('comments')
        .select('post_id')
        .in('post_id', postIds),

      currentUserId
        ? supabase
          .from('likes')
          .select('post_id')
          .eq('user_id', currentUserId)
          .in('post_id', postIds)
        : Promise.resolve({ data: [] })
    ])

    // Initialize lookup tables for counts and user interactions
    const likesCount: Record<string, number> = {}
    const commentsCount: Record<string, number> = {}
    const userLikes = new Set((userLikesData.data as RelationEntry[] | null)?.map(l => l.post_id) || []);

    // Aggregate counts for likes
    const likesArray = (likesData.data as RelationEntry[]) || [];

    likesArray.forEach((like: RelationEntry) => {
      likesCount[like.post_id] = (likesCount[like.post_id] || 0) + 1;
    });

    // Aggregate counts for comments
    (commentsData.data as RelationEntry[] | null)?.forEach((comment: RelationEntry) => {
      commentsCount[comment.post_id] = (commentsCount[comment.post_id] || 0) + 1
    })

    // Map through posts to inject counters and interaction status
    const enrichedPosts = typedPosts?.map(post => ({
      ...post,
      likes_count: likesCount[post.id] || 0,
      comments_count: commentsCount[post.id] || 0,
      is_liked: userLikes.has(post.id),
    }))

    return NextResponse.json({
      posts: enrichedPosts || [],
    })
  } catch (error: unknown) {
    console.error('Error in posts API:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch posts'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}