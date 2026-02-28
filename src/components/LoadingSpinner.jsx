export default function LoadingSpinner({ size = "md" }) {
  const sizeClass =
    size === "sm" ? "w-5 h-5" : size === "lg" ? "w-12 h-12" : "w-8 h-8";

  return (
    <div
      className={`${sizeClass} border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin`}
      role="status"
      aria-label="Loading"
    />
  );
}
