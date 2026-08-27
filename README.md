# Citation Star-Map — Network Neuroscience

Fully static, no-backend 3D citation constellation of real brain-connectomics papers.

Papers and reference lists were retrieved from Europe PMC at build time. Edges are never invented: direct citation, co-citation, and bibliographic coupling only. Keyword fallback is declared if the citation graph is sparse (not used in the current bake). Displayed edges are capped at ~700.

```bash
python3 scripts/build_corpus.py
npm install
npm run dev
```
