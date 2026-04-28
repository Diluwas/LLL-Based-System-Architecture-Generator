import { formatDistanceToNow } from '../utils/time';

const HistoryPanel = ({ history, onSelect, onClear }) => {
  if (!history.length) return null;
  return (
    <div className="card animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 className="section-title"><span>🕐</span> Recent Prompts</h2>
        <button onClick={onClear} style={{ fontSize: 12, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>Clear all</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {history.map((item) => (
          <button key={item.id} onClick={() => onSelect(item)}
            style={{ textAlign: 'left', padding: 12, borderRadius: 12, background: '#f8fafc', border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#eef2ff'; e.currentTarget.style.borderColor = '#c7d2fe'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
          >
            <p style={{ fontSize: 13, fontWeight: 500, color: '#1e293b', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.prompt}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 11, color: '#94a3b8' }}>{formatDistanceToNow(item.timestamp)}</span>
              {item.result?.data?.architectural_pattern && (
                <span style={{ fontSize: 11, padding: '2px 8px', background: '#eef2ff', color: '#4f46e5', borderRadius: 9999 }}>
                  {item.result.data.architectural_pattern}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HistoryPanel;
