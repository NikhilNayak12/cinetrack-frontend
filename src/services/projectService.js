import api from "./api";

export const projectService = {
  create: (formData) =>
    api.post("/api/projects", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  getAll: (params) => api.get("/api/projects", { params }),

  getMy: () => api.get("/api/projects/my"),

  getById: (id) => api.get(`/api/projects/${id}`),
};
