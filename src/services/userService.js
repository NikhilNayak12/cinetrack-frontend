import api from "./api";

export const userService = {
  getProfile: () => api.get("/api/users/profile"),

  getUsersByRole: (role) =>
    api.get("/api/users", { params: role ? { role } : {} }),
};
