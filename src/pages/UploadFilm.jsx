import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../components/Layout";
import { projectService } from "../services/projectService";
import { validateRequired } from "../utils/validators";

export default function UploadFilm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    genre: "",
    posterUrl: "",
  });
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files?.[0];
    setVideoFile(file || null);
    setErrors((prev) => ({ ...prev, video: "" }));
  };

  const validate = () => {
    const next = {};
    if (!validateRequired(form.title)) next.title = "Title is required";
    if (!validateRequired(form.description))
      next.description = "Description is required";
    if (!validateRequired(form.genre)) next.genre = "Genre is required";
    if (!videoFile) next.video = "Video file is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const fd = new FormData();
      fd.append("title", form.title.trim());
      fd.append("description", form.description.trim());
      fd.append("genre", form.genre.trim());
      fd.append("video", videoFile);
      if (form.posterUrl?.trim()) fd.append("posterUrl", form.posterUrl.trim());

      const { data } = await projectService.create(fd);
      toast.success("Film uploaded successfully! 🎬");
      navigate(`/films/${data.project._id}`);
    } catch (error) {
      toast.error(error.userMessage || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Upload Film</h1>
        <p className="text-gray-400 mb-8">
          Submit your film for the festival. Video will be uploaded to our servers.
        </p>

        <form onSubmit={handleSubmit} className="ct-card p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title *
            </label>
            <input
              name="title"
              type="text"
              placeholder="Film title"
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
              Description *
            </label>
            <textarea
              name="description"
              placeholder="Brief description of your film"
              className="ct-input min-h-[100px] resize-y"
              value={form.description}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.description && (
              <p className="text-red-400 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Genre *
            </label>
            <input
              name="genre"
              type="text"
              placeholder="e.g. Drama, Documentary, Short"
              className="ct-input"
              value={form.genre}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.genre && (
              <p className="text-red-400 text-sm mt-1">{errors.genre}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Video File *
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white file:cursor-pointer hover:file:bg-indigo-500"
            />
            {errors.video && (
              <p className="text-red-400 text-sm mt-1">{errors.video}</p>
            )}
            {videoFile && (
              <p className="text-gray-500 text-sm mt-1">
                Selected: {videoFile.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Poster URL (optional)
            </label>
            <input
              name="posterUrl"
              type="url"
              placeholder="https://..."
              className="ct-input"
              value={form.posterUrl}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button type="submit" disabled={loading} className="ct-button flex-1">
              {loading ? "Uploading..." : "Upload Film"}
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
      </div>
    </Layout>
  );
}
