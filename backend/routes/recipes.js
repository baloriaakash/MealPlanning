export const recipeAPI = {
  getAll: (params) => api.get("/recipes", { params }),
  getById: (id) => api.get(`/recipes/${id}`),
  create: (data) => api.post("/recipes", data),
  update: (id, data) => api.put(`/recipes/${id}`, data),
  delete: (id) => api.delete(`/recipes/${id}`),
  addReview: (id, data) => api.post(`/recipes/${id}/reviews`, data),
  getReviews: (id) => api.get(`/recipes/${id}/reviews`),
};
