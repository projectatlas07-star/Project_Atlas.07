"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiFetch = apiFetch;
// apps/web/src/lib/api.ts
async function apiFetch(path, options = {}) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const headers = {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
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
    return (await res.json());
}
