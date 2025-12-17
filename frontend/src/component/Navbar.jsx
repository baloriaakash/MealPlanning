import { Link, useLocation } from "react-router-dom";
import {
  ChefHat,
  Home,
  BookOpen,
  Calendar,
  ShoppingCart,
  FolderHeart,
  User,
  LogOut,
  Shield,
} from "lucide-react";

function Navbar({ user, onLogout }) {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: "/", label: "Home", icon: Home },
    { path: "/recipes", label: "Recipes", icon: BookOpen },
    { path: "/meal-planner", label: "Meal Planner", icon: Calendar },
    { path: "/collections", label: "Collections", icon: FolderHeart },
    { path: "/shopping-list", label: "Shopping", icon: ShoppingCart },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 text-transparent bg-clip-text">
              TasteTrail
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                    isActive(link.path)
                      ? "bg-orange-100 text-orange-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-2">
            {user.role === "admin" && (
              <Link
                to="/admin"
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                  isActive("/admin")
                    ? "bg-purple-100 text-purple-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Shield className="w-5 h-5" />
                <span className="hidden md:inline">Admin</span>
              </Link>
            )}
            <Link
              to="/profile"
              className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                isActive("/profile")
                  ? "bg-orange-100 text-orange-600"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <User className="w-5 h-5" />
              <span className="hidden md:inline">Profile</span>
            </Link>
            <button
              onClick={onLogout}
              className="px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all flex items-center space-x-2"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-around py-2 border-t">
          {navLinks.slice(0, 4).map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex flex-col items-center space-y-1 p-2 rounded-lg ${
                  isActive(link.path) ? "text-orange-600" : "text-gray-600"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
