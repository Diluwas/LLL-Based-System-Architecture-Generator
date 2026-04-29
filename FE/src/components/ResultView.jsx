import ComponentCard from './ComponentCard';
import DiagramView from './DiagramView';
import { downloadJSON, copyToClipboard } from '../utils/storage';
import toast from 'react-hot-toast';

const PATTERNS = {
  microservices:     { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.25)',  icon: '🔷' },
  monolithic:        { color: '#64748b', bg: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.25)', icon: '🧱' },
  serverless:        { color: '#a855f7', bg: 'rgba(168,85,247,0.1)',  border: 'rgba(168,85,247,0.25)',  icon: '☁️' },
  'event-driven':    { color: '#f97316', bg: 'rgba(249,115,22,0.1)',  border: 'rgba(249,115,22,0.25)',  icon: '⚡' },
  layered:           { color: '#14b8a6', bg: 'rgba(20,184,166,0.1)',  border: 'rgba(20,184,166,0.25)',  icon: '📚' },
  hexagonal:         { color: '#ec4899', bg: 'rgba(236,72,153,0.1)',  border: 'rgba(236,72,153,0.25)',  icon: '⬡' },
  'pipe-and-filter': { color: '#06b6d4', bg: 'rgba(6,182,212,0.1)',   border: 'rgba(6,182,212,0.25)',   icon: '🔗' },
  'client-server':   { color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)',  border: 'rgba(139,92,246,0.25)',  icon: '🖥️' },
  mvc:               { color: '#10b981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.25)',  icon: '🎯' },
  cqrs:              { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.25)',  icon: '📊' },
  default:           { color: '#6366f1', bg: 'rgba(99,102,241,0.1)',  border: 'rgba(99,102,241,0.25)',  icon: '🏛️' },
};

const getPattern = (p = '') => PATTERNS[Object.keys(PATTERNS).find(k => p.toLowerCase().includes(k)) || 'default'];

const Tag = ({ count }) => (
  <span style={{ fontSize: 11, fontWeight: 700, background: 'var(--bg-tag)', color: 'var(--text-accent)', border: '1px solid var(--border)', padding: '2px 10px', borderRadius: 99 }}>
    {count}
  </span>
);

const ResultView = ({ data, prompt }) => {
  if (!data) return null;
  const result = data?.architectural_pattern ? data : (data?.data || data);
  const { 
    architectural_pattern, 
    pattern_rationale,
    architectural_components = [], 
    connections = []
  } = result;
  const pcfg = getPattern(architectural_pattern);

  const handleCopy = async () => {
    await copyToClipboard(result);
    toast.success('Copied to clipboard!');
  };
  const handleDownload = () => {
    downloadJSON({ prompt, result }, `architecture-${Date.now()}.json`);
    toast.success('Downloaded!');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} className="animate-fade-in">

      {/* ── Pattern & Rationale ── */}
      <div className="card animate-slide-up">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
          <h2 className="section-title"><span>🏛️</span> Architectural Pattern</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleCopy} className="btn-secondary">📋 Copy JSON</button>
            <button onClick={handleDownload} className="btn-secondary">⬇️ Download</button>
          </div>
        </div>
        {architectural_pattern ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <div className="pattern-badge" style={{ background: pcfg.bg, border: `1px solid ${pcfg.border}`, color: pcfg.color }}>
                <span>{pcfg.icon}</span> {architectural_pattern}
              </div>
              <span style={{ fontSize: 13, color: 'var(--text-3)' }}>Recommended pattern for your system</span>
            </div>
            
            {/* Pattern Rationale */}
            {pattern_rationale && (
              <div style={{
                background: 'var(--bg-rationale, rgba(99,102,241,0.05))',
                border: '1px solid var(--border)',
                borderRadius: 12,
                padding: '16px 20px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 16 }}>💡</span>
                  <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-1)' }}>Why this pattern?</span>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.7, margin: 0 }}>
                  {pattern_rationale}
                </p>
              </div>
            )}
          </div>
        ) : (
          <p style={{ color: 'var(--text-4)', fontSize: 13 }}>No pattern returned.</p>
        )}
      </div>

      {/* ── Diagram ── */}
      <DiagramView data={result} />

      {/* ── Connections (if available) ── */}
      {connections.length > 0 && (
        <div className="card animate-slide-up">
          <h2 className="section-title" style={{ marginBottom: 22 }}>
            <span>🔗</span> Component Connections <Tag count={connections.length} />
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: 12 
          }}>
            {connections.map((conn, i) => (
              <div
                key={i}
                className="animate-slide-up"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  borderRadius: 10,
                  background: 'var(--bg-rationale)',
                  border: '1px solid var(--border)',
                  animationDelay: `${i * 30}ms`,
                }}
              >
                <span style={{ 
                  fontSize: 12, 
                  fontWeight: 600, 
                  color: 'var(--text-accent)',
                  background: 'var(--bg-tag)',
                  padding: '4px 10px',
                  borderRadius: 6,
                  whiteSpace: 'nowrap',
                }}>
                  {conn.from}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: 16 }}>→</span>
                <span style={{ 
                  fontSize: 12, 
                  fontWeight: 600, 
                  color: 'var(--text-accent)',
                  background: 'var(--bg-tag)',
                  padding: '4px 10px',
                  borderRadius: 6,
                  whiteSpace: 'nowrap',
                }}>
                  {conn.to}
                </span>
                {conn.label && (
                  <span style={{ 
                    fontSize: 11, 
                    color: 'var(--text-muted)',
                    marginLeft: 'auto',
                    fontStyle: 'italic',
                  }}>
                    {conn.label}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Components with Rationale ── */}
      {architectural_components.length > 0 && (
        <div className="card animate-slide-up">
          <h2 className="section-title" style={{ marginBottom: 22 }}>
            <span>🧩</span> Architectural Components <Tag count={architectural_components.length} />
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {architectural_components.map((c, i) => (
              <ComponentCard key={i} component={c} index={i} showRationale={true} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultView;
