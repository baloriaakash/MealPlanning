const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 5000;
const JWT_SECRET = "your-secret-key-change-in-production";

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database (replace with MongoDB/PostgreSQL in production)
let users = [];
let recipes = [
  {
    id: 1,
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
      { name: "Avocado", amount: "1", category: "Produce" },
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
    ratings: [],
    reviews: [],
    photos: [],
  },
  {
    id: 2,
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
    ratings: [],
    reviews: [],
    photos: [],
  },
  {
    id: 3,
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
    ratings: [],
    reviews: [],
    photos: [],
  },
];
let mealPlans = [];
let collections = [];
let recipeIdCounter = 4;

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Access token required" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
};

// Admin Middleware
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

// ===== AUTH ROUTES =====
app.post("/api/auth/register", async (req, res) => {
  try {
    const {
      email,
      password,
      name,
      dietaryPreferences,
      allergies,
      cuisinePreferences,
    } = req.body;

    // Check if user exists
    if (users.find((u) => u.email === email)) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: users.length + 1,
      email,
      password: hashedPassword,
      name,
      role: "user",
      dietaryPreferences: dietaryPreferences || [],
      allergies: allergies || [],
      cuisinePreferences: cuisinePreferences || [],
      createdAt: new Date(),
    };

    users.push(newUser);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET
    );

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        dietaryPreferences: newUser.dietaryPreferences,
        allergies: newUser.allergies,
        cuisinePreferences: newUser.cuisinePreferences,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find((u) => u.email === email);
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        dietaryPreferences: user.dietaryPreferences,
        allergies: user.allergies,
        cuisinePreferences: user.cuisinePreferences,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

// ===== USER PROFILE ROUTES =====
app.get("/api/user/profile", authenticateToken, (req, res) => {
  const user = users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    dietaryPreferences: user.dietaryPreferences,
    allergies: user.allergies,
    cuisinePreferences: user.cuisinePreferences,
  });
});

app.put("/api/user/profile", authenticateToken, (req, res) => {
  const user = users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });

  const { name, dietaryPreferences, allergies, cuisinePreferences } = req.body;

  if (name) user.name = name;
  if (dietaryPreferences) user.dietaryPreferences = dietaryPreferences;
  if (allergies) user.allergies = allergies;
  if (cuisinePreferences) user.cuisinePreferences = cuisinePreferences;

  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    dietaryPreferences: user.dietaryPreferences,
    allergies: user.allergies,
    cuisinePreferences: user.cuisinePreferences,
  });
});

// ===== RECIPE ROUTES =====
app.get("/api/recipes", (req, res) => {
  const { search, diet, cuisine, maxTime, difficulty } = req.query;
  let filteredRecipes = [...recipes];

  if (search) {
    filteredRecipes = filteredRecipes.filter(
      (r) =>
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.description.toLowerCase().includes(search.toLowerCase())
    );
  }

  if (diet) {
    filteredRecipes = filteredRecipes.filter((r) =>
      r.dietaryTags.includes(diet.toLowerCase())
    );
  }

  if (cuisine) {
    filteredRecipes = filteredRecipes.filter(
      (r) => r.cuisine.toLowerCase() === cuisine.toLowerCase()
    );
  }

  if (maxTime) {
    filteredRecipes = filteredRecipes.filter(
      (r) => r.prepTime <= parseInt(maxTime)
    );
  }

  if (difficulty) {
    filteredRecipes = filteredRecipes.filter(
      (r) => r.difficulty.toLowerCase() === difficulty.toLowerCase()
    );
  }

  res.json(filteredRecipes);
});

app.get("/api/recipes/:id", (req, res) => {
  const recipe = recipes.find((r) => r.id === parseInt(req.params.id));
  if (!recipe) return res.status(404).json({ error: "Recipe not found" });
  res.json(recipe);
});

app.post("/api/recipes", authenticateToken, isAdmin, (req, res) => {
  const newRecipe = {
    id: recipeIdCounter++,
    ...req.body,
    ratings: [],
    reviews: [],
    photos: [],
  };
  recipes.push(newRecipe);
  res.status(201).json(newRecipe);
});

app.put("/api/recipes/:id", authenticateToken, isAdmin, (req, res) => {
  const index = recipes.findIndex((r) => r.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Recipe not found" });

  recipes[index] = { ...recipes[index], ...req.body, id: recipes[index].id };
  res.json(recipes[index]);
});

app.delete("/api/recipes/:id", authenticateToken, isAdmin, (req, res) => {
  const index = recipes.findIndex((r) => r.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ error: "Recipe not found" });

  recipes.splice(index, 1);
  res.json({ message: "Recipe deleted successfully" });
});

