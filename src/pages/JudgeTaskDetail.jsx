import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";
import { taskService } from "../services/taskService";
import { TASK_STATUS } from "../utils/constants";

const statusOptions = [
  { value: TASK_STATUS.TODO, label: "Todo" },
  { value: TASK_STATUS.IN_PROGRESS, label: "In Progress" },
  { value: TASK_STATUS.DONE, label: "Done" },
];

export default function JudgeTaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    status: "",
    feedback: "",
    rating: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const { data } = await taskService.getById(id);
        setTask(data.task);
        setForm({
          status: data.task.status,
          feedback: data.task.feedback || "",
          rating: data.task.rating ?? "",
        });
      } catch (error) {
        toast.error(error.userMessage || "Task not found");
        navigate("/judge/tasks");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const next = {};
    if (form.rating !== "" && form.rating !== null) {
      const r = Number(form.rating);
      if (isNaN(r) || r < 1 || r > 10)
        next.rating = "Rating must be between 1 and 10";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSaving(true);
      const payload = {};
      if (form.status) payload.status = form.status;
      if (form.feedback !== undefined) payload.feedback = form.feedback.trim();
      if (form.rating !== "" && form.rating != null)
        payload.rating = Number(form.rating);

      const { data } = await taskService.update(id, payload);
      setTask(data.task);
      toast.success("Review updated!");
    } catch (error) {
      toast.error(error.userMessage || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !task) {
    return (
      <Layout>
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  const project = task.projectId;

  return (
    <Layout>
      <button
        onClick={() => navigate(-1)}
        className="text-gray-400 hover:text-white mb-6 flex items-center gap-2"
      >
        ← Back
      </button>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="ct-card overflow-hidden">
          <h2 className="text-xl font-semibold text-white p-6 border-b border-gray-800">
            {project?.title || "Film"}
          </h2>
          <div className="aspect-video bg-black">
            {project?.filmUrl ? (
              <video
                src={project.filmUrl}
                controls
                className="w-full h-full"
                poster={project.posterUrl}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-4xl text-gray-600">
                🎬
              </div>
            )}
          </div>
          {project?.description && (
            <div className="p-6">
              <p className="text-gray-300 text-sm">{project.description}</p>
            </div>
          )}
        </div>

        <div>
          <form onSubmit={handleSubmit} className="ct-card p-6 space-y-6">
            <h2 className="text-xl font-semibold text-white">Submit Review</h2>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status
              </label>
              <select
                name="status"
                className="ct-input"
                value={form.status}
                onChange={handleChange}
                disabled={saving}
              >
                {statusOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Rating (1–10)
              </label>
              <input
                name="rating"
                type="number"
                min="1"
                max="10"
                placeholder="e.g. 8"
                className="ct-input"
                value={form.rating}
                onChange={handleChange}
                disabled={saving}
              />
              {errors.rating && (
                <p className="text-red-400 text-sm mt-1">{errors.rating}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Feedback
              </label>
              <textarea
                name="feedback"
                placeholder="Your review and comments..."
                className="ct-input min-h-[120px] resize-y"
                value={form.feedback}
                onChange={handleChange}
                disabled={saving}
              />
            </div>

            <button type="submit" disabled={saving} className="ct-button">
              {saving ? "Saving..." : "Save Review"}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
