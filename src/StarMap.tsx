// @ts-nocheck
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { formatAuthors, getFirstAuthor } from './authors';
import { addStarfield, jewelFor, makeStarSprite } from './glow';
import { packEllipsoid } from './layout';
import { downloadZip } from './zip';

function neighborSet(links, id) {
  const s = new Set();
  for (const l of links) {
    const a = typeof l.source === 'object' ? l.source.id : l.source;
    const b = typeof l.target === 'object' ? l.target.id : l.target;
    if (a === id) s.add(b);
    if (b === id) s.add(a);
  }
  return s;
}
function escapeHtml(s) {
  return String(s || '').replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
}
function pct(n) {
  if (n == null || Number.isNaN(n)) return '—';
  return `${Math.round(n * 100)}%`;
}

export function StarMap({ data }) {
  const fgRef = useRef(null);
  const wrapRef = useRef(null);
  const bloomRef = useRef(false);
  const starfieldRef = useRef(false);
  const [hoverComm, setHoverComm] = useState(null);
  const [pinnedComm, setPinnedComm] = useState(null);
  const [selected, setSelected] = useState(null);
  const [dims, setDims] = useState({ w: window.innerWidth, h: window.innerHeight });
  const [ready, setReady] = useState(false);
  const activeComm = hoverComm != null ? hoverComm : pinnedComm;

  const graphData = useMemo(() => {
    const packed = packEllipsoid(data.nodes || [], { rx: 158, ry: 102, rz: 158, minDist: 16 });
    return { nodes: packed, links: data.links || [] };
  }, [data]);

  const communities = data.communities || [];
  const meta = data.meta || data.completeness || {};
  const neighbors = useMemo(
    () => (selected ? neighborSet(graphData.links, selected.id) : new Set()),
    [selected, graphData.links]
  );

  const nodeThreeObject = useCallback((node) => {
    const dim = activeComm != null && node.community !== activeComm;
    const hot = !!(selected && (node.id === selected.id || neighbors.has(node.id)));
    return makeStarSprite(node, { dim: dim && !hot, hot });
  }, [activeComm, selected, neighbors]);

  const linkColor = useCallback((link) => {
    const a = typeof link.source === 'object' ? link.source : null;
    const b = typeof link.target === 'object' ? link.target : null;
    if (selected && a && b) {
      const hit = a.id === selected.id || b.id === selected.id || (neighbors.has(a.id) && neighbors.has(b.id));
      if (hit) return 'rgba(232, 197, 91, 0.38)';
    }
    if (activeComm != null && a && b && a.community !== activeComm && b.community !== activeComm) {
      return 'rgba(201, 162, 39, 0.03)';
    }
    return 'rgba(201, 162, 39, 0.085)';
  }, [selected, neighbors, activeComm]);

  const linkWidth = useCallback((link) => {
    if (!selected) return 0.18;
    const a = typeof link.source === 'object' ? link.source.id : link.source;
    const b = typeof link.target === 'object' ? link.target.id : link.target;
    if (a === selected.id || b === selected.id) return 0.55;
    return 0.12;
  }, [selected]);

  useEffect(() => {
    const onResize = () => setDims({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    const blockPageScroll = (event) => { event.preventDefault(); };
    el.addEventListener('wheel', blockPageScroll, { passive: false });
    return () => el.removeEventListener('wheel', blockPageScroll);
  }, []);

  useEffect(() => { fgRef.current?.refresh(); }, [nodeThreeObject, linkColor, linkWidth]);

  const decorateScene = useCallback(() => {
    const fg = fgRef.current;
    if (!fg) return;
    const scene = fg.scene();
    if (!starfieldRef.current) {
      addStarfield(scene, 1600);
      starfieldRef.current = true;
    }
    if (!bloomRef.current && typeof fg.postProcessingComposer === 'function') {
      fg.postProcessingComposer().addPass(new UnrealBloomPass(new THREE.Vector2(dims.w, dims.h), 1.35, 0.55, 0.18));
      bloomRef.current = true;
    }
    const controls = fg.controls();
    if (controls) {
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.35;
      controls.enableDamping = true;
      controls.dampingFactor = 0.06;
    }
  }, [dims.w, dims.h]);

  const onEngineTick = useCallback(() => { if (!ready) decorateScene(); }, [ready, decorateScene]);
  const onEngineStop = useCallback(() => { decorateScene(); setReady(true); }, [decorateScene]);

  useEffect(() => {
    const fg = fgRef.current;
    if (!fg) return undefined;
    fg.cameraPosition({ x: 0, y: 40, z: 720 }, { x: 0, y: 0, z: 0 }, 0);
    const t = window.setTimeout(() => {
      fg.cameraPosition({ x: 18, y: 22, z: 268 }, { x: 0, y: 0, z: 0 }, 2400);
    }, 180);
    return () => window.clearTimeout(t);
  }, []);

  const onNodeClick = useCallback((node) => {
    setSelected(node);
    const fg = fgRef.current;
    if (fg && node) {
      fg.cameraPosition({ x: node.x, y: node.y + 8, z: node.z + 90 }, { x: node.x, y: node.y, z: node.z }, 900);
    }
  }, []);
  const onBackgroundClick = useCallback(() => setSelected(null), []);

  const downloadCorpus = useCallback(() => {
    const papers = data.nodes || [];
    const csvHeader = 'id,doi,year,title,authors,journal,cited_by_count,community,community_label,open_url';
    const csvRows = papers.map((n) => {
      const authors = Array.isArray(n.authors) ? n.authors.join('; ') : getFirstAuthor(n.authors);
      const cells = [n.id, n.doi, n.year || '', n.title, authors, n.journal || '', n.cited_by_count || 0, n.community, n.community_label || '', n.open_url || ''].map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`);
      return cells.join(',');
    });
    downloadZip('connectome-citation-corpus.zip', [
      { name: 'corpus-graph.json', text: JSON.stringify(data) },
      { name: 'completeness.json', text: JSON.stringify(meta, null, 2) },
      { name: 'papers.csv', text: [csvHeader, ...csvRows].join('\n') },
      { name: 'README.txt', text: 'CONNECTOME CITATION STAR-MAP CORPUS\n\nReal papers from Crossref. Abstracts from Europe PMC.\nEdges are DOI-matched citations inside this corpus. None are invented.\nOpen a paper at https://doi.org/{doi}\n' },
    ]);
  }, [data, meta]);

  const typeNote = meta.display_edge_types || {};

  return (
    <div className="hero" ref={wrapRef}>
      <ForceGraph3D
        ref={fgRef}
        width={dims.w}
        height={dims.h}
        graphData={graphData}
        backgroundColor="#05040a"
        nodeRelSize={1}
        nodeOpacity={1}
        nodeThreeObject={nodeThreeObject}
        nodeThreeObjectExtend={false}
        nodeLabel={(n) => `<div class="tip"><strong>${escapeHtml(n.title)}</strong><br/>${escapeHtml(getFirstAuthor(n.authors))} · ${n.year || 'n.d.'}</div>`}
        linkColor={linkColor}
        linkWidth={linkWidth}
        linkOpacity={1}
        linkDirectionalParticles={0}
        cooldownTicks={0}
        d3AlphaDecay={1}
        enableNodeDrag={false}
        enableNavigationControls
        showNavInfo={false}
        onEngineTick={onEngineTick}
        onEngineStop={onEngineStop}
        onNodeClick={onNodeClick}
        onBackgroundClick={onBackgroundClick}
      />
      <header className="hud hud-tl">
        <p className="eyebrow">Network neuroscience · brain connectomics</p>
        <h1>Citation Star-Map</h1>
        <p className="lede">{meta.n_papers || graphData.nodes.length} real papers · {meta.n_display_edges || graphData.links.length} baked edges · Louvain communities as jewel-tone stars</p>
      </header>
      <aside className="hud hud-bl">
        <div className="legend-head">
          <span>Communities</span>
          {pinnedComm != null && <button type="button" className="text-btn" onClick={() => setPinnedComm(null)}>Clear</button>}
        </div>
        <ul className="legend">
          {communities.map((c) => (
            <li key={c.id}>
              <button type="button" className={'swatch-btn' + (activeComm === c.id ? ' on' : '') + (activeComm != null && activeComm !== c.id ? ' dim' : '')} onMouseEnter={() => setHoverComm(c.id)} onMouseLeave={() => setHoverComm(null)} onClick={() => setPinnedComm((cur) => (cur === c.id ? null : c.id))}>
                <i style={{ background: jewelFor(c.id) }} />
                <em>{c.label}</em>
                <span>{c.size}</span>
              </button>
            </li>
          ))}
        </ul>
        <p className="hint">Hover dims the rest · click to pin</p>
      </aside>
      <aside className="hud hud-tr">
        <button type="button" className="download" onClick={downloadCorpus}>Download corpus<small>ZIP · JSON · CSV</small></button>
        <div className="completeness">
          <h2>Data completeness</h2>
          <dl>
            <div><dt>Abstracts</dt><dd>{pct(meta.abstract_coverage)} ({meta.n_with_abstract}/{meta.n_papers})</dd></div>
            <div><dt>Reference DOIs</dt><dd>{pct(meta.reference_doi_coverage)} ({meta.n_with_reference_dois}/{meta.n_papers})</dd></div>
            <div><dt>Direct citations in corpus</dt><dd>{meta.n_direct_citation_edges_in_corpus ?? '—'}</dd></div>
            <div><dt>Co-citation pairs</dt><dd>{meta.n_cocitation_pairs_in_corpus ?? '—'}</dd></div>
            <div><dt>Displayed edges</dt><dd>{meta.n_display_edges} · direct {typeNote.direct_citation || 0}{typeNote.cocitation ? ` · co-cite ${typeNote.cocitation}` : ''}{typeNote.keyword_cooccurrence ? ` · keyword ${typeNote.keyword_cooccurrence}` : ''}</dd></div>
          </dl>
          <p className="fine">Edges computed at build time from Crossref reference lists. Nothing is invented. Keyword co-occurrence is a documented fallback for isolates only. Sources: Crossref + Europe PMC.</p>
        </div>
      </aside>
      {selected && (
        <article className="card">
          <button type="button" className="close" onClick={() => setSelected(null)} aria-label="Close">×</button>
          <p className="card-meta"><i style={{ background: jewelFor(selected.community) }} />{selected.community_label} · {selected.year || 'n.d.'} · cited {selected.cited_by_count?.toLocaleString?.() || selected.cited_by_count}</p>
          <h2>{selected.title}</h2>
          <p className="byline">{formatAuthors(selected.authors)}{selected.journal ? ` — ${selected.journal}` : ''}</p>
          <p className="abstract">{selected.abstract || 'No abstract recovered for this record.'}</p>
          <a className="open" href={selected.open_url || selected.url} target="_blank" rel="noreferrer">Open paper</a>
        </article>
      )}
      <footer className="hud hud-br">
        <span>Orbit · zoom · pan · true 3D</span>
        <span className="gold-key">gold threads = citations, kept faint</span>
      </footer>
    </div>
  );
}
