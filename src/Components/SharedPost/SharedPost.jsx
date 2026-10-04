import { Link } from "react-router-dom";

const FALLBACK_AVATAR = "https://avatars.githubusercontent.com/u/86160567?s=200&v=4";

export default function SharedPost({ original, clamp = false }) {
  if (!original) return null;

  return (
    <div className="my-3 min-h-0 overflow-hidden rounded-xl border border-gray-200 p-3">
      <Link to={`/postDetails/${original._id}`} className="block">
        <div className="flex items-center gap-2">
          <img
            src={original.user?.photo}
            alt={original.user?.name}
            className="h-8 w-8 shrink-0 rounded-full object-cover"
            onError={(e) => (e.target.src = FALLBACK_AVATAR)}
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-gray-800">{original.user?.name}</p>
            <p className="text-xs text-gray-500">{original.createdAt?.split("T")[0]}</p>
          </div>
        </div>

        {original.body && (
          <p className={`mt-2 break-words text-sm text-gray-700 ${clamp ? "line-clamp-2" : ""}`}>
            {original.body}
          </p>
        )}

        {original.image && (
          <img
            src={original.image}
            alt={original.body || "shared post"}
            className={`mt-2 w-full rounded-lg object-cover ${clamp ? "h-24" : ""}`}
          />
        )}
      </Link>
    </div>
  );
}