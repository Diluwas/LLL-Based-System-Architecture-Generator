import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'base',
  themeVariables: { primaryColor: '#6366f1', primaryTextColor: '#fff', lineColor: '#94a3b8', fontFamily: 'Inter, system-ui, sans-serif' },
  flowchart: { curve: 'basis', padding: 20 },
  securityLevel: 'loose',
});

const buildMermaidCode = (components = []) => {
  if (!components.length) return null;
  const sanitize = (str) => str.replace(/[^a-zA-Z0-9_]/g, '_').slice(0, 20);
  const nodes = components.map((c, i) => {
    const id = sanitize(c.name || `node${i}`);
    const label = (c.name || 'Component').slice(0, 25);
    const type = (c.type || '').toLowerCase();
    if (type.includes('database') || type.includes('db')) return `  ${id}[(${label})]`;
    if (type.includes('queue') || type.includes('message')) return `  ${id}{{${label}}}`;
    if (type.includes('gateway') || type.includes('proxy')) return `  ${id}{${label}}`;
    return `  ${id}[${label}]`;
  });
  const ids = components.map((c, i) => sanitize(c.name || `node${i}`));
  const edges = ids.slice(0, -1).map((id, i) => `  ${id} --> ${ids[i + 1]}`);
  return `flowchart LR\n${nodes.join('\n')}\n${edges.join('\n')}`;
};

const DiagramView = ({ data }) => {
  const containerRef = useRef(null);
  const [svgContent, setSvgContent] = useState('');
  const [error, setError] = useState(false);

  const diagramCode = data?.architecture_diagram_code || buildMermaidCode(data?.architectural_components);

  useEffect(() => {
    if (!diagramCode) return;
    const render = async () => {
      try {
        const id = `mermaid-${Date.now()}`;
        const { svg } = await mermaid.render(id, diagramCode);
        setSvgContent(svg);
        setError(false);
      } catch { setError(true); }
    };
    render();
  }, [diagramCode]);

  if (!diagramCode) return null;

  return (
    <div className="card animate-slide-up">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 className="section-title"><span>🗺️</span> Architecture Diagram</h2>
        <button onClick={() => navigator.clipboard.writeText(diagramCode)} className="btn-secondary" style={{ fontSize: 12 }}>
          📋 Copy Mermaid
        </button>
      </div>

      {error ? (
        <div style={{ background: '#f8fafc', borderRadius: 12, padding: 24, overflowX: 'auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
            {(data?.architectural_components || []).map((c, i, arr) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ background: '#eef2ff', color: '#4f46e5', padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 500 }}>{c.name}</div>
                {i < arr.length - 1 && <span style={{ color: '#94a3b8' }}>→</span>}
              </div>
            ))}
          </div>
        </div>
      ) : svgContent ? (
        <div ref={containerRef} style={{ background: 'white', borderRadius: 12, padding: 16, overflowX: 'auto', border: '1px solid #e2e8f0' }}
          dangerouslySetInnerHTML={{ __html: svgContent }} />
      ) : (
        <div className="skeleton" style={{ height: 160, width: '100%' }} />
      )}
    </div>
  );
};

export default DiagramView;
