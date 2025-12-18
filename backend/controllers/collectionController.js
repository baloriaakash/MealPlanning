const Collection = require("../models/Collection");

exports.getCollections = async (req, res) => {
  try {
    const collections = await Collection.find({ user: req.user.id })
      .populate("recipes")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: collections,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getCollection = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id).populate(
      "recipes"
    );

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    if (collection.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this collection",
      });
    }

    res.status(200).json({
      success: true,
      data: collection,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createCollection = async (req, res) => {
  try {
    req.body.user = req.user.id;

    const collection = await Collection.create(req.body);

    res.status(201).json({
      success: true,
      data: collection,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateCollection = async (req, res) => {
  try {
    let collection = await Collection.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    if (collection.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to update this collection",
      });
    }

    collection = await Collection.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: collection,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteCollection = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    if (collection.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to delete this collection",
      });
    }

    await collection.deleteOne();

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

exports.addRecipeToCollection = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    if (collection.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to modify this collection",
      });
    }

    if (collection.recipes.includes(req.params.recipeId)) {
      return res.status(400).json({
        success: false,
        message: "Recipe already in collection",
      });
    }

    collection.recipes.push(req.params.recipeId);
    await collection.save();

    res.status(200).json({
      success: true,
      data: collection,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.removeRecipeFromCollection = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: "Collection not found",
      });
    }

    if (collection.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to modify this collection",
      });
    }

    collection.recipes = collection.recipes.filter(
      (recipeId) => recipeId.toString() !== req.params.recipeId
    );

    await collection.save();

    res.status(200).json({
      success: true,
      data: collection,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
