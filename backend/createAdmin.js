const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");

// Load env vars
dotenv.config();

// Connect to database
mongoose.connect(process.env.MONGODB_URI);

const createAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@tastetrail.com" });

    if (existingAdmin) {
      console.log("Admin already exists!");
      console.log("Email:", existingAdmin.email);
      process.exit();
    }

    // Create admin user
    const admin = await User.create({
      name: "Admin User",
      email: "admin@tastetrail.com",
      password: "admin123",
      role: "admin",
      dietaryPreferences: [],
      allergies: [],
      cuisinePreferences: [],
    });

    console.log("Admin user created successfully!");
    console.log("Email: admin@tastetrail.com");
    console.log("Password: admin123");
    console.log("\nPlease change the password after first login!");

    process.exit();
  } catch (error) {
    console.error("Error creating admin:", error.message);
    process.exit(1);
  }
};

createAdmin();
