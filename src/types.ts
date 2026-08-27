export type AuthorField = string | string[] | null | undefined;

export interface GraphNode {
  id: string;
  title: string;
  year: number | null;
  authors: AuthorField;
  author_list?: string[];
  abstract: string;
  url: string;
  doi?: string | null;
  pmid?: string | null;
  journal?: string | null;
  cited_by_count: number;
  keywords: string[];
  community: number;
  community_name: string;
  color: string;
  degree: number;
  fx: number;
  fy: number;
  fz: number;
  val: number;
  x?: number;
  y?: number;
  z?: number;
}

export interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  weight: number;
  kinds: string[];
  direct: boolean;
  cocitation: number;
  coupling: number;
  keyword: number;
}

export interface CommunityMeta {
  id: number;
  name: string;
  color: string;
  size: number;
}

export interface Completeness {
  generated_at: string;
  source: string;
  node_count: number;
  edge_count: number;
  community_count: number;
  isolate_count: number;
  communities: CommunityMeta[];
  edge_construction: Record<string, unknown>;
  notes: string[];
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
  completeness: Completeness;
}
