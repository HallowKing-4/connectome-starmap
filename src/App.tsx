import { useEffect, useState } from "react";
import StarMap from "./StarMap";
import type { GraphData } from "./types";

export default function App() {
  const [data, setData] = useState<GraphData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("./graph.json")
      .then((r) => {
        if (!r.ok) throw new Error(`graph.json HTTP ${r.status}`);
        return r.json();
      })
      .then((json) => {
        if (alive) setData(json as GraphData);
      })
      .catch((err) => {
        if (alive) setLoadError(err instanceof Error ? err.message : String(err));
      });
    return () => {
      alive = false;
    };
  }, []);

  if (loadError) {
    return (
      <div className="crash">
        <div className="crash-card">
          <p className="kicker">Corpus missing</p>
          <h1>Could not load the baked graph</h1>
          <p className="crash-msg">{loadError}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="boot">
        <div className="boot-inner">
          <p className="kicker">Network neuroscience</p>
          <h1>Igniting the citation star-map</h1>
          <p>Loading a baked corpus of real papers. No backend. No invented edges.</p>
        </div>
      </div>
    );
  }

  return <StarMap data={data} />;
}
