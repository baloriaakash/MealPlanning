const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Recipe = require("./models/Recipe");
const User = require("./models/User");

dotenv.config();

mongoose.connect(process.env.MONGODB_URI);

const recipes = [
  {
    title: "Vegan Buddha Bowl",
    description:
      "A nutritious bowl packed with quinoa, chickpeas, and fresh vegetables",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
    prepTime: 30,
    servings: 2,
    difficulty: "Easy",
    cuisine: "International",
    dietaryTags: ["vegan", "gluten-free"],
    ingredients: [
      { name: "Quinoa", amount: "1 cup", category: "Grains" },
      { name: "Chickpeas", amount: "1 can", category: "Proteins" },
      { name: "Spinach", amount: "2 cups", category: "Vegetables" },
      { name: "Avocado", amount: "1", category: "Vegetables" },
      { name: "Tahini", amount: "2 tbsp", category: "Condiments" },
    ],
    instructions: [
      "Cook quinoa according to package directions",
      "Roast chickpeas with spices at 400°F for 20 minutes",
      "Arrange quinoa, chickpeas, and fresh vegetables in a bowl",
      "Drizzle with tahini dressing",
    ],
    calories: 450,
    protein: 15,
    carbs: 52,
    fat: 18,
  },
  {
    title: "Mediterranean Pasta",
    description: "Light pasta with cherry tomatoes, olives, and feta cheese",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400",
    prepTime: 25,
    servings: 4,
    difficulty: "Easy",
    cuisine: "Mediterranean",
    dietaryTags: ["vegetarian"],
    ingredients: [
      { name: "Pasta", amount: "400g", category: "Grains" },
      { name: "Cherry Tomatoes", amount: "2 cups", category: "Vegetables" },
      { name: "Olives", amount: "1 cup", category: "Condiments" },
      { name: "Feta Cheese", amount: "200g", category: "Dairy" },
      { name: "Olive Oil", amount: "3 tbsp", category: "Oils" },
    ],
    instructions: [
      "Cook pasta according to package directions",
      "Halve cherry tomatoes and sauté with olive oil",
      "Add olives and cooked pasta",
      "Top with crumbled feta cheese",
    ],
    calories: 520,
    protein: 18,
    carbs: 65,
    fat: 22,
  },
  {
    title: "Grilled Chicken Salad",
    description:
      "Healthy grilled chicken with mixed greens and balsamic dressing",
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400",
    prepTime: 20,
    servings: 2,
    difficulty: "Easy",
    cuisine: "American",
    dietaryTags: ["gluten-free", "low-carb"],
    ingredients: [
      { name: "Chicken Breast", amount: "2", category: "Proteins" },
      { name: "Mixed Greens", amount: "4 cups", category: "Vegetables" },
      { name: "Cherry Tomatoes", amount: "1 cup", category: "Vegetables" },
      { name: "Cucumber", amount: "1", category: "Vegetables" },
      { name: "Balsamic Vinegar", amount: "2 tbsp", category: "Condiments" },
    ],
    instructions: [
      "Season and grill chicken breast until cooked through",
      "Slice grilled chicken",
      "Toss mixed greens with vegetables",
      "Top with chicken and drizzle with balsamic dressing",
    ],
    calories: 320,
    protein: 35,
    carbs: 12,
    fat: 14,
  },
  {
    title: "Veggie Stir Fry",
    description: "Quick and colorful vegetable stir fry with soy sauce",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400",
    prepTime: 15,
    servings: 3,
    difficulty: "Easy",
    cuisine: "Chinese",
    dietaryTags: ["vegan", "vegetarian"],
    ingredients: [
      { name: "Broccoli", amount: "2 cups", category: "Vegetables" },
      { name: "Bell Peppers", amount: "2", category: "Vegetables" },
      { name: "Carrots", amount: "2", category: "Vegetables" },
      { name: "Soy Sauce", amount: "3 tbsp", category: "Condiments" },
      { name: "Ginger", amount: "1 tbsp", category: "Spices" },
    ],
    instructions: [
      "Cut all vegetables into bite-sized pieces",
      "Heat oil in a wok over high heat",
      "Add vegetables and stir fry for 5 minutes",
      "Add soy sauce and ginger, cook for 2 more minutes",
    ],
    calories: 180,
    protein: 6,
    carbs: 28,
    fat: 5,
  },
  {
    title: "Salmon with Asparagus",
    description: "Baked salmon fillet with roasted asparagus and lemon",
    image: "https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=400",
    prepTime: 25,
    servings: 2,
    difficulty: "Medium",
    cuisine: "American",
    dietaryTags: ["gluten-free", "low-carb", "keto"],
    ingredients: [
      { name: "Salmon Fillet", amount: "2", category: "Proteins" },
      { name: "Asparagus", amount: "1 bunch", category: "Vegetables" },
      { name: "Lemon", amount: "1", category: "Fruits" },
      { name: "Olive Oil", amount: "2 tbsp", category: "Oils" },
      { name: "Garlic", amount: "3 cloves", category: "Spices" },
    ],
    instructions: [
      "Preheat oven to 400°F",
      "Season salmon with salt, pepper, and lemon juice",
      "Toss asparagus with olive oil and garlic",
      "Bake salmon and asparagus for 15-18 minutes",
    ],
    calories: 380,
    protein: 42,
    carbs: 8,
    fat: 20,
  },
];

const importData = async () => {
  try {
    await Recipe.deleteMany();

    console.log("Data Destroyed...");

    await Recipe.insertMany(recipes);

    console.log("Data Imported...");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Recipe.deleteMany();
    await User.deleteMany();

    console.log("Data Destroyed...");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
