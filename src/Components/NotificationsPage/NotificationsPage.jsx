import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  LuBell, LuCheckCheck, LuHeart, LuMessageCircle, LuShare2, LuUserPlus, LuAtSign,
} from "react-icons/lu";
import { toast } from "react-toastify";
import LoaderScreen from "../LoaderScreen/LoaderScreen";
import {
  BASE,
  authHeaders,
  useNotifications,
  getNotificationList,
  isNotificationRead,
} from "../../hooks/useNotifications";

const FALLBACK_AVATAR = "https://avatars.githubusercontent.com/u/86160567?s=200&v=4";

function timeAgo(dateString) {
  if (!dateString) return "";
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const units = [
    ["y", 31536000], ["mo", 2592000], ["d", 86400], ["h", 3600], ["m", 60],
  ];
  for (const [label, size] of units) {
    if (seconds >= size) return `${Math.floor(seconds / size)}${label} ago`;
  }
  return "just now";
}

const getId = (v) => (v && typeof v === "object" ? v._id || v.id : v);

// types seen in the API: like_post, comment_post, follow_user, mention_user
function normalize(n) {
  const sender = n.actor || n.sender || n.from || n.user || {};
  const senderId = getId(sender);

  const type = String(n.type || "").toLowerCase();
  const entityType = String(n.entityType || "").toLowerCase();
  const isFollow = type.includes("follow");

  // the post id: a direct post field first, then entityId when the entity is a post
  const postId = isFollow
    ? null
    : getId(n.post) ||
      n.postId ||
      n.meta?.postId ||
      n.metadata?.postId ||
      n.data?.postId ||
      (entityType === "post" ? n.entityId || getId(n.entity) : null);

  const name = sender.name || "Someone";
  const texts = {
    like: `${name} liked your post`,
    comment: `${name} commented on your post`,
    reply: `${name} replied to your comment`,
    share: `${name} shared your post`,
    follow: `${name} started following you`,
    mention: `${name} mentioned you`,
  };
  const key = Object.keys(texts).find((k) => type.includes(k));

  let icon = LuBell;
  if (type.includes("like")) icon = LuHeart;
  else if (type.includes("comment") || type.includes("reply")) icon = LuMessageCircle;
  else if (type.includes("share")) icon = LuShare2;
  else if (isFollow) icon = LuUserPlus;
  else if (type.includes("mention")) icon = LuAtSign;

  const to = isFollow
    ? senderId ? `/user/${senderId}` : null
    : postId
    ? `/postDetails/${postId}`
    : senderId
    ? `/user/${senderId}`
    : null;

  return {
    id: n._id || n.id,
    sender,
    icon,
    to,
    isRead: isNotificationRead(n),
    createdAt: n.createdAt,
    text: n.message || n.text || n.content || (key ? texts[key] : `${name} sent you a notification`),
  };
}

export default function NotificationsPage() {
  const [tab, setTab] = useState("all");
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useNotifications();

  const raw = getNotificationList(data);

  const notifications = raw.map(normalize).filter((n) => n.id);
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const visible = tab === "unread" ? notifications.filter((n) => !n.isRead) : notifications;

  // refreshes both the list and the badge in the sidebar
  const refreshNotifications = () => {
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
    queryClient.invalidateQueries({ queryKey: ["notificationsUnreadCount"] });
  };

  const { mutate: markRead } = useMutation({
    mutationFn: (id) => axios.patch(`${BASE}/notifications/${id}/read`, {}, authHeaders()),
    onSuccess: refreshNotifications,
  });

  const { mutate: markAllRead, isPending: markingAll } = useMutation({
    mutationFn: () => axios.patch(`${BASE}/notifications/read-all`, {}, authHeaders()),
    onSuccess: () => {
      refreshNotifications();
      toast.success("All notifications marked as read", {
        position: "top-right", autoClose: 1000,
      });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Could not update notifications", {
        position: "top-right", autoClose: 1000,
      });
    },
  });

  if (isLoading) return <LoaderScreen />;

  if (isError) {
    return (
      <p className="rounded-xl bg-white p-6 text-center text-red-500 shadow-md">
        Could not load your notifications.
      </p>
    );
  }

  const tabClass = (name) =>
    `rounded-full px-4 py-1.5 text-sm font-medium transition ${
      tab === name ? "bg-indigo-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`;

  return (
    <div className="w-full pb-10">
      {/* header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white p-6 shadow-md">
        <div className="flex items-center gap-3">
          <LuBell className="text-3xl text-indigo-500" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
            <p className="text-sm text-gray-500">{unreadCount} unread</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => setTab("all")} className={tabClass("all")}>
            All
          </button>
          <button type="button" onClick={() => setTab("unread")} className={tabClass("unread")}>
            Unread
          </button>
          <button
            type="button"
            onClick={() => markAllRead()}
            disabled={unreadCount === 0 || markingAll}
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium text-indigo-500 transition hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LuCheckCheck className="text-lg" />
            Mark all as read
          </button>
        </div>
      </div>

      {/* list */}
      {visible.length === 0 ? (
        <p className="rounded-xl bg-white p-8 text-center text-gray-500 shadow-md">
          {tab === "unread" ? "You're all caught up." : "No notifications yet."}
        </p>
      ) : (
        <ul className="divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-md">
          {visible.map((n) => {
            const Icon = n.icon;
            const content = (
              <>
                <div className="relative shrink-0">
                  <img
                    src={n.sender.photo}
                    alt={n.sender.name}
                    className="h-14 w-14 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = FALLBACK_AVATAR;
                    }}
                  />
                  <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 text-white ring-2 ring-white">
                    <Icon className="text-xs" />
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <p className={`break-words text-base ${n.isRead ? "text-gray-600" : "font-semibold text-gray-900"}`}>
                    {n.text}
                  </p>
                  <p className="mt-0.5 text-sm text-gray-400">{timeAgo(n.createdAt)}</p>
                </div>

                {!n.isRead && <span className="h-3 w-3 shrink-0 rounded-full bg-indigo-500" aria-label="Unread" />}
              </>
            );

            const rowClass = `flex items-center gap-4 p-4 transition hover:bg-gray-50 ${
              n.isRead ? "" : "bg-indigo-50/50"
            }`;

            return (
              <li key={n.id}>
                {n.to ? (
                  <Link to={n.to} onClick={() => !n.isRead && markRead(n.id)} className={rowClass}>
                    {content}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => !n.isRead && markRead(n.id)}
                    className={`${rowClass} w-full text-left`}
                  >
                    {content}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}