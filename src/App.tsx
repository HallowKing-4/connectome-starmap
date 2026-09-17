import { useEffect, useState } from "react";
import { StarMap } from "./StarMap";

async function loadGraph() {
  const single = await fetch("./data/graph.json");
  if (single.ok) return single.json();
  const meta = await fetch("./data/meta.json").then((r) => {
    if (!r.ok) throw new Error("meta.json " + r.status);
    return r.json();
  });
  const links = await fetch("./data/links.json").then((r) => {
    if (!r.ok) throw new Error("links.json " + r.status);
    return r.json();
  });
  const nodes = [];
  for (let i = 0; i < 16; i++) {
    const res = await fetch("./data/nodes-" + i + ".json");
    if (!res.ok) break;
    nodes.push(...(await res.json()));
  }
  if (!nodes.length) throw new Error("no node shards found");
  return {
    nodes,
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
    return (<div className="fatal"><div><h1>Corpus failed to load</h1><p>{error}</p></div></div>);
  }
  if (!data) {
    return (<div className="fatal"><div><h1>Igniting the star-map</h1><p>Loading the baked citation corpus…</p></div></div>);
  }
  return <StarMap data={data} />;
}
