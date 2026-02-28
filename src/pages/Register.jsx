import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { authService } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import { validateEmail, validatePassword } from "../utils/validators";

export default function Register() {
  const navigate = useNavigate();
  const { login, user, loading } = useAuth();
  useEffect(() => {
    if (!loading && user) navigate("/dashboard", { replace: true });
  }, [user, loading, navigate]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const next = {};
    if (!form.name?.trim()) next.name = "Name is required";
    if (!form.email?.trim()) next.email = "Email is required";
    else if (!validateEmail(form.email)) next.email = "Valid email required";
    if (!form.password) next.password = "Password is required";
    else if (!validatePassword(form.password))
      next.password = "Password must be at least 6 characters";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setSubmitting(true);
      const { data } = await authService.register(
        form.name.trim(),
        form.email.trim(),
        form.password
      );
      login(data);
      toast.success("Account created! Welcome to CineTrack 🎬");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.userMessage || "Registration failed");
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
            Create Account 🎬
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                name="name"
                type="text"
                placeholder="Full name"
                className="ct-input"
                value={form.name}
                onChange={handleChange}
                disabled={submitting}
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <input
                name="email"
                type="email"
                placeholder="Email address"
                className="ct-input"
                value={form.email}
                onChange={handleChange}
                disabled={submitting}
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <input
                name="password"
                type="password"
                placeholder="Password (min 6 characters)"
                className="ct-input"
                value={form.password}
                onChange={handleChange}
                disabled={submitting}
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password}</p>
              )}
            </div>
            <button type="submit" disabled={submitting} className="ct-button">
              {submitting ? "Creating account..." : "Register"}
            </button>
          </form>

          <p className="text-center text-gray-400 mt-6">
            Already have an account?{" "}
            <Link to="/" className="text-indigo-400 hover:text-indigo-300">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
