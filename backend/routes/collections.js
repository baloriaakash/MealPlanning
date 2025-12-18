const express = require("express");
const router = express.Router();
const {
  getCollections,
  getCollection,
  createCollection,
  updateCollection,
  deleteCollection,
  addRecipeToCollection,
  removeRecipeFromCollection,
} = require("../controllers/collectionController");
const { protect } = require("../middleware/auth");

router.route("/").get(protect, getCollections).post(protect, createCollection);

router
  .route("/:id")
  .get(protect, getCollection)
  .put(protect, updateCollection)
  .delete(protect, deleteCollection);

router
  .route("/:id/recipes/:recipeId")
  .post(protect, addRecipeToCollection)
  .delete(protect, removeRecipeFromCollection);

module.exports = router;
