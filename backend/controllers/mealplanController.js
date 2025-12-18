const MealPlan = require("../models/MealPlan");
const Recipe = require("../models/Recipe");

exports.getMealPlans = async (req, res) => {
  try {
    const mealPlans = await MealPlan.find({ user: req.user.id })
      .sort({ weekStart: -1 })
      .populate("meals.$*.recipeId");

    res.status(200).json({
      success: true,
      data: mealPlans,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getMealPlan = async (req, res) => {
  try {
    const mealPlan = await MealPlan.findById(req.params.id);

    if (!mealPlan) {
      return res.status(404).json({
        success: false,
        message: "Meal plan not found",
      });
    }

    if (mealPlan.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this meal plan",
      });
    }

    res.status(200).json({
      success: true,
      data: mealPlan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createMealPlan = async (req, res) => {
  try {
    req.body.user = req.user.id;

    const mealPlan = await MealPlan.create(req.body);

    res.status(201).json({
      success: true,
      data: mealPlan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateMealPlan = async (req, res) => {
  try {
    let mealPlan = await MealPlan.findById(req.params.id);

    if (!mealPlan) {
      return res.status(404).json({
        success: false,
        message: "Meal plan not found",
      });
    }

    if (mealPlan.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to update this meal plan",
      });
    }

    mealPlan = await MealPlan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: mealPlan,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteMealPlan = async (req, res) => {
  try {
    const mealPlan = await MealPlan.findById(req.params.id);

    if (!mealPlan) {
      return res.status(404).json({
        success: false,
        message: "Meal plan not found",
      });
    }

    if (mealPlan.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to delete this meal plan",
      });
    }

    await mealPlan.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.generateShoppingList = async (req, res) => {
  try {
    const { recipeIds } = req.body;

    if (!recipeIds || recipeIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide recipe IDs",
      });
    }

    const recipes = await Recipe.find({ _id: { $in: recipeIds } });

    const ingredientsByCategory = {};

    recipes.forEach((recipe) => {
      recipe.ingredients.forEach((ingredient) => {
        if (!ingredientsByCategory[ingredient.category]) {
          ingredientsByCategory[ingredient.category] = [];
        }

        const existing = ingredientsByCategory[ingredient.category].find(
          (item) => item.name.toLowerCase() === ingredient.name.toLowerCase()
        );

        if (existing) {
          existing.amounts.push(ingredient.amount);
        } else {
          ingredientsByCategory[ingredient.category].push({
            name: ingredient.name,
            amounts: [ingredient.amount],
          });
        }
      });
    });

    res.status(200).json({
      success: true,
      data: ingredientsByCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
