/** Authors may arrive as a string, a string[], or objects. */
export function getFirstAuthor(authors) {
  if (authors == null || authors === '') return 'Unknown';
  if (Array.isArray(authors)) {
    if (!authors.length) return 'Unknown';
    return getFirstAuthor(authors[0]);
  }
  if (typeof authors === 'object') {
    const given = (authors.given || '').trim();
    const family = (authors.family || '').trim();
    const name = `${given} ${family}`.trim() || authors.name || authors.fullname;
    return name || 'Unknown';
  }
  const text = String(authors).trim();
  if (!text) return 'Unknown';
  const first = text.split(/\s*;\s*|\s+and\s+|,\s+(?=[A-Z])/)[0];
  return first.trim() || 'Unknown';
}

export function formatAuthors(authors, limit = 4) {
  if (authors == null || authors === '') return 'Unknown';
  const list = Array.isArray(authors) ? authors : [authors];
  const names = list.map((a) => getFirstAuthor(a)).filter(Boolean);
  if (!names.length) return 'Unknown';
  if (names.length <= limit) return names.join(', ');
  return `${names.slice(0, limit).join(', ')} +${names.length - limit}`;
}
