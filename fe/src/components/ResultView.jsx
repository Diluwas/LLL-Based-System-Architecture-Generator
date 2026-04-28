import ComponentCard from './ComponentCard';
import DiagramView from './DiagramView';
import { downloadJSON, copyToClipboard } from '../utils/storage';
import toast from 'react-hot-toast';

const PATTERN_COLORS = {
  microservices: '#2563eb', monolithic: '#475569', serverless: '#7c3aed',
  'event-driven': '#ea580c', layered: '#0d9488', hexagonal: '#db2777', default: '#4f46e5',
};

const getPatternColor = (pattern = '') => {
  const p = pattern.toLowerCase();
  return Object.entries(PATTERN_COLORS).find(([k]) => p.includes(k))?.[1] || PATTERN_COLORS.default;
};

const ResultView = ({ data, prompt }) => {
  if (!data) return null;
  const { architectural_pattern, architectural_components = [], rationale_for_components = [] } = data;

  const handleCopy = async () => { await copyToClipboard(data); toast.success('Copied to clipboard!'); };
  const handleDownload = () => { downloadJSON({ prompt, result: data }, `architecture-${Date.now()}.json`); toast.success('Downloaded!'); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} className="animate-fade-in">

      {/* Pattern */}
      <div className="card animate-slide-up">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 className="section-title"><span>🏛️</span> Architectural Pattern</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleCopy} className="btn-secondary">📋 Copy JSON</button>
            <button onClick={handleDownload} className="btn-secondary">⬇️ Download</button>
          </div>
        </div>
        {architectural_pattern ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ background: getPatternColor(architectural_pattern), color: 'white', fontWeight: 700, fontSize: 14, padding: '8px 20px', borderRadius: 10 }}>
              {architectural_pattern}
            </span>
            <span style={{ fontSize: 13, color: '#94a3b8' }}>Recommended pattern for your system</span>
          </div>
        ) : <p style={{ color: '#94a3b8', fontSize: 13 }}>No pattern returned.</p>}
      </div>

      {/* Diagram */}
      <DiagramView data={data} />

      {/* Components */}
      {architectural_components.length > 0 && (
        <div className="card animate-slide-up">
          <h2 className="section-title" style={{ marginBottom: 20 }}>
            <span>🧩</span> Architectural Components
            <span style={{ marginLeft: 8, fontSize: 12, fontWeight: 400, background: '#eef2ff', color: '#4f46e5', padding: '2px 10px', borderRadius: 9999 }}>
              {architectural_components.length}
            </span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16 }}>
            {architectural_components.map((component, i) => (
              <ComponentCard key={i} component={component} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Rationale */}
      {rationale_for_components.length > 0 && (
        <div className="card animate-slide-up">
          <h2 className="section-title" style={{ marginBottom: 20 }}><span>💡</span> Design Rationale</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {rationale_for_components.map((item, i) => (
              <div key={i} className="animate-slide-up" style={{ display: 'flex', gap: 16, padding: 16, borderRadius: 12, background: '#f8fafc', border: '1px solid #e2e8f0', animationDelay: `${i * 50}ms` }}>
                <div style={{ width: 32, height: 32, background: '#eef2ff', color: '#4f46e5', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                  {i + 1}
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{item.component || 'Component'}</p>
                  <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{item.rationale || 'No rationale provided.'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultView;
