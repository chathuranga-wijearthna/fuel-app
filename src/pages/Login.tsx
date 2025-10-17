import { useState } from "react";
import { login, register } from "../utils/api";
import { setToken, getRolesFromToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import { AppRole } from "../interfaces/types";

export default function LoginPage() {
  const [mode, setMode] = useState<"login" | "register" | "logged">("login");
  const [email, setEmail] = useState("user@example.com");
  const [password, setPassword] = useState("string");
  const [role, setRole] = useState<AppRole>("AIRCRAFT_OPERATOR");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  async function doLogin() {
    setError(null);
    try {
      const token = await login(email, password);
      setToken(token);
      const roles = getRolesFromToken(token);
      if (roles.includes("OPERATIONS_MANAGER")) {
        navigate("/manager", { replace: true });
      } else if (roles.includes("AIRCRAFT_OPERATOR")) {
        navigate("/operator", { replace: true });
      } else {
        navigate("/login", { replace: true });
      }
    } catch (e: any) {
      setError(e?.message ?? "Login failed");
    }
  }

  async function doRegister() {
    setError(null);
    try {
      await register(email, password, role);
      setMode("login");
    } catch (e: any) {
      setError(e?.message ?? "Register failed");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white mb-2">Welcome</h2>
            <p className="text-gray-400">
              {mode === "login"
                ? "Sign in to your account"
                : "Create a new account"}
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex bg-gray-700/30 rounded-lg p-1 mb-8">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
                mode === "login"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-300 hover:text-white hover:bg-gray-600/50"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-all duration-200 ${
                mode === "register"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-300 hover:text-white hover:bg-gray-600/50"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form Content */}
          <div className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your email"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter your password"
              />
            </div>

            {/* Role Field (Register Mode Only) */}
            {mode === "register" && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as AppRole)}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="AIRCRAFT_OPERATOR">Aircraft Operator</option>
                  <option value="OPERATIONS_MANAGER">Operations Manager</option>
                </select>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={mode === "login" ? doLogin : doRegister}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              {mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">Fuel Orders Management System</p>
        </div>
      </div>
    </div>
  );
}
