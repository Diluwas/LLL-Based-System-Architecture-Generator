const SkeletonLoader = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} className="animate-fade-in">

    {/* Pattern */}
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div className="skeleton" style={{ height: 20, width: 200 }} />
        <div style={{ display: 'flex', gap: 8 }}>
          <div className="skeleton" style={{ height: 34, width: 110, borderRadius: 10 }} />
          <div className="skeleton" style={{ height: 34, width: 100, borderRadius: 10 }} />
        </div>
      </div>
      <div className="skeleton" style={{ height: 42, width: 200, borderRadius: 14 }} />
    </div>

    {/* Diagram */}
    <div className="card">
      <div className="skeleton" style={{ height: 20, width: 220, marginBottom: 20 }} />
      <div className="skeleton" style={{ height: 200 }} />
    </div>

    {/* Components */}
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
        <div className="skeleton" style={{ height: 20, width: 220 }} />
        <div className="skeleton" style={{ height: 22, width: 32, borderRadius: 99 }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div className="skeleton" style={{ width: 36, height: 36, borderRadius: 11 }} />
                <div className="skeleton" style={{ height: 14, width: 100 }} />
              </div>
              <div className="skeleton" style={{ height: 20, width: 60, borderRadius: 99 }} />
            </div>
            <div className="skeleton" style={{ height: 12, width: '100%', marginBottom: 8 }} />
            <div className="skeleton" style={{ height: 12, width: '75%' }} />
          </div>
        ))}
      </div>
    </div>

    {/* Rationale */}
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
        <div className="skeleton" style={{ height: 20, width: 180 }} />
        <div className="skeleton" style={{ height: 22, width: 28, borderRadius: 99 }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{ display: 'flex', gap: 16, padding: '16px 18px', borderRadius: 14, background: 'var(--bg-rationale)', border: '1px solid var(--border)' }}>
            <div className="skeleton" style={{ width: 32, height: 32, borderRadius: 10, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton" style={{ height: 14, width: 140, marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 12, width: '100%', marginBottom: 6 }} />
              <div className="skeleton" style={{ height: 12, width: '80%' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default SkeletonLoader;
