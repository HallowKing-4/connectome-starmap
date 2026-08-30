import { useEffect, useState } from "react";
import { StarMap } from "./StarMap";
import type { GraphPayload } from "./types";

export default function App() {
  const [data, setData] = useState<GraphPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("./data/graph.json")
      .then((r) => {
        if (!r.ok) throw new Error(`graph.json ${r.status}`);
        return r.json();
      })
      .then((payload: GraphPayload) => {
        if (alive) setData(payload);
      })
      .catch((err: unknown) => {
        if (alive) setError(err instanceof Error ? err.message : "load failed");
      });
    return () => {
      alive = false;
    };
  }, []);

  if (error) {
    return (
      <div className="fatal">
        <div className="fatal-card">
          <p className="kicker">Corpus</p>
          <h1>The map could not be read.</h1>
          <p>graph.json failed to load. {error}</p>
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
