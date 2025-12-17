import { useState, useEffect } from "react";
import { Calendar, Plus, Trash2, Edit } from "lucide-react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"];

function MealPlanner() {
  const [mealPlans, setMealPlans] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const [plansRes, recipesRes] = await Promise.all([
        axios.get(`${API_URL}/mealplans`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/recipes`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setMealPlans(plansRes.data);
      setRecipes(recipesRes.data);

      if (plansRes.data.length > 0) {
        setCurrentPlan(plansRes.data[0]);
      } else {
        createDefaultPlan();
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const createDefaultPlan = async () => {
    try {
      const token = localStorage.getItem("token");
      const emptyPlan = {
        name: "My Meal Plan",
        weekStartDate: new Date().toISOString(),
        meals: {},
      };
      const response = await axios.post(`${API_URL}/mealplans`, emptyPlan, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentPlan(response.data);
      setMealPlans([response.data]);
    } catch (error) {
      console.error("Error creating plan:", error);
    }
  };

  const handleSlotClick = (day, mealType) => {
    setSelectedSlot({ day, mealType });
    setShowModal(true);
  };

  const handleAddRecipe = async (recipeId) => {
    if (!selectedSlot || !currentPlan) return;

    const { day, mealType } = selectedSlot;
    const key = `${day}-${mealType}`;

    const updatedMeals = {
      ...currentPlan.meals,
      [key]: recipeId,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/mealplans/${currentPlan.id}`,
        { ...currentPlan, meals: updatedMeals },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCurrentPlan(response.data);
      setShowModal(false);
      setSelectedSlot(null);
    } catch (error) {
      console.error("Error updating meal plan:", error);
    }
  };

  const handleRemoveRecipe = async (day, mealType) => {
    if (!currentPlan) return;

    const key = `${day}-${mealType}`;
    const updatedMeals = { ...currentPlan.meals };
    delete updatedMeals[key];

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/mealplans/${currentPlan.id}`,
        { ...currentPlan, meals: updatedMeals },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCurrentPlan(response.data);
    } catch (error) {
      console.error("Error updating meal plan:", error);
    }
  };

  const getRecipeForSlot = (day, mealType) => {
    if (!currentPlan) return null;
    const key = `${day}-${mealType}`;
    const recipeId = currentPlan.meals[key];
    return recipes.find((r) => r.id === recipeId);
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Meal Planner
            </h1>
            <p className="text-gray-600">Plan your weekly meals</p>
          </div>
          <button className="px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-all flex items-center shadow-lg">
            <Calendar className="w-5 h-5 mr-2" />
            New Plan
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 w-32">
                  Day
                </th>
                {mealTypes.map((mealType) => (
                  <th
                    key={mealType}
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-700"
                  >
                    {mealType}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {daysOfWeek.map((day) => (
                <tr key={day} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{day}</td>
                  {mealTypes.map((mealType) => {
                    const recipe = getRecipeForSlot(day, mealType);
                    return (
                      <td key={mealType} className="px-6 py-4">
                        {recipe ? (
                          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                            <div className="flex items-center gap-3">
                              <img
                                src={recipe.image}
                                alt={recipe.title}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                              <div>
                                <p className="font-medium text-gray-900 text-sm">
                                  {recipe.title}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {recipe.prepTime} min
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemoveRecipe(day, mealType)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleSlotClick(day, mealType)}
                            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-all flex items-center justify-center text-gray-400 hover:text-orange-600"
                          >
                            <Plus className="w-5 h-5" />
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recipe Selection Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Select Recipe for {selectedSlot?.day} - {selectedSlot?.mealType}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedSlot(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recipes.map((recipe) => (
                <div
                  key={recipe.id}
                  onClick={() => handleAddRecipe(recipe.id)}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-orange-400 hover:bg-orange-50 cursor-pointer transition-all"
                >
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {recipe.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {recipe.prepTime} min • {recipe.servings} servings
                    </p>
                    <p className="text-xs text-gray-500">
                      {recipe.calories} cal
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MealPlanner;
