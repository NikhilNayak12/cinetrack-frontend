import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../components/Layout";
import { projectService } from "../services/projectService";
import { userService } from "../services/userService";
import { taskService } from "../services/taskService";
import { useAuth } from "../hooks/useAuth";
import { ROLES } from "../utils/constants";
import { validateRequired } from "../utils/validators";

export default function JudgePanel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [judges, setJudges] = useState([]);
  const [form, setForm] = useState({
    title: "",
    projectId: "",
    assignedTo: "",
    deadline: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetch = async () => {
      try {
        setFetching(true);
        const [projRes, judgeRes] = await Promise.all([
          projectService.getAll({ limit: 100 }),
          user?.role === ROLES.ADMIN ? userService.getUsersByRole("judge") : null,
        ]);
        setProjects(projRes.data.projects || []);
        if (judgeRes) setJudges(judgeRes.data.users || []);
      } catch (error) {
        toast.error(error.userMessage || "Failed to load data");
      } finally {
        setFetching(false);
      }
    };
    fetch();
  }, [user?.role]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const next = {};
    if (!validateRequired(form.title)) next.title = "Title is required";
    if (!validateRequired(form.projectId)) next.projectId = "Select a film";
    if (!validateRequired(form.assignedTo))
      next.assignedTo = "Select a judge";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const payload = {
        title: form.title.trim(),
        projectId: form.projectId,
        assignedTo: form.assignedTo,
      };
      if (form.deadline?.trim()) payload.deadline = form.deadline;

      await taskService.create(payload);
      toast.success("Review task created!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.userMessage || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== ROLES.ADMIN) {
    return (
      <Layout>
        <div className="text-center py-16">
          <p className="text-gray-400">
            Only admins can create review tasks. Judges can view their assigned
            tasks in{" "}
            <button
              onClick={() => navigate("/judge/tasks")}
              className="text-indigo-400 hover:underline"
            >
              My Reviews
            </button>
            .
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Create Review Task</h1>
        <p className="text-gray-400 mb-8">
          Assign a film to a judge for review and scoring.
        </p>

        {fetching ? (
          <div className="ct-card p-12 flex justify-center">
            <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="ct-card p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Task Title *
              </label>
              <input
                name="title"
                type="text"
                placeholder="e.g. Review: Short Film #1"
                className="ct-input"
                value={form.title}
                onChange={handleChange}
                disabled={loading}
              />
              {errors.title && (
                <p className="text-red-400 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Film *
              </label>
              <select
                name="projectId"
                className="ct-input"
                value={form.projectId}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">Select a film</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.title} ({p.genre})
                  </option>
                ))}
              </select>
              {errors.projectId && (
                <p className="text-red-400 text-sm mt-1">{errors.projectId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Assign to Judge *
              </label>
              <select
                name="assignedTo"
                className="ct-input"
                value={form.assignedTo}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="">Select a judge</option>
                {judges.map((j) => (
                  <option key={j._id} value={j._id}>
                    {j.name} ({j.email})
                  </option>
                ))}
              </select>
              {errors.assignedTo && (
                <p className="text-red-400 text-sm mt-1">{errors.assignedTo}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Deadline (optional)
              </label>
              <input
                name="deadline"
                type="datetime-local"
                className="ct-input"
                value={form.deadline}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button type="submit" disabled={loading} className="ct-button flex-1">
                {loading ? "Creating..." : "Create Task"}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
}
