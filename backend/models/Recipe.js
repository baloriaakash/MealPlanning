const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
  photo: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      "Grains",
      "Proteins",
      "Vegetables",
      "Fruits",
      "Dairy",
      "Oils",
      "Condiments",
      "Spices",
      "Others",
    ],
  },
});

const recipeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a recipe title"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
    },
    image: {
      type: String,
      required: [true, "Please provide an image URL"],
    },
    prepTime: {
      type: Number,
      required: [true, "Please provide preparation time"],
    },
    servings: {
      type: Number,
      required: [true, "Please provide number of servings"],
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },
    cuisine: {
      type: String,
      required: [true, "Please provide cuisine type"],
    },
    dietaryTags: [
      {
        type: String,
        enum: [
          "vegan",
          "vegetarian",
          "gluten-free",
          "dairy-free",
          "low-carb",
          "keto",
          "paleo",
        ],
      },
    ],
    ingredients: [ingredientSchema],
    instructions: [
      {
        type: String,
        required: true,
      },
    ],
    calories: {
      type: Number,
      required: true,
    },
    protein: {
      type: Number,
      required: true,
    },
    carbs: {
      type: Number,
      required: true,
    },
    fat: {
      type: Number,
      required: true,
    },
    reviews: [reviewSchema],
    averageRating: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

recipeSchema.pre("save", function (next) {
  if (this.reviews.length > 0) {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.averageRating = sum / this.reviews.length;
  }
  next();
});

recipeSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Recipe", recipeSchema);
