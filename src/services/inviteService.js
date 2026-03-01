import api from "./api";

export const inviteService = {
  create: (email) => api.post("/api/invites", { email }),
  getByToken: (token) => api.get(`/api/invites/${token}`),
  list: (params) => api.get("/api/invites", { params }),
};
