import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Clock,
  Users,
  ChefHat,
  ArrowLeft,
  Heart,
  Share2,
  Star,
} from "lucide-react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });

  useEffect(() => {
    fetchRecipe();
    fetchReviews();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/recipes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecipe(response.data);
    } catch (error) {
      console.error("Error fetching recipe:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/recipes/${id}/reviews`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/recipes/${id}/reviews`, newReview, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewReview({ rating: 5, comment: "" });
      fetchReviews();
      fetchRecipe();
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const averageRating = recipe?.ratings?.length
    ? (
        recipe.ratings.reduce((a, b) => a + b, 0) / recipe.ratings.length
      ).toFixed(1)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Recipe not found
          </h2>
          <button
            onClick={() => navigate("/recipes")}
            className="text-orange-600 hover:text-orange-700"
          >
            Back to Recipes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate("/recipes")}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Recipes
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            <div className="relative h-96">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-orange-50 transition-all shadow-lg">
                  <Heart className="w-6 h-6 text-gray-600" />
                </button>
                <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-orange-50 transition-all shadow-lg">
                  <Share2 className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-4xl font-bold text-gray-900">
                  {recipe.title}
                </h1>
                <div className="flex items-center gap-1">
                  <Star className="w-6 h-6 text-yellow-400 fill-current" />
                  <span className="text-2xl font-bold text-gray-900">
                    {averageRating}
                  </span>
                  <span className="text-gray-600">
                    ({recipe.ratings?.length || 0})
                  </span>
                </div>
              </div>

              <p className="text-gray-600 text-lg mb-6">{recipe.description}</p>

              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center text-gray-700">
                  <Clock className="w-5 h-5 mr-2 text-orange-600" />
                  <span className="font-medium">{recipe.prepTime} minutes</span>
                </div>
                <div className="flex items-center text-gray-700">
                  <Users className="w-5 h-5 mr-2 text-orange-600" />
                  <span className="font-medium">
                    {recipe.servings} servings
                  </span>
                </div>
                <div className="flex items-center text-gray-700">
                  <ChefHat className="w-5 h-5 mr-2 text-orange-600" />
                  <span className="font-medium">{recipe.difficulty}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                  {recipe.cuisine}
                </span>
                {recipe.dietaryTags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="border-t pt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Instructions
                </h2>
                <ol className="space-y-4">
                  {recipe.instructions?.map((instruction, index) => (
                    <li key={index} className="flex gap-4">
                      <span className="flex-shrink-0 w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </span>
                      <p className="text-gray-700 pt-1">{instruction}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>

            <form
              onSubmit={handleSubmitReview}
              className="mb-8 p-6 bg-gray-50 rounded-xl"
            >
              <h3 className="font-semibold text-gray-900 mb-4">
                Write a Review
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setNewReview({ ...newReview, rating: star })
                      }
                      className={`w-8 h-8 ${
                        star <= newReview.rating
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      <Star className="w-full h-full fill-current" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comment
                </label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) =>
                    setNewReview({ ...newReview, comment: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  placeholder="Share your experience..."
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all font-medium"
              >
                Submit Review
              </button>
            </form>

            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">
                      {review.userName}
                    </span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                  <p className="text-sm text-gray-400 mt-2">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Ingredients
            </h2>
            <div className="space-y-6">
              {Object.entries(
                recipe.ingredients?.reduce((acc, ing) => {
                  if (!acc[ing.category]) acc[ing.category] = [];
                  acc[ing.category].push(ing);
                  return acc;
                }, {}) || {}
              ).map(([category, items]) => (
                <div key={category}>
                  <h3 className="font-semibold text-gray-700 mb-2">
                    {category}
                  </h3>
                  <ul className="space-y-2">
                    {items.map((ing, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3"></span>
                        <span className="text-gray-600">
                          <span className="font-medium text-gray-900">
                            {ing.amount}
                          </span>{" "}
                          {ing.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold text-gray-900 mb-4">
                Nutrition Facts
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">
                    {recipe.calories}
                  </p>
                  <p className="text-sm text-gray-600">Calories</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">
                    {recipe.protein}g
                  </p>
                  <p className="text-sm text-gray-600">Protein</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">
                    {recipe.carbs}g
                  </p>
                  <p className="text-sm text-gray-600">Carbs</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">
                    {recipe.fat}g
                  </p>
                  <p className="text-sm text-gray-600">Fat</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetail;
