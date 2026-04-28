const SkeletonLoader = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }} className="animate-fade-in">

    {/* Pattern skeleton */}
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div className="skeleton" style={{ height: 20, width: 200 }} />
        <div style={{ display: 'flex', gap: 8 }}>
          <div className="skeleton" style={{ height: 34, width: 110, borderRadius: 10 }} />
          <div className="skeleton" style={{ height: 34, width: 100, borderRadius: 10 }} />
        </div>
      </div>
      <div className="skeleton" style={{ height: 44, width: 200, borderRadius: 14 }} />
    </div>

    {/* Diagram skeleton */}
    <div className="card">
      <div className="skeleton" style={{ height: 20, width: 220, marginBottom: 20 }} />
      <div className="skeleton" style={{ height: 180 }} />
    </div>

    {/* Components skeleton */}
    <div className="card">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
        <div className="skeleton" style={{ height: 20, width: 220 }} />
        <div className="skeleton" style={{ height: 22, width: 30, borderRadius: 9999 }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card" style={{ padding: 20, gap: 12, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div className="skeleton" style={{ width: 38, height: 38, borderRadius: 12 }} />
                <div className="skeleton" style={{ height: 14, width: 110 }} />
              </div>
              <div className="skeleton" style={{ height: 22, width: 60, borderRadius: 9999 }} />
            </div>
            <div className="skeleton" style={{ height: 12, width: '100%' }} />
            <div className="skeleton" style={{ height: 12, width: '75%' }} />
          </div>
        ))}
      </div>
    </div>

    {/* Rationale skeleton */}
    <div className="card">
      <div className="skeleton" style={{ height: 20, width: 180, marginBottom: 24 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{ display: 'flex', gap: 16, padding: '16px 20px', borderRadius: 14, background: 'rgba(99,102,241,0.04)', border: '1px solid rgba(99,102,241,0.08)' }}>
            <div className="skeleton" style={{ width: 32, height: 32, borderRadius: 10, flexShrink: 0 }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="skeleton" style={{ height: 14, width: 140 }} />
              <div className="skeleton" style={{ height: 12, width: '100%' }} />
              <div className="skeleton" style={{ height: 12, width: '80%' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default SkeletonLoader;
