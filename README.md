# Netzine Social Media App - Networking in Magazine Style.

The Netzine application is built using Next.js, Supabase, and Shelby.

## Tech Stack

- **Next.js 16**: React framework with App Router support.
- **Supabase**: Database and metadata storage
- **Shelby**: Wallet authentication and file storage (image/video)
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Redux Toolkit**: Efficient global state management for user sessions and wallet states.

## Features

- ✅ Responsive Design: Fully optimized for Mobile, Tablet, and Desktop.
- ✅ Media Storage: Upload images/videos directly to Shelby storage.
- ✅ Dynamic Feed: Real-time display of community posts
- ✅ Social Actions: Like/Unlike, Commenting, and Follow/Unfollow logic.
- ✅ Metadata Management: Synchronize post data with Supabase.
- ✅ Interactive Posts: Detailed view with a dedicated comment system.
- ✅ User Profiles: Personalized spaces for every creator.
- ✅ Wallet authentication: Seamless login via Aptos wallet (Shelby).

## Project Structure

```
Netzine/
├── app/                                # Next.js App Router (Routing Layer)
│   ├── layout.tsx                      # Root Layout (HTML/Body, Redux, Wallet, Toast Providers)
│   ├── globals.css                     # Global Tailwind CSS styles
│   ├── (auth)/                         # Authentication Route Group (Simplified UI)
│   │   ├── layout.tsx                  # Auth-specific Layout (e.g., Center card, no SideNav)
│   │   └── login/
│   │       └── page.tsx                # Login Page (Wallet Connection & Authentication)
│   ├── (main)/                         # Main App Route Group (Shared 3-Column Layout)
│   │   ├── layout.tsx                  # Main Shell (SideNav, Main Content, RightSidebar)
│   │   ├── page.tsx                    # Home Feed Page (Renders Composer + FeedList)
│   │   ├── explore/
│   │   │   └── page.tsx                # Discover content, trending topics, and suggestions
│   │   ├── post/
│   │   │   └── [id]/                   # Post detail route
│   │   │       └── page.tsx            # Single post view with thread conversations
│   │   ├── profile/
│   │   │   └── [id]/                   # User profile route
│   │   │       └── page.tsx            # User profile page (Posts, Followers, Following)
│   │   └── search/
│   │           └── page.tsx            # Search results page for users and posts
│   └── api/                            # Backend API Routes (Serverless Functions)
│       ├── auth/                       # Auth handlers (Login, Logout, Session Sync)
│       ├── upload/                     # Shelby Protocol file upload logic
│       ├── posts/                      # Posts CRUD & Interactions (Like, Comment, Delete)
│       └── users/                      # User management, profiles & suggestions
│       └── search/                     # Global search indexing logic
│       └── trending/                   # Trending hashtags & topics calculation
├── components/                         # React Components (UI Layer)
│   ├── feed/                           # Feed-specific components
│   │   ├── FeedList.tsx                # Infinite scroll or list of posts
│   │   ├── Composer.tsx                # Main input area with text, media, and auth validation
│   │   └── TrendingList.tsx            # List of current hot topics and post volumes
│   ├── post/                           # Post & Interaction components
│   │   ├── PostCard.tsx                # Summary view for FeedList with Like/Comment logic
│   │   ├── PostContent.tsx             # Extended view for post detail page
│   │   └── CommentItem.tsx             # Individual comment row in a conversation
│   ├── navigation/                     # Core Navigation UI
│   │   ├── SideNav.tsx                 # Fixed Left Navigation (Desktop/Tablet menu & Post buttons)
│   │   ├── MainHeader.tsx              # Sticky TopBar with dynamic titles, Back button, and Connect Wallet
│   │   ├── RightSidebar.tsx            # Sticky Right Column (SearchBar, Trends, Who to Follow)
│   │   └── MobileNav.tsx               # Bottom Navigation Bar & Floating Action Button (FAB) for Mobile
│   ├── ui/                             # Generic/Atomic UI components
│   │   ├── modals/                     # Global overlay components
│   │   │   ├── CommentModal.tsx        # Reply modal with post context
│   │   │   ├── EditProfileModal.tsx    # Edit modal with profile context
│   │   │   └── PostModal.tsx           # Full-screen or popup composer modal
│   │   ├── SignUpPrompt.tsx            # Call-to-action banner for unauthenticated guests
│   │   ├── LikeButton.tsx              # Heart button with Optimistic Updates & Auth guards
│   │   ├── FollowButton.tsx            # Relationship toggle with Redux sync & Auth guards
│   │   └── SearchBox.tsx               # Reusable search input (Unified SearchBar component)
│   └── providers/                      # Context Providers
│       ├── WalletProvider.tsx          # Blockchain/Wallet adapter integration
│       └── ToasterProvider.tsx         # Global notification system (Hot Toast)
└── context/                            # Shared Contexts
    └── AuthProvider.tsx                # Auth Sync logic (Wallet <-> Redux <-> Backend)
├── lib/                                # Infrastructure, Utilities & Logic
│   ├── shelby.ts                       # Shelby Protocol client & protocol setup
│   ├── supabase.ts                     # Supabase client (Server & Client instances)
│   ├── auth.ts                         # Server-side auth utilities (JWT, Cookies, Verification)
│   ├── session-client.ts               # Client-side session management utilities
│   ├── redux/                          # Global State Management
│   │   ├── store.ts                    # Redux Store configuration (Middlewares, Reducers)
│   │   ├── StoreProvider.tsx           # Redux Provider for App Layout
│   │   └── slices/                     # Feature-specific slices (user, post, profile, modal)
│   └── utils.ts                        # Shared helper functions (Date, Tailwind merge, etc.)
├── types/                              # TypeScript Definitions
│   ├── index.ts                        # Core Domain Models (Post, User, Comment, Profile)
│   └── api.ts                          # API Request/Response interface schemas
├── public/                             # Static assets
│   └── assets/                         # Icons, Logos, and Default placeholders
└── supabase/                           # Supabase Configuration
    └── migrations/                     # SQL Migration files for database versioning
```

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` in the root directory

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Shelby Configuration
SHELBY_API_URL=https://api.shelby.xyz
SHELBY_API_KEY=your_shelby_api_key
SHELBY_NETWORK=testnet

# Next.js Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3030
```