// ===== MEAL PLAN ROUTES =====
app.get("/api/mealplans", authenticateToken, (req, res) => {
  const userPlans = mealPlans.filter((mp) => mp.userId === req.user.id);
  res.json(userPlans);
});

app.post("/api/mealplans", authenticateToken, (req, res) => {
  const newPlan = {
    id: mealPlans.length + 1,
    userId: req.user.id,
    ...req.body,
    createdAt: new Date(),
  };
  mealPlans.push(newPlan);
  res.status(201).json(newPlan);
});

app.put("/api/mealplans/:id", authenticateToken, (req, res) => {
  const plan = mealPlans.find(
    (mp) => mp.id === parseInt(req.params.id) && mp.userId === req.user.id
  );
  if (!plan) return res.status(404).json({ error: "Meal plan not found" });

  Object.assign(plan, req.body);
  res.json(plan);
});

app.delete("/api/mealplans/:id", authenticateToken, (req, res) => {
  const index = mealPlans.findIndex(
    (mp) => mp.id === parseInt(req.params.id) && mp.userId === req.user.id
  );
  if (index === -1)
    return res.status(404).json({ error: "Meal plan not found" });

  mealPlans.splice(index, 1);
  res.json({ message: "Meal plan deleted successfully" });
});

// ===== SHOPPING LIST ROUTE =====
app.post("/api/shopping-list/generate", authenticateToken, (req, res) => {
  const { recipeIds } = req.body;

  const selectedRecipes = recipes.filter((r) => recipeIds.includes(r.id));
  const ingredientsByCategory = {};

  selectedRecipes.forEach((recipe) => {
    recipe.ingredients.forEach((ingredient) => {
      if (!ingredientsByCategory[ingredient.category]) {
        ingredientsByCategory[ingredient.category] = [];
      }

      const existing = ingredientsByCategory[ingredient.category].find(
        (i) => i.name.toLowerCase() === ingredient.name.toLowerCase()
      );

      if (existing) {
        existing.amount += `, ${ingredient.amount}`;
      } else {
        ingredientsByCategory[ingredient.category].push({ ...ingredient });
      }
    });
  });

  res.json(ingredientsByCategory);
});

// ===== COLLECTIONS ROUTES =====
app.get("/api/collections", authenticateToken, (req, res) => {
  const userCollections = collections.filter((c) => c.userId === req.user.id);
  res.json(userCollections);
});

app.post("/api/collections", authenticateToken, (req, res) => {
  const newCollection = {
    id: collections.length + 1,
    userId: req.user.id,
    name: req.body.name,
    recipeIds: req.body.recipeIds || [],
    createdAt: new Date(),
  };
  collections.push(newCollection);
  res.status(201).json(newCollection);
});

app.put("/api/collections/:id", authenticateToken, (req, res) => {
  const collection = collections.find(
    (c) => c.id === parseInt(req.params.id) && c.userId === req.user.id
  );
  if (!collection)
    return res.status(404).json({ error: "Collection not found" });

  if (req.body.name) collection.name = req.body.name;
  if (req.body.recipeIds) collection.recipeIds = req.body.recipeIds;

  res.json(collection);
});

app.delete("/api/collections/:id", authenticateToken, (req, res) => {
  const index = collections.findIndex(
    (c) => c.id === parseInt(req.params.id) && c.userId === req.user.id
  );
  if (index === -1)
    return res.status(404).json({ error: "Collection not found" });

  collections.splice(index, 1);
  res.json({ message: "Collection deleted successfully" });
});

// ===== REVIEWS & RATINGS ROUTES =====
app.post("/api/recipes/:id/reviews", authenticateToken, (req, res) => {
  const recipe = recipes.find((r) => r.id === parseInt(req.params.id));
  if (!recipe) return res.status(404).json({ error: "Recipe not found" });

  const review = {
    id: recipe.reviews.length + 1,
    userId: req.user.id,
    userName: users.find((u) => u.id === req.user.id)?.name || "Anonymous",
    rating: req.body.rating,
    comment: req.body.comment,
    photo: req.body.photo || null,
    createdAt: new Date(),
  };

  recipe.reviews.push(review);
  recipe.ratings.push(req.body.rating);

  res.status(201).json(review);
});

app.get("/api/recipes/:id/reviews", (req, res) => {
  const recipe = recipes.find((r) => r.id === parseInt(req.params.id));
  if (!recipe) return res.status(404).json({ error: "Recipe not found" });

  res.json(recipe.reviews);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log("\nDefault Admin Account:");
  console.log(
    'Create an admin by registering and manually changing role to "admin" in code'
  );
});
