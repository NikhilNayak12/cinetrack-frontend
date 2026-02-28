import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../components/Layout";
import FilmCard from "../components/FilmCard";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import { useAuth } from "../hooks/useAuth";
import { projectService } from "../services/projectService";
import { taskService } from "../services/taskService";
import { ROLES } from "../utils/constants";

export default function Dashboard() {
  const { user } = useAuth();
  const [films, setFilms] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        if (user?.role === ROLES.STUDENT) {
          const { data } = await projectService.getMy();
          setFilms(data.projects || []);
        } else if (user?.role === ROLES.ADMIN || user?.role === ROLES.JUDGE) {
          const [projRes, taskRes] = await Promise.all([
            projectService.getAll({ limit: 6 }),
            user?.role === ROLES.JUDGE ? taskService.getMy({ limit: 5 }) : null,
          ]);
          setFilms(projRes.data.projects || []);
          if (taskRes) setTasks(taskRes.data.tasks || []);
        }
      } catch (error) {
        toast.error(error.userMessage || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user?.role]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Welcome back, {user?.name?.split(" ")[0] || "User"} 🎬
        </h1>
        <p className="text-gray-400 mt-1">
          {user?.role === ROLES.STUDENT && "Manage your film submissions"}
          {user?.role === ROLES.JUDGE && "Review and score assigned films"}
          {user?.role === ROLES.ADMIN && "Oversee all films and create review tasks"}
        </p>
      </div>

      {user?.role === ROLES.STUDENT && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">My Submissions</h2>
            <Link
              to="/films/upload"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-sm font-medium hover:opacity-90"
            >
              Upload Film
            </Link>
          </div>
          {films.length === 0 ? (
            <EmptyState
              icon="🎬"
              title="No films yet"
              description="Upload your first film to get started."
              action={
                <Link
                  to="/films/upload"
                  className="ct-button inline-block w-auto px-6"
                >
                  Upload Film
                </Link>
              }
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {films.map((f) => (
                <FilmCard key={f._id} film={f} />
              ))}
            </div>
          )}
        </section>
      )}

      {(user?.role === ROLES.ADMIN || user?.role === ROLES.JUDGE) && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">All Films</h2>
            {user?.role === ROLES.ADMIN && (
              <Link
                to="/judge"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-sm font-medium hover:opacity-90"
              >
                Create Review Task
              </Link>
            )}
          </div>
          {films.length === 0 ? (
            <EmptyState
              icon="🎬"
              title="No films submitted yet"
              description="Films will appear here when students submit."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {films.map((f) => (
                <FilmCard key={f._id} film={f} />
              ))}
            </div>
          )}
        </section>
      )}

      {user?.role === ROLES.JUDGE && tasks.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">My Review Tasks</h2>
            <Link
              to="/judge/tasks"
              className="text-indigo-400 hover:text-indigo-300 text-sm"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {tasks.slice(0, 5).map((t) => (
              <Link
                key={t._id}
                to={`/judge/tasks/${t._id}`}
                className="block ct-card p-4 hover:border-indigo-500/50 transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-white">{t.title}</h3>
                    <p className="text-sm text-gray-500">
                      {t.projectId?.title} • {t.status}
                    </p>
                  </div>
                  <span className="text-indigo-400 text-sm">Review →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </Layout>
  );
}
