export const mealPlanAPI = {
  getAll: () => api.get("/mealplans"),
  getById: (id) => api.get(`/mealplans/${id}`),
  create: (data) => api.post("/mealplans", data),
  update: (id, data) => api.put(`/mealplans/${id}`, data),
  delete: (id) => api.delete(`/mealplans/${id}`),
  generateShoppingList: (data) =>
    api.post("/mealplans/shopping-list/generate", data),
};
