import { useEffect, useState } from "react";
import { StarMap } from "./StarMap";
import type { GraphPayload, PaperNode } from "./types";

async function loadGraph(): Promise<GraphPayload> {
  const local = await fetch("./data/graph.json");
  if (local.ok) return local.json();
  const names = ["meta.json", "links.json", "nodes-0.json", "nodes-1.json", "nodes-2.json", "nodes-3.json"];
  const [meta, links, n0, n1, n2, n3] = await Promise.all(
    names.map((name) => fetch("./data/" + name).then((r) => {
      if (!r.ok) throw new Error(name + " " + r.status);
      return r.json();
    }))
  );
  return {
    nodes: [...n0, ...n1, ...n2, ...n3] as PaperNode[],
    links,
    communities: meta.communities,
    completeness: meta.completeness,
  };
}

export default function App() {
  const [data, setData] = useState<GraphPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    loadGraph()
      .then((payload) => { if (alive) setData(payload); })
      .catch((err: unknown) => { if (alive) setError(err instanceof Error ? err.message : "load failed"); });
    return () => { alive = false; };
  }, []);
  if (error) {
    return (
      <div className="fatal">
        <div className="fatal-card">
          <p className="kicker">Corpus</p>
          <h1>The map could not be read.</h1>
          <p>Baked graph JSON failed to load. {error}</p>
        </div>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="fatal">
        <div className="fatal-card quiet">
          <p className="kicker">Citation star-map</p>
          <h1>Lighting the connectome…</h1>
          <p>Baking was already done. This is just the JSON crossing the wire.</p>
        </div>
      </div>
    );
  }
  return <StarMap data={data} />;
}
