const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  toggleSaveRecipe,
  getSavedRecipes,
} = require("../controllers/userController");
const { protect } = require("../middleware/auth");

router.route("/profile").get(protect, getProfile).put(protect, updateProfile);

router.route("/save-recipe/:recipeId").post(protect, toggleSaveRecipe);

router.route("/saved-recipes").get(protect, getSavedRecipes);

module.exports = router;
