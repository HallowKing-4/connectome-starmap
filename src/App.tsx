import { useEffect, useState } from "react";
import { StarMap } from "./StarMap";

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    const urls = ["./data/graph.json", "./corpus-graph.json"];
    (async () => {
      let last = "no url tried";
      for (const url of urls) {
        try {
          const res = await fetch(url);
          if (!res.ok) { last = url + " " + res.status; continue; }
          const payload = await res.json();
          if (alive) setData(payload);
          return;
        } catch (err) {
          last = err instanceof Error ? err.message : String(err);
        }
      }
      if (alive) setError(last);
    })();
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
