function looksLikePost(v) {
  return (
    v &&
    typeof v === "object" &&
    !Array.isArray(v) &&
    v._id &&
    ("body" in v || "image" in v)
  );
}

// finds the original post inside a shared post, whatever the API calls the field
export function getOriginalPost(post) {
  if (!post) return null;

  const known =
    post.sharedPost || post.originalPost || post.sharedFrom ||
    post.original || post.shared || post.post;
  if (looksLikePost(known) && known._id !== post._id) return known;

  for (const [key, value] of Object.entries(post)) {
    if (key === "user" || key === "topComment") continue;
    if (looksLikePost(value) && value._id !== post._id) return value;
  }
  return null;
}