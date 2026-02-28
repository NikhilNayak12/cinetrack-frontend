import api from "./api";

export const authService = {
  login: (email, password) =>
    api.post("/api/auth/login", { email, password }),

  register: (name, email, password) =>
    api.post("/api/auth/register", { name, email, password }),

  getProfile: () => api.get("/api/users/profile"),
};
