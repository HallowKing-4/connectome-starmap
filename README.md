# Connectome Star-Map

Fully static 3D citation atlas of real network-neuroscience papers.

- Papers: Europe PMC + Crossref (never invented)
- Edges: direct citation + co-citation at build time; keyword fallback only if sparse
- Display cap: top ~700 edges by degree
- Nodes: THREE.Sprite radial glows, Louvain jewel tones
- UnrealBloomPass + starfield dust
- Download corpus.zip from /data/corpus.zip

Open `index.html` via any static host. No backend.
