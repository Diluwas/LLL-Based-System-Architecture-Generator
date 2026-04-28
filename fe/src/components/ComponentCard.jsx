const TYPE_COLORS = {
  service:  { bg: '#dbeafe', text: '#1d4ed8' },
  database: { bg: '#dcfce7', text: '#15803d' },
  frontend: { bg: '#f3e8ff', text: '#7e22ce' },
  backend:  { bg: '#ffedd5', text: '#c2410c' },
  gateway:  { bg: '#fef9c3', text: '#a16207' },
  cache:    { bg: '#fee2e2', text: '#b91c1c' },
  queue:    { bg: '#fce7f3', text: '#be185d' },
  storage:  { bg: '#ccfbf1', text: '#0f766e' },
  auth:     { bg: '#e0e7ff', text: '#4338ca' },
  default:  { bg: '#f1f5f9', text: '#475569' },
};

const TYPE_ICONS = {
  service: '⚙️', database: '🗄️', frontend: '🖥️', backend: '🔧',
  gateway: '🚪', cache: '⚡', queue: '📨', storage: '📦', auth: '🔐', default: '🔷',
};

const getTypeKey = (type = '') => {
  const t = type.toLowerCase();
  return Object.keys(TYPE_COLORS).find(k => t.includes(k)) || 'default';
};

const ComponentCard = ({ component, index }) => {
  const typeKey = getTypeKey(component.type);
  const colors = TYPE_COLORS[typeKey];
  const icon = TYPE_ICONS[typeKey];

  return (
    <div className="card card-hover animate-slide-up" style={{ animationDelay: `${index * 60}ms` }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>{icon}</span>
          <span style={{ fontWeight: 700, fontSize: 14 }}>{component.name || 'Unnamed'}</span>
        </div>
        <span className="badge" style={{ background: colors.bg, color: colors.text, marginLeft: 8, flexShrink: 0 }}>
          {component.type || 'Component'}
        </span>
      </div>
      <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>
        {component.description || 'No description provided.'}
      </p>
    </div>
  );
};

export default ComponentCard;
