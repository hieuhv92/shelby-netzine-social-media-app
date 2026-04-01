# Netzin Social Media App - An open space for everyone.

The Netzin application is built using Next.js, Supabase, and Shelby

## Tech Stack

- **Next.js 16**: React framework with App Router support.
- **Supabase**: Database and metadata storage
- **Shelby**: Wallet authentication and file storage (image/video)
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling

## Features

- ✅ Wallet authentication: Seamless login via Aptos wallet (Shelby).
- ✅ Media Storage: Upload images/videos directly to Shelby storage.
- ✅ Metadata Management: Synchronize post data with Supabase.
- ✅ Dynamic Feed: Real-time display of community posts
- ✅ Interactive Posts: Detailed view with a dedicated comment system.
- ✅ User Profiles: Personalized spaces for every creator.
- ✅ Social Actions: Like/Unlike, Commenting, and Follow/Unfollow logic.
- ✅ Responsive Design: Fully optimized for Mobile, Tablet, and Desktop.
- ✅ test
- ✅ test

## Project Structure

```
Netzin/
├── app/                   # Next.js App Router
│   ├── [id]/              # Auth routes
│   │   └── page.tsx/      # Post Detail page
│   ├── (main)/            # Main app routes
│   │   ├── page.tsx       # Feed page
│   │   ├── post/[id]/     # Post detail
│   │   ├── profile/[id]/  # User profile
│   │   └── create/        # Create post
│   └── api/               # API routes
│       ├── auth/          # Authentication
│       ├── upload/        # Upload to Shelby
│       ├── posts/         # Posts CRUD
│       └── users/         # User management
├── components/            # React components
│   ├── auth/              # Auth components
│   ├── post/              # Post components
│   ├── profile/           # Profile components
│   ├── upload/            # Upload components
│   └── templates/         # Templates components
├── lib/                   # Utilities
│   ├── shelby.ts          # Shelby client
│   ├── supabase.ts        # Supabase client
│   ├── auth.ts            # Auth utilities
│   └── utils.ts           # Helper functions
├── types/                 # TypeScript types
└── supabase/              # Database migrations
    └── migrations/
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
