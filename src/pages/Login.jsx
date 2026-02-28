import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { authService } from "../services/authService";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const navigate = useNavigate();
  const { login, user, loading } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    if (!loading && user) navigate("/dashboard", { replace: true });
  }, [user, loading, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const { data } = await authService.login(form.email, form.password);
      login(data);
      toast.success("Welcome back to CineTrack 🎬");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.userMessage || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-transparent to-purple-900/20 blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-transparent to-transparent" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            CineTrack
          </h1>
          <p className="text-gray-400 mt-2">Film Festival Management System</p>
        </div>

        <div className="ct-card p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center text-white">
            Welcome Back 🎬
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="email"
              type="email"
              placeholder="Email address"
              className="ct-input"
              value={form.email}
              onChange={handleChange}
              required
              disabled={submitting}
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="ct-input"
              value={form.password}
              onChange={handleChange}
              required
              disabled={submitting}
            />
            <button type="submit" disabled={submitting} className="ct-button">
              {submitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-gray-400 mt-6">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
