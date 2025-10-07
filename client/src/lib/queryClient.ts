import { QueryClient, QueryFunction } from "@tanstack/react-query";

// 1. Define the API Base URL. 
// Vercel/Vite will inject the VITE_API_BASE_URL during the build process.
// If not found (like during development or if running on the same host), it defaults to '/api'.
// We assume API calls start with /api (e.g., /api/items).
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string, // This 'url' is now treated as the path relative to API_BASE_URL
  data?: unknown | undefined,
): Promise<Response> {
  // Prepend the base URL to the requested path
  const fullUrl = `${API_BASE_URL}${url.startsWith('/') ? url : '/' + url}`;

  const res = await fetch(fullUrl, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
    async ({ queryKey }) => {
      // 2. Prepend the base URL to the query key when fetching data
      const path = queryKey.join("/");
      const fullUrl = `${API_BASE_URL}${path.startsWith('/') ? path : '/' + path}`;

      const res = await fetch(fullUrl, {
        credentials: "include",
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      return await res.json();
    };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
