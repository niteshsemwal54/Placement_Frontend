import { apiClient } from "./apiClient.js";

function normalizeAuthResponse(response) {
  const payload = response?.data;
  if (!payload || !payload.token) {
    throw new Error("Invalid auth response from server");
  }

  return {
    token: payload.token,
    user: {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: payload.role,
    },
  };
}

export async function register({ name, email, password }) {
  const response = await apiClient.post("/api/auth/register", {
    name,
    email,
    password,
  });
  return normalizeAuthResponse(response);
}

export async function login({ email, password }) {
  const response = await apiClient.post("/api/auth/login", {
    email,
    password,
  });
  return normalizeAuthResponse(response);
}

export async function googleLogin(idToken) {
  const response = await apiClient.post("/api/auth/google", {
    idToken,
  });
  return normalizeAuthResponse(response);
}
