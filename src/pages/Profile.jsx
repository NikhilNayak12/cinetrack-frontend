import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../hooks/useAuth";
import { userService } from "../services/userService";
import { ROLES } from "../utils/constants";

const roleLabels = {
  [ROLES.ADMIN]: "Admin",
  [ROLES.JUDGE]: "Judge",
  [ROLES.STUDENT]: "Student",
};

export default function Profile() {
  const { user, refreshProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const { data } = await userService.getProfile();
        setProfile(data.user);
        refreshProfile?.();
      } catch (error) {
        toast.error(error.userMessage || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [refreshProfile]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  const u = profile || user;

  return (
    <Layout>
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Profile</h1>

        <div className="ct-card p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-3xl font-bold text-white">
              {u?.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{u?.name}</h2>
              <p className="text-gray-400">{u?.email}</p>
              <span className="inline-block mt-2 px-3 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-sm">
                {roleLabels[u?.role] || u?.role}
              </span>
            </div>
          </div>

          <dl className="space-y-4">
            <div>
              <dt className="text-sm text-gray-500">Name</dt>
              <dd className="text-white">{u?.name}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Email</dt>
              <dd className="text-white">{u?.email}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Role</dt>
              <dd className="text-white">{roleLabels[u?.role] || u?.role}</dd>
            </div>
          </dl>
        </div>
      </div>
    </Layout>
  );
}
