import React from "react";
import { ShoppingCart, UserPlus, LogIn, LogOut, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { useCartStore } from "../stores/useCartStore";

const Navbar = () => {
  const { user, logout } = useUserStore();
  const isAdmin = user?.role === "admin";
  const { cart } = useCartStore();

  return (
    <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-light-lavender via-muted-purple to-deep-plum shadow-lg z-40 transition-all duration-300 border-b border-soft-purple-shadow">
      <div className="container mx-auto px-5 py-4">
        <div className="flex flex-wrap justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold text-light-lavender items-center space-x-2 flex"
          >
            TrendSphere
          </Link>

          {/* Navigation */}
          <nav className="flex flex-wrap items-center gap-5">
            <Link
              to="/"
              className="text-deep-purple hover:text-muted-purple transition duration-300"
            >
              Home
            </Link>
            {user && (
              <Link
                to="/cart"
                className="relative group text-deep-purple hover:text-muted-purple transition duration-300"
              >
                <ShoppingCart
                  className="inline-block mr-1 group-hover:text-muted-purple"
                  size={20}
                />
                <span className="hidden sm:inline">Cart</span>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -left-2 bg-muted-purple text-white rounded-full px-2 py-0.5 text-xs group-hover:bg-deep-plum transition duration-300">
                    {cart.length}
                  </span>
                )}
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/secret-dashboard"
                className="bg-deep-plum hover:bg-muted-purple text-white px-3 py-1 rounded-md font-medium transition duration-300 flex items-center"
              >
                <Lock className="inline-block mr-1" size={18} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            )}
            {user ? (
              <button
                className="bg-deep-purple hover:bg-muted-purple text-white py-2 px-4 rounded-md flex items-center transition duration-300"
                onClick={logout}
              >
                <LogOut size={18} />
                <span className="hidden sm:inline ml-2">Log Out</span>
              </button>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="bg-muted-purple hover:bg-deep-plum text-white py-2 px-4 rounded-md flex items-center transition duration-300"
                >
                  <UserPlus className="mr-2" size={18} />
                  Sign Up
                </Link>
                <Link
                  to="/login"
                  className="bg-deep-purple hover:bg-muted-purple text-white py-2 px-4 rounded-md flex items-center transition duration-300"
                >
                  <LogIn className="mr-2" size={18} />
                  Login
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

