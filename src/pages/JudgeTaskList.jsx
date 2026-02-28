import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import { taskService } from "../services/taskService";
import { TASK_STATUS } from "../utils/constants";

const statusColors = {
  [TASK_STATUS.TODO]: "bg-amber-500/20 text-amber-400",
  [TASK_STATUS.IN_PROGRESS]: "bg-blue-500/20 text-blue-400",
  [TASK_STATUS.DONE]: "bg-emerald-500/20 text-emerald-400",
};

export default function JudgeTaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const params = statusFilter ? { status: statusFilter } : {};
        const { data } = await taskService.getMy(params);
        setTasks(data.tasks || []);
      } catch (error) {
        toast.error(error.userMessage || "Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [statusFilter]);

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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">My Reviews</h1>
          <p className="text-gray-400 mt-1">Films assigned to you for review</p>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="ct-input w-auto"
        >
          <option value="">All statuses</option>
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>

      {tasks.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No review tasks"
          description="You don't have any films assigned for review yet."
        />
      ) : (
        <div className="space-y-4">
          {tasks.map((t) => {
            const statusClass = statusColors[t.status] || "bg-gray-500/20 text-gray-400";
            return (
              <Link
                key={t._id}
                to={`/judge/tasks/${t._id}`}
                className="block ct-card p-6 hover:border-indigo-500/50 transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-white">{t.title}</h3>
                    <p className="text-gray-500 mt-1">
                      {t.projectId?.title} • {t.projectId?.genre}
                    </p>
                    {t.rating != null && (
                      <p className="text-indigo-400 text-sm mt-2">
                        Rating: {t.rating}/10
                      </p>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${statusClass}`}
                  >
                    {t.status}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </Layout>
  );
}
