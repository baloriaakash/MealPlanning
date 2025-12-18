import { useState, useEffect } from "react";
import { ShoppingCart, Plus, Check, Printer } from "lucide-react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

function ShoppingList() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [shoppingList, setShoppingList] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});
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
      setRecipes(response.data.data || []);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRecipe = (recipeId) => {
    setSelectedRecipes((prev) =>
      prev.includes(recipeId)
        ? prev.filter((id) => id !== recipeId)
        : [...prev, recipeId]
    );
  };

  const generateShoppingList = async () => {
    if (selectedRecipes.length === 0) {
      alert("Please select at least one recipe");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/mealplans/shopping-list/generate`,
        { recipeIds: selectedRecipes },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setShoppingList(response.data.data);
      setCheckedItems({});
    } catch (error) {
      console.error("Error generating shopping list:", error);
      alert("Failed to generate shopping list");
    }
  };

  const toggleItem = (category, itemName) => {
    const key = `${category}-${itemName}`;
    setCheckedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Shopping List Generator
        </h1>
        <p className="text-gray-600">
          Select recipes to generate your shopping list
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recipe Selection */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Select Recipes
          </h2>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {recipes.map((recipe) => (
              <div
                key={recipe._id}
                onClick={() => toggleRecipe(recipe._id)}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                  selectedRecipes.includes(recipe._id)
                    ? "bg-orange-50 border-2 border-orange-500"
                    : "bg-gray-50 border-2 border-transparent hover:border-gray-300"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                    selectedRecipes.includes(recipe._id)
                      ? "bg-orange-500 border-orange-500"
                      : "border-gray-300"
                  }`}
                >
                  {selectedRecipes.includes(recipe._id) && (
                    <Check className="w-4 h-4 text-white" />
                  )}
                </div>
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {recipe.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {recipe.servings} servings • {recipe.prepTime} min
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={generateShoppingList}
            disabled={selectedRecipes.length === 0}
            className="w-full mt-4 px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Generate Shopping List ({selectedRecipes.length} recipes)
          </button>
        </div>

        {/* Shopping List */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Your Shopping List
            </h2>
            {shoppingList && (
              <button
                onClick={handlePrint}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all flex items-center"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </button>
            )}
          </div>

          {!shoppingList ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                Select recipes and generate your shopping list
              </p>
            </div>
          ) : (
            <div className="space-y-6 max-h-[600px] overflow-y-auto">
              {Object.entries(shoppingList).map(([category, items]) => (
                <div key={category} className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {items.map((item, index) => {
                      const key = `${category}-${item.name}`;
                      const isChecked = checkedItems[key];
                      return (
                        <div
                          key={index}
                          onClick={() => toggleItem(category, item.name)}
                          className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${
                            isChecked ? "bg-green-50" : "hover:bg-gray-50"
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              isChecked
                                ? "bg-green-500 border-green-500"
                                : "border-gray-300"
                            }`}
                          >
                            {isChecked && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <span
                            className={`flex-1 ${
                              isChecked
                                ? "line-through text-gray-500"
                                : "text-gray-900"
                            }`}
                          >
                            {item.name}
                          </span>
                          <span className="text-sm text-gray-600">
                            {item.amounts.join(", ")}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .shopping-list-print,
          .shopping-list-print * {
            visibility: visible;
          }
          .shopping-list-print {
            position: absolute;
            left: 0;
            top: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default ShoppingList;
