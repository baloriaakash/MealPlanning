const User = require("../models/User");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, dietaryPreferences, allergies, cuisinePreferences } =
      req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name) user.name = name;
    if (dietaryPreferences) user.dietaryPreferences = dietaryPreferences;
    if (allergies) user.allergies = allergies;
    if (cuisinePreferences) user.cuisinePreferences = cuisinePreferences;

    await user.save();

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.toggleSaveRecipe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const recipeId = req.params.recipeId;

    const index = user.savedRecipes.indexOf(recipeId);

    if (index > -1) {
      user.savedRecipes.splice(index, 1);
    } else {
      user.savedRecipes.push(recipeId);
    }

    await user.save();

    res.status(200).json({
      success: true,
      data: user.savedRecipes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getSavedRecipes = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("savedRecipes");

    res.status(200).json({
      success: true,
      data: user.savedRecipes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
