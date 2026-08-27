import type { AuthorField } from "./types";

export function getFirstAuthor(authors: AuthorField): string {
  if (authors == null) return "Unknown";
  if (Array.isArray(authors)) {
    const first = authors.find((a) => String(a || "").trim());
    return first ? String(first).trim() : "Unknown";
  }
  const raw = String(authors).trim();
  if (!raw) return "Unknown";
  const part = raw.split(/\s*;\s*|\s+and\s+/i)[0] || raw;
  return part.replace(/\.$/, "").trim() || "Unknown";
}

export function authorLine(authors: AuthorField, extra?: string[]): string {
  const list =
    extra && extra.length
      ? extra
      : Array.isArray(authors)
        ? authors
        : String(authors || "")
            .split(/\s*;\s*/)
            .map((s) => s.trim())
            .filter(Boolean);
  if (!list.length) return "Unknown authors";
  if (list.length === 1) return list[0];
  if (list.length === 2) return `${list[0]} & ${list[1]}`;
  return `${list[0]} et al.`;
}

export function linkId(link: { source: unknown; target: unknown }): string {
  const s = typeof link.source === "object" && link.source ? (link.source as { id: string }).id : String(link.source);
  const t = typeof link.target === "object" && link.target ? (link.target as { id: string }).id : String(link.target);
  return s < t ? `${s}::${t}` : `${t}::${s}`;
}

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
