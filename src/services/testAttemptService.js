import { apiClient } from "./apiClient.js";

export async function submitTestAttempt(testAttempt) {
  const token = localStorage.getItem("token");

  const response = await apiClient.post("/api/tests/submit", testAttempt, {
    headers: {
      Authorization: `Bearer ${token || ""}`,
      "Content-Type": "application/json",
    },
  });

  return response.data;
}
