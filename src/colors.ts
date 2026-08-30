export const JEWELS = [
  "#c084fc",
  "#22d3ee",
  "#fb7185",
  "#34d399",
  "#fbbf24",
  "#818cf8",
  "#2dd4bf",
  "#f472b6",
  "#a3e635",
  "#38bdf8",
];

export const GOLD = "#e8c872";

export function communityColor(id: number): string {
  return JEWELS[((id % JEWELS.length) + JEWELS.length) % JEWELS.length];
}
