import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROLES } from "../utils/constants";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#0a0d14]">
      <nav className="border-b border-gray-800/50 bg-[#0d1117]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              to="/dashboard"
              className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent"
            >
              CineTrack
            </Link>

            <div className="flex items-center gap-3 flex-wrap justify-end">
              <Link
                to="/dashboard"
                className="text-gray-400 hover:text-white transition"
              >
                Dashboard
              </Link>
              {(user?.role === ROLES.STUDENT || user?.role === ROLES.ADMIN) && (
                <Link
                  to="/films/upload"
                  className="text-gray-400 hover:text-white transition"
                >
                  Upload Film
                </Link>
              )}
              {user?.role === ROLES.STUDENT && (
                <Link
                  to="/films/my"
                  className="text-gray-400 hover:text-white transition"
                >
                  My Submissions
                </Link>
              )}
              {(user?.role === ROLES.ADMIN || user?.role === ROLES.JUDGE) && (
                <Link
                  to="/judge"
                  className="text-gray-400 hover:text-white transition"
                >
                  {user?.role === ROLES.ADMIN ? "Create Review" : "Judge Panel"}
                </Link>
              )}
              {user?.role === ROLES.JUDGE && (
                <Link
                  to="/judge/tasks"
                  className="text-gray-400 hover:text-white transition"
                >
                  My Reviews
                </Link>
              )}
              <Link
                to="/profile"
                className="text-gray-400 hover:text-white transition"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-400 transition text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
