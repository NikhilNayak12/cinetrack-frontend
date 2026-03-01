import api from "./api";

export const authService = {
  login: (email, password) =>
    api.post("/api/auth/login", { email, password }),

  register: (name, email, password) =>
    api.post("/api/auth/register", { name, email, password }),

  registerFromInvite: (token, name, password) =>
    api.post("/api/auth/register-from-invite", { token, name, password }),

  getProfile: () => api.get("/api/users/profile"),
};
