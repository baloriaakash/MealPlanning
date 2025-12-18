const mongoose = require("mongoose");

const mealPlanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      default: "My Meal Plan",
    },
    weekStartDate: {
      type: Date,
      required: true,
    },
    meals: {
      type: Map,
      of: mongoose.Schema.Types.ObjectId,
      default: {},
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

mealPlanSchema.index({ user: 1, weekStartDate: 1 });

module.exports = mongoose.model("MealPlan", mealPlanSchema);
