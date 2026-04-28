import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    primaryColor: '#6366f1',
    primaryTextColor: '#e2e8f0',
    primaryBorderColor: '#818cf8',
    lineColor: '#475569',
    secondaryColor: '#1e1e3f',
    tertiaryColor: '#0f0f2a',
    background: '#0a0a1a',
    mainBkg: '#1e1e3f',
    nodeBorder: '#6366f1',
    clusterBkg: '#0f0f2a',
    titleColor: '#e2e8f0',
    edgeLabelBackground: '#1e1e3f',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: '13px',
  },
  flowchart: { curve: 'basis', padding: 24, nodeSpacing: 50, rankSpacing: 60 },
  securityLevel: 'loose',
});

const buildMermaidCode = (components = []) => {
  if (!components.length) return null;
  const sanitize = (str) => str.replace(/[^a-zA-Z0-9_]/g, '_').slice(0, 20);
  const nodes = components.map((c, i) => {
    const id = sanitize(c.name || `node${i}`);
    const label = (c.name || 'Component').slice(0, 22);
    const type = (c.type || '').toLowerCase();
    if (type.includes('database') || type.includes('db')) return `  ${id}[(${label})]`;
    if (type.includes('queue') || type.includes('message')) return `  ${id}{{${label}}}`;
    if (type.includes('gateway') || type.includes('proxy')) return `  ${id}{${label}}`;
    if (type.includes('ui') || type.includes('frontend')) return `  ${id}([${label}])`;
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
  const [copied, setCopied] = useState(false);

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

  const handleCopy = async () => {
    await navigator.clipboard.writeText(diagramCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!diagramCode) return null;

  return (
    <div className="card animate-slide-up">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 className="section-title">
          <span style={{ fontSize: 20 }}>🗺️</span>
          Architecture Diagram
        </h2>
        <button onClick={handleCopy} className="btn-secondary" style={{ fontSize: 12 }}>
          {copied ? '✅ Copied!' : '📋 Copy Mermaid'}
        </button>
      </div>

      {error ? (
        /* Fallback flow */
        <div style={{ background: 'var(--diagram-bg)', borderRadius: 16, padding: 28, overflowX: 'auto', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
            {(data?.architectural_components || []).map((c, i, arr) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ background: 'var(--bg-card)', color: '#6366f1', padding: '10px 18px', border: '1px solid var(--border)', borderRadius: 12, fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {c.name}
                </div>
                {i < arr.length - 1 && (
                  <span style={{ color: '#334155', fontSize: 18, fontWeight: 300 }}>→</span>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : svgContent ? (
        <div
          ref={containerRef}
          style={{ background: 'var(--diagram-bg)', borderRadius: 16, padding: 20, overflowX: 'auto', border: '1px solid var(--border)' }}
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      ) : (
        <div className="skeleton" style={{ height: 180 }} />
      )}
    </div>
  );
};

export default DiagramView;
