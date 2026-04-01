const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export async function apiFetch<T = any>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  
  // Handle empty responses (like 204 No Content for delete/logout)
  const text = await res.text();
  if (!text) return {} as T;
  
  return JSON.parse(text);
}
