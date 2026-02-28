import { Link } from "react-router-dom";
import { PROJECT_STATUS } from "../utils/constants";

const statusColors = {
  [PROJECT_STATUS.PENDING]: "bg-amber-500/20 text-amber-400",
  [PROJECT_STATUS.APPROVED]: "bg-emerald-500/20 text-emerald-400",
  [PROJECT_STATUS.REJECTED]: "bg-red-500/20 text-red-400",
};

export default function FilmCard({ film }) {
  const statusClass = statusColors[film.status] || "bg-gray-500/20 text-gray-400";

  return (
    <Link
      to={`/films/${film._id}`}
      className="block group"
    >
      <div className="ct-card overflow-hidden hover:border-indigo-500/50 transition-all duration-300">
        <div className="aspect-video bg-gray-900/50 relative overflow-hidden">
          {film.posterUrl ? (
            <img
              src={film.posterUrl}
              alt={film.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl text-gray-600">
              🎬
            </div>
          )}
          <span
            className={`absolute top-2 right-2 px-2 py-0.5 rounded text-xs font-medium ${statusClass}`}
          >
            {film.status}
          </span>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-white group-hover:text-indigo-300 transition truncate">
            {film.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1">{film.genre}</p>
          {film.submittedBy && (
            <p className="text-xs text-gray-600 mt-2">
              by {film.submittedBy?.name || "Unknown"}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
