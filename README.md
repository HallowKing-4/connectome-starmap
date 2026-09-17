# Citation Star-Map

Fully static 3D citation star-map of real network-neuroscience / connectomics papers.

- Nodes: Crossref works with DOIs
- Edges: baked at build time from Crossref reference lists (direct citation + co-citation). Keyword fallback only for isolates.
- Renderer: react-force-graph-3d + THREE.Sprite glows + UnrealBloomPass

```bash
npm install
npm run dev
```
