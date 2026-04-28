const TYPE_CONFIG = {
  service:  { bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.25)', text: '#60a5fa', badge: 'rgba(59,130,246,0.15)', badgeText: '#93c5fd', icon: '⚙️' },
  database: { bg: 'rgba(34,197,94,0.10)',  border: 'rgba(34,197,94,0.25)',  text: '#4ade80', badge: 'rgba(34,197,94,0.15)',  badgeText: '#86efac', icon: '🗄️' },
  frontend: { bg: 'rgba(168,85,247,0.10)', border: 'rgba(168,85,247,0.25)', text: '#c084fc', badge: 'rgba(168,85,247,0.15)', badgeText: '#d8b4fe', icon: '🖥️' },
  backend:  { bg: 'rgba(249,115,22,0.10)', border: 'rgba(249,115,22,0.25)', text: '#fb923c', badge: 'rgba(249,115,22,0.15)', badgeText: '#fdba74', icon: '🔧' },
  gateway:  { bg: 'rgba(234,179,8,0.10)',  border: 'rgba(234,179,8,0.25)',  text: '#facc15', badge: 'rgba(234,179,8,0.15)',  badgeText: '#fde047', icon: '🚪' },
  cache:    { bg: 'rgba(239,68,68,0.10)',  border: 'rgba(239,68,68,0.25)',  text: '#f87171', badge: 'rgba(239,68,68,0.15)',  badgeText: '#fca5a5', icon: '⚡' },
  queue:    { bg: 'rgba(236,72,153,0.10)', border: 'rgba(236,72,153,0.25)', text: '#f472b6', badge: 'rgba(236,72,153,0.15)', badgeText: '#f9a8d4', icon: '📨' },
  storage:  { bg: 'rgba(20,184,166,0.10)', border: 'rgba(20,184,166,0.25)', text: '#2dd4bf', badge: 'rgba(20,184,166,0.15)', badgeText: '#5eead4', icon: '📦' },
  auth:     { bg: 'rgba(99,102,241,0.10)', border: 'rgba(99,102,241,0.25)', text: '#818cf8', badge: 'rgba(99,102,241,0.15)', badgeText: '#a5b4fc', icon: '🔐' },
  ui:       { bg: 'rgba(244,63,94,0.10)',  border: 'rgba(244,63,94,0.25)',  text: '#fb7185', badge: 'rgba(244,63,94,0.15)',  badgeText: '#fda4af', icon: '🖼️' },
  default:  { bg: 'rgba(100,116,139,0.10)',border: 'rgba(100,116,139,0.25)',text: '#94a3b8', badge: 'rgba(100,116,139,0.15)',badgeText: '#cbd5e1', icon: '🔷' },
};

const getConfig = (type = '') => {
  const t = type.toLowerCase();
  return TYPE_CONFIG[Object.keys(TYPE_CONFIG).find(k => t.includes(k)) || 'default'];
};

const ComponentCard = ({ component, index }) => {
  const cfg = getConfig(component.type);

  return (
    <div
      className="card card-hover animate-slide-up"
      style={{
        animationDelay: `${index * 70}ms`,
        background: cfg.bg,
        borderColor: cfg.border,
        padding: 20,
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 12,
            background: cfg.badge,
            border: `1px solid ${cfg.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, flexShrink: 0,
          }}>
            {cfg.icon}
          </div>
          <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.3 }}>
            {component.name || 'Unnamed'}
          </span>
        </div>
        <span className="badge" style={{ background: cfg.badge, color: cfg.badgeText, border: `1px solid ${cfg.border}`, marginLeft: 8, flexShrink: 0, textTransform: 'capitalize' }}>
          {component.type || 'Component'}
        </span>
      </div>

      {/* Description */}
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: component.responsibility ? 12 : 0 }}>
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
            <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{component.responsibility}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default ComponentCard;
