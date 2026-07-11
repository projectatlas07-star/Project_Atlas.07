// apps/web/src/lib/api.ts
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = ''; // Use same-origin for Next.js API routes
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  // Append auth token if available via Supabase session (client-side)
  if (typeof window !== 'undefined') {
    const supabaseToken = localStorage.getItem('sb-access-token');
    if (supabaseToken) {
      headers['Authorization'] = `Bearer ${supabaseToken}`;
    }
  }
  const res = await fetch(`${baseUrl}${path}`, { ...options, headers });
  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`API error ${res.status}: ${errorBody}`);
  }
  return (await res.json()) as T;
}
