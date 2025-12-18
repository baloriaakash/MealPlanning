import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Trash2, FolderHeart, Clock, Users } from "lucide-react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

function Collections() {
  const [collections, setCollections] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const [collectionsRes, recipesRes] = await Promise.all([
        axios.get(`${API_URL}/collections`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/recipes`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setCollections(collectionsRes.data.data || []);
      setRecipes(recipesRes.data.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCollection = async (e) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/collections`,
        { name: newCollectionName, recipes: [] },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNewCollectionName("");
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error("Error creating collection:", error);
      alert("Failed to create collection");
    }
  };

  const handleDeleteCollection = async (id) => {
    if (!confirm("Are you sure you want to delete this collection?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/collections/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchData();
    } catch (error) {
      console.error("Error deleting collection:", error);
      alert("Failed to delete collection");
    }
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
              My Collections
            </h1>
            <p className="text-gray-600">Organize your favorite recipes</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-all flex items-center shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Collection
          </button>
        </div>
      </div>

      {collections.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
          <FolderHeart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No collections yet
          </h3>
          <p className="text-gray-600 mb-4">
            Create your first collection to organize your recipes
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-all inline-flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Collection
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <div
              key={collection._id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <FolderHeart className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {collection.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {collection.recipes?.length || 0} recipes
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteCollection(collection._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {collection.recipes && collection.recipes.length > 0 ? (
                  <div className="space-y-2">
                    {collection.recipes.slice(0, 3).map((recipeId) => {
                      const recipe = recipes.find((r) => r._id === recipeId);
                      if (!recipe) return null;
                      return (
                        <Link
                          key={recipeId}
                          to={`/recipes/${recipeId}`}
                          className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-all"
                        >
                          <img
                            src={recipe.image}
                            alt={recipe.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {recipe.title}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                              <Clock className="w-3 h-3" />
                              {recipe.prepTime} min
                              <Users className="w-3 h-3 ml-2" />
                              {recipe.servings}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                    {collection.recipes.length > 3 && (
                      <p className="text-sm text-gray-600 text-center pt-2">
                        +{collection.recipes.length - 3} more recipes
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No recipes in this collection yet
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Collection Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Create New Collection
            </h2>
            <form onSubmit={handleCreateCollection}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Collection Name
                </label>
                <input
                  type="text"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  placeholder="e.g., Favorite Desserts"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-all"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setNewCollectionName("");
                  }}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Collections;
