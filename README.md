# Netzin Social Media App - Networking in Magazine Style.

The Netzin application is built using Next.js, Supabase, and Shelby.

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
Netzin/
├── app/                        # Next.js App Router (Routing Layer)
│   ├── layout.tsx              # Root Layout (HTML/Body, Redux, Wallet, Toast Providers)
│   ├── globals.css             # Global Tailwind CSS styles
│   ├── (auth)/                 # Authentication Route Group (Simple Layout)
│   │   ├── layout.tsx          # Auth-specific Layout (e.g., Center card, no Sidebar)
│   │   └── login/
│   │       └── page.tsx        # Login Page
│   ├── (main)/                 # Main App Route Group (Shared 3-Column Layout)
│   │   ├── layout.tsx          # Main Shell (Sidebar, Content Middle, Widgets)
│   │   ├── page.tsx            # Home Feed Page (Renders Composer + FeedList)
│   │   ├── post/
│   │   │   └── [id]/           # Post detail route
│   │   │       └── page.tsx    # Single post view page
│   │   └── profile/
│   │       └── [id]/           # User profile route
│   │           └── page.tsx    # User profile page
│   └── api/                    # Backend API Routes (Serverless Functions)
│       ├── auth/               # Auth handlers (Login, Logout, Session)
│       ├── upload/             # Shelby Protocol file upload logic
│       ├── posts/              # Posts CRUD (Create, Read, Update, Delete)
│       └── users/              # User management & profile updates
├── components/                 # React Components (UI Layer)
│   ├── feed/                   # Feed-specific components
│   │   ├── FeedList.tsx        # Infinite scroll or list of posts
│   │   └── Composer.tsx        # The "Tweet-style" input box (with #F4AF01 icons)
│   ├── post/                   # Post & Interaction components
│   │   ├── PostCard.tsx        # Summary view for FeedList
│   │   ├── PostContent.tsx      # Extended view for [id] page
│   │   └── CommentItem.tsx     # Individual comment row
│   ├── navigation/             # Core navigation UI
│   │   ├── Sidebar.tsx         # Fixed left-side menu
│   │   ├── HeaderInfo.tsx      # Header information
│   │   └── Widgets.tsx         # Sticky right-side panel (Trends/Suggestions)
│   ├── ui/                     # Generic/Atomic UI components
│   │   ├── modals/             # App-wide modals
│   │   │   └── CommentModal.tsx
│   │   │   └── PostModal.tsx
│   │   └── SignUpPrompt.tsx    # Bottom banner for guests
│   │   └── LikeButton.tsx      # Like Button
│   └── providers/              # Context Providers
│       ├── WalletProvider.tsx  # Blockchain/Wallet connection
│       └── ToasterProvider.tsx # Notification system
├── lib/                        # Infrastructure, Utilities & Logic
│   ├── shelby.ts               # Shelby Protocol client setup
│   ├── supabase.ts             # Supabase client (Server & Client)
│   ├── auth.ts                 # Server-side auth utilities (JWT, Cookies)
│   ├── session-client.ts       # Client-side session management (useSession)
│   ├── redux/                  # Global State Management
│   │   ├── store.ts            # Redux Store configuration
│   │   ├── StoreProvider.tsx   # Redux Provider for Layout
│   │   └── slices/             # Redux Slices (userSlice, postSlice)
│   └── utils.ts                # Tailwind merge, date formatting, etc.
├── types/                      # TypeScript Definitions
│   ├── index.ts                # Shared Entity types (Post, User, Comment)
│   └── api.ts                  # API Request/Response schemas
├── public/                     # Static assets
│   └── assets/                 # Avatars, Logos, Default images
└── supabase/                   # Database configurations
    └── migrations/             # Migration files for Schema versioning
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

### Users
- `id`: UUID (primary key)
- `wallet_address`: TEXT (unique)
- `username`: TEXT (unique, optional)
- `display_name`: TEXT (optional)
- `avatar_url`: TEXT (optional)
- `bio`: TEXT (optional)

### Posts
- `id`: UUID (primary key)
- `user_id`: UUID (foreign key to users)
- `shelby_file_id`: TEXT
- `shelby_file_url`: TEXT
- `file_type`: TEXT ('image' | 'video')
- `caption`: TEXT (optional)

### Likes
- `id`: UUID (primary key)
- `post_id`: UUID (foreign key to posts)
- `user_id`: UUID (foreign key to users)

### Comments
- `id`: UUID (primary key)
- `post_id`: UUID (foreign key to posts)
- `user_id`: UUID (foreign key to users)
- `content`: TEXT

### Follows
- `id`: UUID (primary key)
- `follower_id`: UUID (foreign key to users)
- `following_id`: UUID (foreign key to users)

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
