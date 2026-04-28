import ComponentCard from './ComponentCard';
import DiagramView from './DiagramView';
import { downloadJSON, copyToClipboard } from '../utils/storage';
import toast from 'react-hot-toast';

const PATTERN_CONFIG = {
  microservices:  { color: '#60a5fa', bg: 'rgba(59,130,246,0.15)',  border: 'rgba(59,130,246,0.3)',  icon: '🔷' },
  monolithic:     { color: '#94a3b8', bg: 'rgba(100,116,139,0.15)', border: 'rgba(100,116,139,0.3)', icon: '🧱' },
  serverless:     { color: '#c084fc', bg: 'rgba(168,85,247,0.15)',  border: 'rgba(168,85,247,0.3)',  icon: '☁️' },
  'event-driven': { color: '#fb923c', bg: 'rgba(249,115,22,0.15)',  border: 'rgba(249,115,22,0.3)',  icon: '⚡' },
  layered:        { color: '#2dd4bf', bg: 'rgba(20,184,166,0.15)',  border: 'rgba(20,184,166,0.3)',  icon: '📚' },
  hexagonal:      { color: '#f472b6', bg: 'rgba(236,72,153,0.15)',  border: 'rgba(236,72,153,0.3)',  icon: '⬡' },
  default:        { color: '#818cf8', bg: 'rgba(99,102,241,0.15)',  border: 'rgba(99,102,241,0.3)',  icon: '🏛️' },
};

const getPatternConfig = (pattern = '') => {
  const p = pattern.toLowerCase();
  return PATTERN_CONFIG[Object.keys(PATTERN_CONFIG).find(k => p.includes(k)) || 'default'];
};

const ResultView = ({ data, prompt }) => {
  if (!data) return null;
  const result = data?.architectural_pattern ? data : (data?.data || data);
  const { architectural_pattern, architectural_components = [], rationale_for_components = [] } = result;
  const patternCfg = getPatternConfig(architectural_pattern);

  const handleCopy = async () => {
    await copyToClipboard(result);
    toast.success('Copied to clipboard!', { style: { background: '#1e1e3f', color: '#e2e8f0' } });
  };

  const handleDownload = () => {
    downloadJSON({ prompt, result }, `architecture-${Date.now()}.json`);
    toast.success('Downloaded!', { style: { background: '#1e1e3f', color: '#e2e8f0' } });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }} className="animate-fade-in">

      {/* ── Pattern ── */}
      <div className="card animate-slide-up">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 className="section-title">
            <span style={{ fontSize: 20 }}>🏛️</span>
            Architectural Pattern
          </h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleCopy} className="btn-secondary">📋 Copy JSON</button>
            <button onClick={handleDownload} className="btn-secondary">⬇️ Download</button>
          </div>
        </div>

        {architectural_pattern ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="pattern-badge" style={{ background: patternCfg.bg, border: `1px solid ${patternCfg.border}`, color: patternCfg.color }}>
              <span>{patternCfg.icon}</span>
              {architectural_pattern}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              Recommended architectural pattern for your system
            </div>
          </div>
        ) : (
          <p style={{ color: '#475569', fontSize: 13 }}>No pattern returned.</p>
        )}
      </div>

      {/* ── Diagram ── */}
      <DiagramView data={result} />

      {/* ── Components ── */}
      {architectural_components.length > 0 && (
        <div className="card animate-slide-up">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
            <h2 className="section-title">
              <span style={{ fontSize: 20 }}>🧩</span>
              Architectural Components
              <span style={{
                fontSize: 12, fontWeight: 700,
                background: 'rgba(99,102,241,0.15)',
                color: '#818cf8',
                border: '1px solid rgba(99,102,241,0.25)',
                padding: '2px 10px', borderRadius: 9999,
              }}>
                {architectural_components.length}
              </span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {architectural_components.map((component, i) => (
              <ComponentCard key={i} component={component} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* ── Rationale ── */}
      {rationale_for_components.length > 0 && (
        <div className="card animate-slide-up">
          <h2 className="section-title" style={{ marginBottom: 24 }}>
            <span style={{ fontSize: 20 }}>💡</span>
            Design Rationale
            <span style={{
              fontSize: 12, fontWeight: 700,
              background: 'rgba(99,102,241,0.15)',
              color: '#818cf8',
              border: '1px solid rgba(99,102,241,0.25)',
              padding: '2px 10px', borderRadius: 9999,
            }}>
              {rationale_for_components.length}
            </span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {rationale_for_components.map((item, i) => (
              <div style={{ display: 'flex', gap: 16, padding: '16px 20px', borderRadius: 14, background: 'var(--rationale-bg)', border: '1px solid var(--rationale-border)', transition: 'all 0.2s', animationDelay: `${i * 50}ms`, cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.1)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.25)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--rationale-bg)'; e.currentTarget.style.borderColor = 'var(--rationale-border)'; }}
              >
                <div className="num-circle">{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', marginBottom: 6 }}>
                    {item.component || 'Component'}
                  </p>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                    {item.rationale || 'No rationale provided.'}
                  </p>
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
