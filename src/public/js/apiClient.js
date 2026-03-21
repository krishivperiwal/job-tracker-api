const API_BASE = "/api";

export const getToken = () => localStorage.getItem("jobTrackerToken") || "";

export const setToken = (token) => {
  localStorage.setItem("jobTrackerToken", token);
};

export const clearToken = () => {
  localStorage.removeItem("jobTrackerToken");
};

export const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const request = async (url, options = {}) => {
  const response = await fetch(url, options);
  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    throw new Error(data?.message || data || "Request failed");
  }

  return data;
};

export const apiGet = (path) => request(`${API_BASE}${path}`, {
  headers: {
    ...authHeaders()
  }
});

export const apiPost = (path, body) => request(`${API_BASE}${path}`, {
  method: "POST",
  headers: {
    ...(body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...authHeaders()
  },
  body: body instanceof FormData ? body : JSON.stringify(body)
});

export const apiPatch = (path, body) => request(`${API_BASE}${path}`, {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
    ...authHeaders()
  },
  body: JSON.stringify(body)
});

export const apiDelete = (path) => request(`${API_BASE}${path}`, {
  method: "DELETE",
  headers: {
    ...authHeaders()
  }
});

export const setMessage = (element, text, type = "info") => {
  if (!element) {
    return;
  }

  element.textContent = text;
  element.dataset.type = type;
};
