import { useContext } from "react";
import { NavLink, Link } from "react-router-dom";
import { LuHouse, LuUser, LuBookmark, LuBell, LuInfo } from "react-icons/lu";
import { profileContext } from "../../context/ProfileContext";
import { useUnreadCount, getUnreadCount } from "../../hooks/useNotifications";

const FALLBACK_AVATAR = "https://avatars.githubusercontent.com/u/86160567?s=200&v=4";

const links = [
  { to: "/home", label: "Home", icon: LuHouse },
  { to: "/profile", label: "Profile", icon: LuUser },
  { to: "/about", label: "About", icon: LuInfo },
  { to: "/bookmarks", label: "Saved", icon: LuBookmark },
  { to: "/notifications", label: "Notifications", icon: LuBell },
];

export default function LeftSidebar() {
  const { profile } = useContext(profileContext) || {};
const { data: unreadData } = useUnreadCount();
const unread = getUnreadCount(unreadData);

  return (
    <aside className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-4 shadow-lg">
      {/* top: profile */}
      {profile && (
        <Link
          to="/profile"
          className="mb-3 flex items-center gap-3 rounded-xl p-2 transition hover:bg-gray-50"
        >
          <img
            src={profile.photo}
            alt={profile.name}
            className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-indigo-100"
            onError={(e) => (e.target.src = FALLBACK_AVATAR)}
          />
          <div className="min-w-0">
            <p className="truncate text-base font-bold text-gray-800">{profile.name}</p>
            <p className="truncate text-sm text-gray-500">@{profile.username}</p>
          </div>
        </Link>
      )}

      <hr className="mb-3 border-gray-100" />

      {/* middle: links take the free space */}
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-4 rounded-xl px-3 py-3.5 text-base font-medium transition
              ${isActive
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`
            }
          >
            <Icon className="text-2xl" />
            {label}{to === "/notifications" && unread > 0 && (
  <span className="ms-auto rounded-full bg-indigo-500 px-2 py-0.5 text-xs font-bold text-white">
    {unread > 99 ? "99+" : unread}
  </span>
)}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}