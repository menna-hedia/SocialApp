export function extractList(res) {
  const d = res?.data;
  if (Array.isArray(d)) return d;
  if (d && typeof d === "object") {
    const firstArray = Object.values(d).find(Array.isArray);
    if (firstArray) return firstArray;
  }
  return [];
}