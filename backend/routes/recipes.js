const express = require("express");
const router = express.Router();
const {
  getRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  addReview,
  getReviews,
} = require("../controllers/recipeController");
const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(getRecipes)
  .post(protect, authorize("admin"), createRecipe);

router
  .route("/:id")
  .get(getRecipe)
  .put(protect, authorize("admin"), updateRecipe)
  .delete(protect, authorize("admin"), deleteRecipe);

router.route("/:id/reviews").get(getReviews).post(protect, addReview);

module.exports = router;
