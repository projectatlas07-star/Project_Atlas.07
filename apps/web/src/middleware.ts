// Middleware removed - @supabase/ssr handles session management automatically
// Authentication is handled by:
// - Server-side: server-auth.ts with requireAuth() for API routes
// - Client-side: SupabaseProvider with session checks for pages
// - RLS policies enforce tenant isolation at database level

export function middleware() {
  // No-op middleware - @supabase/ssr handles auth automatically
}

export const config = {
  matcher: [], // Disable middleware
};