### 3. Database Setup(Supabase)

1. Create a new project on [Supabase](https://supabase.com)
2. Apply the database migrations:

```bash
# Using Supabase CLI
supabase db push
```

Alternatively, copy the content from `supabase/migrations/01_initialize_shelby_schema.sql` into the Supabase SQL Editor.


### 4. Running development server

```bash
npm run dev
```

Visit [http://localhost:3030](http://localhost:3030) to view the app.

## Database Schema

```mermaid
erDiagram
    USERS ||--o{ POSTS : "writes"
    USERS ||--o{ LIKES : "likes"
    USERS ||--o{ COMMENTS : "comments"
    USERS ||--o{ FOLLOWS : "follows"
    POSTS ||--o{ LIKES : "received"
    POSTS ||--o{ COMMENTS : "has"

    USERS {
        UUID id PK
        TEXT wallet_address UK
        TEXT username UK
        TEXT display_name
        TEXT avatar_url
        TEXT bio
    }

    POSTS {
        UUID id PK
        UUID user_id FK
        TEXT shelby_file_id
        TEXT shelby_file_url
        TEXT file_type
        TEXT caption
    }

    LIKES {
        UUID id PK
        UUID post_id FK
        UUID user_id FK
    }

    COMMENTS {
        UUID id PK
        UUID post_id FK
        UUID user_id FK
        TEXT content
    }

    FOLLOWS {
        UUID id PK
        UUID follower_id FK
        UUID following_id FK
    }

## API Documentation

### Authentication
- `POST /api/auth/login` - Login với wallet address
- `GET /api/auth/login` - Check authentication status
- `POST /api/auth/logout` - Logout

### Posts
- `GET /api/posts` - Get all posts (with pagination)
- `GET /api/posts/[id]` - Get post by ID
- `DELETE /api/posts/[id]` - Delete post
- `POST /api/posts/[id]/like` - Like post
- `DELETE /api/posts/[id]/like` - Unlike post
- `GET /api/posts/[id]/comments` - Get comments
- `POST /api/posts/[id]/comments` - Create comment

### Users
- `GET /api/users/[id]` - Get user profile
- `GET /api/users/[id]/follow` - Check follow status
- `POST /api/users/[id]/follow` - Follow user
- `DELETE /api/users/[id]/follow` - Unfollow user

### Upload
- `POST /api/upload` - Upload file metadata to Supabase (after Shelby upload)

## Important Notes

- Wallet Required: Users must install the Petra Wallet extension [Petra Wallet](https://petra.app/) to interact with the app.
- Shelby Integration: API endpoints are subject to change; please refer to the official Shelby Documentation for the latest updates.
- Production: Ensure all Supabase RLS (Row Level Security) policies are correctly configured before deployment.

## Development

```bash
# Development
npm run dev

# Build
npm run build

# Start production
npm start

# Lint
npm run lint
```

## License

This project is licensed under the MIT License.
