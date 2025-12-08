// API configuration - this will be replaced at build time by Next.js
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// Get the full API endpoint
export const getApiUrl = (path: string): string => {
  // If we have a full backend URL (production), use it directly
  if (API_BASE_URL && API_BASE_URL.startsWith('http')) {
    return `${API_BASE_URL}${path}`;
  }
  // Otherwise use Next.js proxy (development)
  return path;
};

// Fetch with extended timeout for cold starts
export const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeoutMs: number = 120000
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - backend server may be starting up (can take up to 2 minutes on first request)');
    }
    throw error;
  }
};
