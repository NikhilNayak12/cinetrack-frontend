import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../components/Layout";
import { inviteService } from "../services/inviteService";
import { useAuth } from "../hooks/useAuth";
import { validateEmail } from "../utils/validators";
import { ROLES } from "../utils/constants";

export default function InviteJudge() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (user && user.role !== ROLES.ADMIN) navigate("/dashboard", { replace: true });
  }, [user, navigate]);
  if (user && user.role !== ROLES.ADMIN) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email");
      return;
    }
    try {
      setLoading(true);
      await inviteService.create(email.trim());
      toast.success("Invitation sent! The judge will receive an email with a sign-up link.");
      setEmail("");
    } catch (err) {
      toast.error(err.userMessage || "Failed to send invitation");
      setError(err.userMessage || "Failed to send invitation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Invite Judge</h1>
        <p className="text-gray-400 mb-8">
          Send an invitation email. The recipient will get a secure link to create their judge account.
        </p>

        <div className="ct-card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Judge email address
              </label>
              <input
                type="email"
                placeholder="judge@example.com"
                className="ct-input"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                disabled={loading}
              />
              {error && (
                <p className="text-red-400 text-sm mt-1">{error}</p>
              )}
            </div>
            <button type="submit" disabled={loading} className="ct-button">
              {loading ? "Sending..." : "Send invitation"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
