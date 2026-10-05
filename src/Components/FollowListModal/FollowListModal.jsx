import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";

const BASE = "https://route-posts.routemisr.com";
const FALLBACK_AVATAR = "https://avatars.githubusercontent.com/u/86160567?s=200&v=4";

const getId = (u) => (typeof u === "string" ? u : u?._id);
const hasDetails = (u) => Boolean(u && typeof u === "object" && (u.name || u.username));

// one row; if the list only contains ids, the user's details are fetched here
function UserRow({ item, onNavigate }) {
  const id = getId(item);
  const needsFetch = !hasDetails(item);

  const { data, isLoading } = useQuery({
    queryKey: ["userProfile", id],
    enabled: needsFetch && Boolean(id),
    staleTime: 5 * 60 * 1000,
    queryFn: () =>
      axios
        .get(`${BASE}/users/${id}/profile`, {
          headers: { token: localStorage.getItem("token") },
        })
        .then((r) => r.data),
  });

  const user = needsFetch ? data?.data?.user || data?.data : item;

  if (needsFetch && isLoading) {
    return (
      <li className="flex items-center gap-3 py-3">
        <div className="h-11 w-11 animate-pulse rounded-full bg-gray-200" />
        <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
      </li>
    );
  }

  if (!user || !id) return null;

  return (
    <li>
      <Link
        to={`/user/${id}`}
        onClick={onNavigate}
        className="flex items-center gap-3 rounded-xl px-2 py-3 transition hover:bg-gray-100"
      >
        <img
          src={user.photo || FALLBACK_AVATAR}
          alt={user.name || "User"}
          className="h-11 w-11 shrink-0 rounded-full object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK_AVATAR;
          }}
        />
        <div className="min-w-0">
          <p className="truncate font-semibold text-gray-800">{user.name || user.username}</p>
          {user.username && <p className="truncate text-sm text-gray-500">@{user.username}</p>}
        </div>
      </Link>
    </li>
  );
}

// type: "followers" | "following" | null (closed)
export default function FollowListModal({ type, users = [], onClose }) {
  const title = type === "followers" ? "Followers" : "Following";
  const list = Array.isArray(users) ? users : [];

  return (
    <Modal isOpen={Boolean(type)} onOpenChange={(open) => !open && onClose()} scrollBehavior="inside" size="md">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="justify-center">
              {title} <span className="ms-2 text-gray-400">({list.length})</span>
            </ModalHeader>
            <ModalBody className="pb-6">
              {list.length === 0 ? (
                <p className="py-8 text-center text-gray-500">
                  {type === "followers" ? "No followers yet." : "Not following anyone yet."}
                </p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {list.map((item, i) => (
                    <UserRow key={getId(item) || i} item={item} onNavigate={onClose} />
                  ))}
                </ul>
              )}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}