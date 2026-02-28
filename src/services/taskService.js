import api from "./api";

export const taskService = {
  create: (data) => api.post("/api/tasks", data),

  getMy: (params) => api.get("/api/tasks/my", { params }),

  getById: (id) => api.get(`/api/tasks/${id}`),

  update: (id, data) => api.put(`/api/tasks/${id}`, data),
};
