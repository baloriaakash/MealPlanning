export const collectionAPI = {
  getAll: () => api.get("/collections"),
  getById: (id) => api.get(`/collections/${id}`),
  create: (data) => api.post("/collections", data),
  update: (id, data) => api.put(`/collections/${id}`, data),
  delete: (id) => api.delete(`/collections/${id}`),
  addRecipe: (id, recipeId) =>
    api.post(`/collections/${id}/recipes/${recipeId}`),
  removeRecipe: (id, recipeId) =>
    api.delete(`/collections/${id}/recipes/${recipeId}`),
};
