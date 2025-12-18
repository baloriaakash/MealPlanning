const express = require("express");
const router = express.Router();
const {
  getMealPlans,
  getMealPlan,
  createMealPlan,
  updateMealPlan,
  deleteMealPlan,
  generateShoppingList,
} = require("../controllers/mealplanController");
const { protect } = require("../middleware/auth");

router.post("/shopping-list/generate", protect, generateShoppingList);

router.route("/").get(protect, getMealPlans).post(protect, createMealPlan);

router
  .route("/:id")
  .get(protect, getMealPlan)
  .put(protect, updateMealPlan)
  .delete(protect, deleteMealPlan);

module.exports = router;
