/**
 * Authors arrive as a string, a string[], or rarely objects.
 * Always return a human first-author label. Never throw.
 */
export function getFirstAuthor(authors) {
  if (authors == null || authors === "") return "Unknown";

  if (Array.isArray(authors)) {
    if (authors.length === 0) return "Unknown";
    return getFirstAuthor(authors[0]);
  }

  if (typeof authors === "string") {
    const first = authors.split(",")[0].trim();
    return first || "Unknown";
  }

  if (typeof authors === "object") {
    const label =
      authors.name ||
      authors.fullName ||
      authors.display_name ||
      [authors.lastName, authors.initials || authors.firstName]
        .filter(Boolean)
        .join(" ");
    return (label && String(label).trim()) || "Unknown";
  }

  return String(authors);
}

export function formatAuthors(authors, authorString) {
  if (Array.isArray(authors) && authors.length) {
    const names = authors.map((a) =>
      typeof a === "string" ? a : getFirstAuthor(a)
    );
    if (names.length <= 3) return names.join(", ");
    return `${names.slice(0, 3).join(", ")} et al.`;
  }
  if (typeof authorString === "string" && authorString.trim()) {
    const parts = authorString.split(",").map((s) => s.trim()).filter(Boolean);
    if (parts.length <= 3) return parts.join(", ");
    return `${parts.slice(0, 3).join(", ")} et al.`;
  }
  return getFirstAuthor(authors);
}
