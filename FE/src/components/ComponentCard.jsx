const TYPES = {
  service:            { bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.25)',  text: '#3b82f6',  badge: 'rgba(59,130,246,0.12)',  badgeText: '#60a5fa',  icon: '⚙️' },
  database:           { bg: 'rgba(34,197,94,0.08)',  border: 'rgba(34,197,94,0.22)',   text: '#22c55e',  badge: 'rgba(34,197,94,0.12)',   badgeText: '#4ade80',  icon: '🗄️' },
  cache:              { bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.22)',   text: '#ef4444',  badge: 'rgba(239,68,68,0.12)',   badgeText: '#f87171',  icon: '⚡' },
  queue:              { bg: 'rgba(236,72,153,0.08)', border: 'rgba(236,72,153,0.22)',  text: '#ec4899',  badge: 'rgba(236,72,153,0.12)',  badgeText: '#f472b6',  icon: '📨' },
  message_broker:     { bg: 'rgba(236,72,153,0.08)', border: 'rgba(236,72,153,0.22)',  text: '#ec4899',  badge: 'rgba(236,72,153,0.12)',  badgeText: '#f472b6',  icon: '📬' },
  gateway:            { bg: 'rgba(234,179,8,0.08)',  border: 'rgba(234,179,8,0.22)',   text: '#eab308',  badge: 'rgba(234,179,8,0.12)',   badgeText: '#facc15',  icon: '🚪' },
  load_balancer:      { bg: 'rgba(234,179,8,0.08)',  border: 'rgba(234,179,8,0.22)',   text: '#eab308',  badge: 'rgba(234,179,8,0.12)',   badgeText: '#facc15',  icon: '⚖️' },
  ui:                 { bg: 'rgba(244,63,94,0.08)',  border: 'rgba(244,63,94,0.22)',   text: '#f43f5e',  badge: 'rgba(244,63,94,0.12)',   badgeText: '#fb7185',  icon: '🖥️' },
  frontend:           { bg: 'rgba(168,85,247,0.08)', border: 'rgba(168,85,247,0.22)',  text: '#a855f7',  badge: 'rgba(168,85,247,0.12)',  badgeText: '#c084fc',  icon: '🖼️' },
  backend:            { bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.22)',  text: '#f97316',  badge: 'rgba(249,115,22,0.12)',  badgeText: '#fb923c',  icon: '🔧' },
  storage:            { bg: 'rgba(20,184,166,0.08)', border: 'rgba(20,184,166,0.22)',  text: '#14b8a6',  badge: 'rgba(20,184,166,0.12)',  badgeText: '#2dd4bf',  icon: '📦' },
  cdn:                { bg: 'rgba(20,184,166,0.08)', border: 'rgba(20,184,166,0.22)',  text: '#14b8a6',  badge: 'rgba(20,184,166,0.12)',  badgeText: '#2dd4bf',  icon: '🌐' },
  auth:               { bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.22)',  text: '#6366f1',  badge: 'rgba(99,102,241,0.12)',  badgeText: '#818cf8',  icon: '🔐' },
  container:          { bg: 'rgba(6,182,212,0.08)',  border: 'rgba(6,182,212,0.22)',   text: '#06b6d4',  badge: 'rgba(6,182,212,0.12)',   badgeText: '#22d3ee',  icon: '🐳' },
  serverless_function:{ bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.22)',  text: '#8b5cf6',  badge: 'rgba(139,92,246,0.12)',  badgeText: '#a78bfa',  icon: 'λ' },
  search_engine:      { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.22)',  text: '#f59e0b',  badge: 'rgba(245,158,11,0.12)',  badgeText: '#fbbf24',  icon: '🔍' },
  monitoring:         { bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.22)',  text: '#10b981',  badge: 'rgba(16,185,129,0.12)',  badgeText: '#34d399',  icon: '📊' },
  logging:            { bg: 'rgba(100,116,139,0.08)',border: 'rgba(100,116,139,0.22)', text: '#64748b',  badge: 'rgba(100,116,139,0.12)', badgeText: '#94a3b8',  icon: '📝' },
  default:            { bg: 'rgba(100,116,139,0.08)',border: 'rgba(100,116,139,0.22)', text: '#64748b',  badge: 'rgba(100,116,139,0.12)', badgeText: '#94a3b8',  icon: '🔷' },
};

const getCfg = (type = '') => {
  const t = type.toLowerCase();
  return TYPES[Object.keys(TYPES).find(k => t.includes(k)) || 'default'];
};

const ComponentCard = ({ component, index, showRationale = false }) => {
  const cfg = getCfg(component.type);

  return (
    <div
      className="card card-hover animate-slide-up"
      style={{ animationDelay: `${index * 60}ms`, background: cfg.bg, borderColor: cfg.border, padding: 20 }}
    >
      {/* Top */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10, gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <div style={{ width: 36, height: 36, borderRadius: 11, background: cfg.badge, border: `1px solid ${cfg.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>
            {cfg.icon}
          </div>
          <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-1)', lineHeight: 1.3, wordBreak: 'break-word' }}>
            {component.name || 'Unnamed'}
          </span>
        </div>
        <span className="badge" style={{ background: cfg.badge, color: cfg.badgeText, border: `1px solid ${cfg.border}`, flexShrink: 0, textTransform: 'capitalize' }}>
          {component.type || 'Component'}
        </span>
      </div>

      {/* Description */}
      <p style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.65, marginBottom: component.responsibility ? 12 : 0 }}>
        {component.description || 'No description provided.'}
      </p>

      {/* Responsibility */}
      {component.responsibility && (
        <>
          <div style={{ height: 1, background: `linear-gradient(90deg, ${cfg.border}, transparent)`, margin: '10px 0' }} />
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: cfg.text, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }}>
              Responsibility
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.6 }}>{component.responsibility}</p>
          </div>
        </>
      )}

      {/* Rationale - shown when showRationale prop is true */}
      {showRationale && component.rationale && (
        <>
          <div style={{ height: 1, background: `linear-gradient(90deg, ${cfg.border}, transparent)`, margin: '10px 0' }} />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
              <span style={{ fontSize: 12 }}>💡</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: cfg.text, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Why this component?
              </span>
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.6, fontStyle: 'italic' }}>
              {component.rationale}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default ComponentCard;
