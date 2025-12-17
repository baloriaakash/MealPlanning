export const userAPI = {
  getProfile: () => api.get("/users/profile"),
  updateProfile: (data) => api.put("/users/profile", data),
  saveRecipe: (recipeId) => api.post(`/users/save-recipe/${recipeId}`),
  getSavedRecipes: () => api.get("/users/saved-recipes"),
};
