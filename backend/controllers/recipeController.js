const Recipe = require("../models/Recipe");

exports.getRecipes = async (req, res) => {
  try {
    const { search, diet, cuisine, maxTime, difficulty } = req.query;

    let query = {};

    if (search) {
      query.$text = { $search: search };
    }

    if (diet) {
      query.dietaryTags = diet.toLowerCase();
    }

    if (cuisine) {
      query.cuisine = new RegExp(cuisine, "i");
    }

    if (maxTime) {
      query.prepTime = { $lte: parseInt(maxTime) };
    }

    if (difficulty) {
      query.difficulty = difficulty;
    }

    const recipes = await Recipe.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: recipes.length,
      data: recipes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate(
      "reviews.user",
      "name"
    );

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    res.status(200).json({
      success: true,
      data: recipe,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createRecipe = async (req, res) => {
  try {
    req.body.createdBy = req.user.id;

    const recipe = await Recipe.create(req.body);

    res.status(201).json({
      success: true,
      data: recipe,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateRecipe = async (req, res) => {
  try {
    let recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: recipe,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    await recipe.deleteOne();

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

exports.addReview = async (req, res) => {
  try {
    const { rating, comment, photo } = req.body;

    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    const alreadyReviewed = recipe.reviews.find(
      (review) => review.user.toString() === req.user.id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this recipe",
      });
    }

    const review = {
      user: req.user.id,
      userName: req.user.name,
      rating: Number(rating),
      comment,
      photo,
    };

    recipe.reviews.push(review);
    await recipe.save();

    res.status(201).json({
      success: true,
      data: recipe.reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: "Recipe not found",
      });
    }

    res.status(200).json({
      success: true,
      data: recipe.reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
