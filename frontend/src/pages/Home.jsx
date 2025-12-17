import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChefHat,
  Clock,
  Users,
  TrendingUp,
  BookOpen,
  Calendar,
} from "lucide-react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

function Home({ user }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/recipes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecipes(response.data.slice(0, 3));
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-8 md:p-12 mb-8 text-white shadow-2xl">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-xl text-orange-100 mb-6">
            Discover delicious recipes tailored to your taste and dietary
            preferences
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/recipes"
              className="px-6 py-3 bg-white text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition-all shadow-lg"
            >
              Explore Recipes
            </Link>
            <Link
              to="/meal-planner"
              className="px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-all border-2 border-white"
            >
              Plan Your Week
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">24</span>
          </div>
          <h3 className="text-gray-600 font-medium">Saved Recipes</h3>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">7</span>
          </div>
          <h3 className="text-gray-600 font-medium">Meals Planned</h3>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-2xl font-bold text-gray-900">15</span>
          </div>
          <h3 className="text-gray-600 font-medium">Recipes Tried</h3>
        </div>
      </div>

      {/* Your Preferences */}
      <div className="bg-white rounded-2xl p-6 shadow-lg mb-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Your Preferences
        </h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              Dietary Preferences
            </h3>
            <div className="flex flex-wrap gap-2">
              {user.dietaryPreferences && user.dietaryPreferences.length > 0 ? (
                user.dietaryPreferences.map((pref, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
                  >
                    {pref}
                  </span>
                ))
              ) : (
                <span className="text-gray-400 text-sm">
                  No preferences set
                </span>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">
              Favorite Cuisines
            </h3>
            <div className="flex flex-wrap gap-2">
              {user.cuisinePreferences && user.cuisinePreferences.length > 0 ? (
                user.cuisinePreferences.map((cuisine, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium"
                  >
                    {cuisine}
                  </span>
                ))
              ) : (
                <span className="text-gray-400 text-sm">
                  No cuisines selected
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Featured Recipes */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Recipes</h2>
          <Link
            to="/recipes"
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gray-200"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <Link
                key={recipe.id}
                to={`/recipes/${recipe.id}`}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold text-orange-600">
                    {recipe.difficulty}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {recipe.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {recipe.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {recipe.prepTime} min
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {recipe.servings} servings
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/meal-planner"
          className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl p-6 text-white hover:from-orange-500 hover:to-orange-700 transition-all shadow-lg"
        >
          <Calendar className="w-10 h-10 mb-4" />
          <h3 className="text-2xl font-bold mb-2">Meal Planner</h3>
          <p className="text-orange-100">
            Plan your weekly meals with drag & drop calendar
          </p>
        </Link>

        <Link
          to="/shopping-list"
          className="bg-gradient-to-br from-red-400 to-red-600 rounded-2xl p-6 text-white hover:from-red-500 hover:to-red-700 transition-all shadow-lg"
        >
          <ChefHat className="w-10 h-10 mb-4" />
          <h3 className="text-2xl font-bold mb-2">Shopping List</h3>
          <p className="text-red-100">
            Auto-generate shopping lists from your meal plans
          </p>
        </Link>
      </div>
    </div>
  );
}

export default Home;
