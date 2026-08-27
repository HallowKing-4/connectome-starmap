# Run the star-map

The baked corpus lives in this workspace:

- `public/graph.json` — 187 real Europe PMC papers, 700 baked edges
- `public/corpus.zip` — downloadable archive
- `public/papers.json` — abstracts + reference ids
- `public/completeness.json` — data-completeness report
- `src/StarMap.tsx` — 3D hero (react-force-graph-3d + UnrealBloomPass)

```bash
cd connectome-starmap
npm install
npm run dev
```

Or serve the prebuilt folder `dist/` / `starmap-site/` with any static host.

`*.kimi.page` is Kimi Websites' own publish domain and cannot be written from this environment. Drop `dist/` onto any static host (Vercel, Pages, S3) for a public URL.
