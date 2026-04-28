import { formatDistanceToNow } from '../utils/time';

const HistoryPanel = ({ history, onSelect, onClear }) => {
  if (!history.length) return null;

  return (
    <div className="card animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 className="section-title">
          <span style={{ fontSize: 18 }}>🕐</span>
          Recent Prompts
          <span style={{ fontSize: 12, fontWeight: 700, background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.25)', padding: '2px 8px', borderRadius: 9999 }}>
            {history.length}
          </span>
        </h2>
        <button onClick={onClear} className="btn-ghost">🗑️ Clear all</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {history.map((item, i) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            style={{
              textAlign: 'left', padding: '14px 18px',
              borderRadius: 14,
              background: 'rgba(99,102,241,0.05)',
              border: '1px solid rgba(99,102,241,0.12)',
              cursor: 'pointer', transition: 'all 0.2s',
              width: '100%',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.12)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,102,241,0.05)'; e.currentTarget.style.borderColor = 'rgba(99,102,241,0.12)'; }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: 'rgba(99,102,241,0.2)',
                border: '1px solid rgba(99,102,241,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, color: '#818cf8', fontWeight: 700, flexShrink: 0,
              }}>
                {i + 1}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.prompt}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>🕐 {formatDistanceToNow(item.timestamp)}</span>
                  {item.result?.data?.architectural_pattern && (
                    <span style={{ fontSize: 11, padding: '2px 8px', background: 'rgba(99,102,241,0.15)', color: '#818cf8', borderRadius: 6, border: '1px solid rgba(99,102,241,0.2)', fontWeight: 600, textTransform: 'capitalize' }}>
                      {item.result.data.architectural_pattern}
                    </span>
                  )}
                </div>
              </div>
            <span style={{ fontSize: 16, color: 'var(--text-muted)', flexShrink: 0 }}>→</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HistoryPanel;
