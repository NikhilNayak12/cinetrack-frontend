import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../components/Layout";
import LoadingSpinner from "../components/LoadingSpinner";
import { projectService } from "../services/projectService";
import { PROJECT_STATUS } from "../utils/constants";

const statusColors = {
  [PROJECT_STATUS.PENDING]: "bg-amber-500/20 text-amber-400",
  [PROJECT_STATUS.APPROVED]: "bg-emerald-500/20 text-emerald-400",
  [PROJECT_STATUS.REJECTED]: "bg-red-500/20 text-red-400",
};

export default function FilmDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [film, setFilm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const { data } = await projectService.getById(id);
        setFilm(data.project);
      } catch (error) {
        toast.error(error.userMessage || "Film not found");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id, navigate]);

  if (loading || !film) {
    return (
      <Layout>
        <div className="flex justify-center py-20">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  const statusClass = statusColors[film.status] || "bg-gray-500/20 text-gray-400";

  return (
    <Layout>
      <button
        onClick={() => navigate(-1)}
        className="text-gray-400 hover:text-white mb-6 flex items-center gap-2"
      >
        ← Back
      </button>

      <div className="ct-card overflow-hidden">
        <div className="aspect-video bg-black relative">
          {film.filmUrl ? (
            <video
              src={film.filmUrl}
              controls
              className="w-full h-full"
              poster={film.posterUrl}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl text-gray-600">
              🎬
            </div>
          )}
          <span
            className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${statusClass}`}
          >
            {film.status}
          </span>
        </div>

        <div className="p-8">
          <h1 className="text-3xl font-bold text-white mb-2">{film.title}</h1>
          <p className="text-gray-500 mb-6">{film.genre}</p>
          <p className="text-gray-300 leading-relaxed mb-6">
            {film.description}
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            {film.submittedBy && (
              <span>Submitted by {film.submittedBy.name}</span>
            )}
            {film.assignedJudges?.length > 0 && (
              <span>
                Judges: {film.assignedJudges.map((j) => j.name).join(", ")}
              </span>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
