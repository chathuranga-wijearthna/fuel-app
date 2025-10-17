import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import LoginPage from "./pages/Login";
import OperatorOrderForm from "./pages/OperatorOrderForm";
import ManagerOrders from "./pages/ManagerOrders";
import ProtectedRoute from "./routes/ProtectedRoute";
import { clearToken, getToken, isAuthenticated } from "./utils/auth";
import "./App.css";

function HomeRedirect() {
  const token = getToken();
  if (!token) return <Navigate to="/login" replace />;
  return <Navigate to="/login" replace />;
}

export default function App() {
  const navigate = useNavigate();

  function logout() {
    clearToken();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Navigation */}
      {isAuthenticated() && (
        <nav className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-bold text-white">Fuel Order Management System</h1>
              </div>
              <button 
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <Routes>
        <Route path="/" element={<HomeRedirect />} />

        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/operator"
          element={
            <ProtectedRoute roles={["AIRCRAFT_OPERATOR"]}>
              <OperatorOrderForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manager"
          element={
            <ProtectedRoute roles={["OPERATIONS_MANAGER"]}>
              <ManagerOrders />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}
