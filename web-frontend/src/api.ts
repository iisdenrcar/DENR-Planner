
import { clearToken, getToken } from "./auth";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

<<<<<<< HEAD
const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL?.trim();
  const { protocol, hostname, origin } = window.location;

  if (envUrl) {
    return envUrl.replace(/\/+$/, "");
  }

  const isLocalAccess = hostname === "localhost" || hostname === "127.0.0.1";

  if (isLocalAccess) {
    return `${protocol}//${hostname}:3000`;
  }

  // Fall back to same-origin if the app is ever served behind a reverse proxy.
  return origin;
=======
export const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  const envUrlString = typeof envUrl === "string" ? envUrl.trim() : "";
  if (envUrlString) return envUrlString;
  return "";
>>>>>>> 813c25ce91f81177271815eb9fe7546aa7946b35
};

export const api = {
  get: async (path: string) => {
    const url = `${getApiBaseUrl()}${path}`;
    const token = getToken();
    const response = await fetch(url, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    if (response.status === 401) {
      if (!path.startsWith("/api/login")) {
        clearToken();
        window.location.assign("/");
      }
      throw new ApiError("Unauthorized", 401);
    }
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new ApiError(errorData.message || "Api error", response.status);
    }
    if (response.status === 204) return null;
    return response.json();
  },
  post: async (path: string, body: any) => {
    const url = `${getApiBaseUrl()}${path}`;
    const token = getToken();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(body),
    });
    if (response.status === 401) {
      if (!path.startsWith("/api/login")) {
        clearToken();
        window.location.assign("/");
      }
      throw new ApiError("Unauthorized", 401);
    }
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new ApiError(errorData.message || "Api error", response.status);
    }
    if (response.status === 204) return null;
    return response.json();
  },
  put: async (path: string, body: any) => {
    const url = `${getApiBaseUrl()}${path}`;
    const token = getToken();
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(body),
    });
    if (response.status === 401) {
      if (!path.startsWith("/api/login")) {
        clearToken();
        window.location.assign("/");
      }
      throw new ApiError("Unauthorized", 401);
    }
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new ApiError(errorData.message || "Api error", response.status);
    }
    if (response.status === 204) return null;
    return response.json();
  },
  delete: async (path: string) => {
    const url = `${getApiBaseUrl()}${path}`;
    const token = getToken();
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
    if (response.status === 401) {
      if (!path.startsWith("/api/login")) {
        clearToken();
        window.location.assign("/");
      }
      throw new ApiError("Unauthorized", 401);
    }
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      throw new ApiError(errorData.message || "Api error", response.status);
    }
    if (response.status === 204) return null;
    return response.json();
  },
};

export function subscribeAdminEvents(onEvent: (payload: any) => void, onStatus?: (status: "connected" | "error") => void) {
  const token = getToken();
  if (!token) return () => {};
  let closed = false;
  let es: EventSource | null = null;
  (async () => {
    try {
      const resp = await fetch(`${getApiBaseUrl()}/api/admin/stream-token`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!resp.ok) throw new Error("stream_token_failed");
      const data = await resp.json();
      const st = String(data?.streamToken || "");
      if (!st) throw new Error("stream_token_missing");
      if (closed) return;
      const url = `${getApiBaseUrl()}/api/admin/stream?st=${encodeURIComponent(st)}`;
      es = new EventSource(url);
    } catch {
      if (closed) return;
      if (onStatus) onStatus("error");
      return;
    }

    if (!es) return;
    es.onopen = () => {
      if (onStatus) onStatus("connected");
    };
    es.onmessage = (e) => {
      const raw = e.data;
      try {
        onEvent(JSON.parse(raw));
      } catch {
        onEvent(raw);
      }
    };
    es.onerror = () => {
      if (onStatus) onStatus("error");
    };
  })();
  return () => {
    try {
      closed = true;
      es?.close();
    } catch {}
  };
}
