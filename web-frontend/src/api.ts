
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

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
};

export const api = {
  get: async (path: string) => {
    const url = `${getApiBaseUrl()}${path}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (response.status === 401) {
      localStorage.removeItem("token");
      window.location.assign("/");
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
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(body),
    });
    if (response.status === 401) {
      localStorage.removeItem("token");
      window.location.assign("/");
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
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(body),
    });
    if (response.status === 401) {
      localStorage.removeItem("token");
      window.location.assign("/");
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
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (response.status === 401) {
      localStorage.removeItem("token");
      window.location.assign("/");
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
