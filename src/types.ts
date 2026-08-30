export type AuthorInput = string | string[] | null | undefined;

export interface PaperNode {
  id: string;
  pmid: string;
  pmcid?: string | null;
  doi?: string | null;
  title: string;
  year?: number | null;
  authors: AuthorInput;
  authorString?: string;
  abstract: string;
  journal?: string | null;
  citedByCount?: number;
  keywords?: string[];
  url?: string | null;
  source?: string;
  community: number;
  degree: number;
  fullDegree?: number;
  x: number; y: number; z: number;
  fx?: number; fy?: number; fz?: number;
}

export interface GraphLink {
  source: string | PaperNode;
  target: string | PaperNode;
  kind: string;
  kinds?: string[];
  weight: number;
}

export interface Community {
  id: number;
  label: string;
  size: number;
}

export interface Completeness {
  papers: number;
  papersWithAbstract: number;
  papersWithDoi: number;
  papersWithResolvedReferences: number;
  papersMissingReferences: number;
  referenceCoverage: number;
  directCitationEdges: number;
  cocitationEdgesKept: number;
  keywordFallbackUsed: boolean;
  keywordFallbackEdges: number;
  edgesBeforeCap: number;
  edgesAfterCap: number;
  edgesDroppedByDegreeCap: number;
  communities: number;
  communitySizes?: number[];
  perNodeDisplayDegreeCap?: number;
  source: string;
  edgePolicy: string[];
  builtAt: string;
}

export interface GraphPayload {
  nodes: PaperNode[];
  links: GraphLink[];
  communities: Community[];
  completeness: Completeness;
}
