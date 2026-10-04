import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { extractList } from "../utils/extractList";

export function useBookmarks() {
  return useQuery({
    queryKey: ["bookmarks"],
    staleTime: 60 * 1000,
    queryFn: () =>
      axios
        .get("https://route-posts.routemisr.com/users/bookmarks", {
          headers: { token: localStorage.getItem("token") },
        })
        .then((res) => res.data),
  });
}

export function getBookmarkedPosts(data) {
  return extractList(data);
}