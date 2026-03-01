import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { inviteService } from "../services/inviteService";
import { authService } from "../services/authService";
import { useAuth } from "../hooks/useAuth";
import { validateRequired } from "../utils/validators";

export default function AcceptInvite() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [invite, setInvite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", password: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetch = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await inviteService.getByToken(token);
        setInvite(data.invite);
      } catch (err) {
        toast.error(err.userMessage || "Invalid or expired invite");
        setInvite(null);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const validate = () => {
    const next = {};
    if (!validateRequired(form.name)) next.name = "Name is required";
    if (!form.password) next.password = "Password is required";
    else if (form.password.length < 6)
      next.password = "Password must be at least 6 characters";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || !token) return;
    try {
      setSubmitting(true);
      const { data } = await authService.registerFromInvite(
        token,
        form.name.trim(),
        form.password
      );
      login(data);
      toast.success("Account created! Welcome to CineTrack.");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.userMessage || "Sign-up failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0d14]">
        <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!invite) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#0a0d14]">
        <div className="ct-card p-8 text-center max-w-md">
          <h1 className="text-xl font-semibold text-white mb-2">Invalid or expired invite</h1>
          <p className="text-gray-400 mb-6">
            This link may have expired or already been used. Ask the admin to send a new invitation.
          </p>
          <Link to="/" className="text-indigo-400 hover:text-indigo-300">
            Go to login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-[#0a0d14]">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-transparent to-purple-900/20 blur-3xl" />
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            CineTrack
          </h1>
          <p className="text-gray-400 mt-2">Accept Judge Invitation</p>
        </div>

        <div className="ct-card p-8">
          <h2 className="text-xl font-semibold text-white mb-2">Create your judge account</h2>
          <p className="text-gray-400 text-sm mb-6">
            You’re signing up as <strong className="text-gray-300">{invite.email}</strong>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
              <input
                name="name"
                type="text"
                placeholder="Your full name"
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
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                name="password"
                type="password"
                placeholder="At least 6 characters"
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
              {submitting ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="text-center text-gray-400 mt-6">
            Already have an account?{" "}
            <Link to="/" className="text-indigo-400 hover:text-indigo-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
