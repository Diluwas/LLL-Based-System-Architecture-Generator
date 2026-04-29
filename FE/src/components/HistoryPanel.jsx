import { formatDistanceToNow } from '../utils/time';

const HistoryPanel = ({ history, onSelect, onClear }) => {
  if (!history.length) return null;

  return (
    <div className="card animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <h2 className="section-title">
          <span>🕐</span> Recent Prompts
          <span style={{ fontSize: 11, fontWeight: 700, background: 'var(--bg-tag)', color: 'var(--text-accent)', border: '1px solid var(--border)', padding: '2px 8px', borderRadius: 99 }}>
            {history.length}
          </span>
        </h2>
        <button onClick={onClear} className="btn-ghost">🗑️ Clear all</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {history.map((item, i) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            style={{ textAlign: 'left', padding: '14px 16px', borderRadius: 14, background: 'var(--bg-rationale)', border: '1px solid var(--border)', cursor: 'pointer', transition: 'all 0.2s ease', width: '100%' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-tag)'; e.currentTarget.style.borderColor = 'var(--border-hover)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-rationale)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--bg-num)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'var(--text-accent)', fontWeight: 800, flexShrink: 0 }}>
                {i + 1}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-1)', marginBottom: 5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.prompt}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-4)' }}>🕐 {formatDistanceToNow(item.timestamp)}</span>
                  {item.result?.data?.architectural_pattern && (
                    <span style={{ fontSize: 11, padding: '2px 8px', background: 'var(--bg-tag)', color: 'var(--text-accent)', borderRadius: 6, border: '1px solid var(--border)', fontWeight: 600, textTransform: 'capitalize' }}>
                      {item.result.data.architectural_pattern}
                    </span>
                  )}
                </div>
              </div>
              <span style={{ fontSize: 14, color: 'var(--text-4)', flexShrink: 0 }}>→</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HistoryPanel;
