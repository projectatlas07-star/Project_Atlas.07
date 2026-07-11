// apps/web/src/lib/api.ts
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = '/api'; // Next.js API routes are under /api
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  
  const res = await fetch(`${baseUrl}${path}`, { ...options, headers });
  
  // Handle non-JSON responses (e.g., 404 HTML pages)
  const contentType = res.headers.get('content-type');
  if (!res.ok) {
    if (contentType && contentType.includes('text/html')) {
      throw new Error('Unable to connect to the Atlas API. Please try again.');
    }
    const errorBody = await res.text();
    throw new Error(`API error ${res.status}: ${errorBody}`);
  }
  
  // Ensure response is JSON
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('Unable to connect to the Atlas API. Please try again.');
  }
  
  return (await res.json()) as T;
}
