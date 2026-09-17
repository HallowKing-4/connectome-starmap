import { useEffect, useState } from "react";
import { StarMap } from "./StarMap";

async function loadGraph() {
  const single = await fetch("./data/graph.json");
  if (single.ok) return single.json();
  const names = ["meta.json", "links.json", "nodes-0.json", "nodes-1.json", "nodes-2.json", "nodes-3.json"];
  const [meta, links, n0, n1, n2, n3] = await Promise.all(
    names.map((name) =>
      fetch("./data/" + name).then((r) => {
        if (!r.ok) throw new Error(name + " " + r.status);
        return r.json();
      })
    )
  );
  return {
    nodes: [...n0, ...n1, ...n2, ...n3],
    links,
    communities: meta.communities,
    meta: meta.meta || meta.completeness,
    completeness: meta.completeness || meta.meta,
  };
}

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    loadGraph()
      .then((payload) => { if (alive) setData(payload); })
      .catch((err) => { if (alive) setError(err instanceof Error ? err.message : String(err)); });
    return () => { alive = false; };
  }, []);

  if (error) {
    return (
      <div className="fatal">
        <div>
          <h1>Corpus failed to load</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="fatal">
        <div>
          <h1>Igniting the star-map</h1>
          <p>Loading the baked citation corpus…</p>
        </div>
      </div>
    );
  }
  return <StarMap data={data} />;
}
