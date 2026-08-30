import type { AuthorInput } from "./types";

export function normalizeAuthors(authors: AuthorInput, fallback = ""): string[] {
  if (Array.isArray(authors)) {
    return authors.map((a) => String(a).trim()).filter(Boolean);
  }
  if (typeof authors === "string" && authors.trim()) {
    return authors
      .split(/\s*;\s*|\s+and\s+|, \s+(?=[A-Z])/)
      .map((a) => a.trim())
      .filter(Boolean);
  }
  if (fallback.trim()) {
    return normalizeAuthors(fallback);
  }
  return [];
}

export function getFirstAuthor(authors: AuthorInput, fallback = ""): string {
  const list = normalizeAuthors(authors, fallback);
  return list[0] || "Unknown";
}

export function formatAuthorList(authors: AuthorInput, fallback = ""): string {
  const list = normalizeAuthors(authors, fallback);
  if (list.length === 0) return "Unknown authors";
  if (list.length === 1) return list[0];
  if (list.length === 2) return `${list[0]} & ${list[1]}`;
  return `${list[0]} et al.`;
}
