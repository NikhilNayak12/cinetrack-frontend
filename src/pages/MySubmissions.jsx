import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../components/Layout";
import FilmCard from "../components/FilmCard";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import { projectService } from "../services/projectService";

export default function MySubmissions() {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const { data } = await projectService.getMy();
        setFilms(data.projects || []);
      } catch (error) {
        toast.error(error.userMessage || "Failed to load submissions");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

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
          <h1 className="text-3xl font-bold text-white">My Submissions</h1>
          <p className="text-gray-400 mt-1">Your film submissions for the festival</p>
        </div>
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
          title="No submissions yet"
          description="Upload your first film to get started."
          action={
            <Link to="/films/upload" className="ct-button inline-block w-auto px-6">
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
    </Layout>
  );
}
