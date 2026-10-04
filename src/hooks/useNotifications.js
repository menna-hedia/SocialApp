import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { extractList } from "../utils/extractList";

export const BASE = "https://route-posts.routemisr.com";
export const authHeaders = () => ({ headers: { token: localStorage.getItem("token") } });

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => axios.get(`${BASE}/notifications`, authHeaders()).then((res) => res.data),
  });
}

// lightweight call used for the badge in the sidebar
export function useUnreadCount() {
  return useQuery({
    queryKey: ["notificationsUnreadCount"],
    refetchInterval: 30 * 1000,
    queryFn: () =>
      axios.get(`${BASE}/notifications/unread-count`, authHeaders()).then((res) => res.data),
  });
}

// the response shape isn't documented, so we look for a number in the usual places
export function getUnreadCount(data) {
  const d = data?.data;
  if (typeof d === "number") return d;
  if (d && typeof d === "object") {
    const n = d.unreadCount ?? d.count ?? d.unread ?? Object.values(d).find((v) => typeof v === "number");
    if (typeof n === "number") return n;
  }
  if (typeof data?.unreadCount === "number") return data.unreadCount;
  if (typeof data?.count === "number") return data.count;
  return 0;
}

export const getNotificationList = (data) => extractList(data);

export const isNotificationRead = (n) => Boolean(n?.isRead ?? n?.read ?? n?.seen ?? false);