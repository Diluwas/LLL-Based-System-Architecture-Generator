const SkeletonLoader = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} className="animate-fade-in">
    <div className="card"><div className="skeleton" style={{ height: 20, width: 160, marginBottom: 16 }} /><div className="skeleton" style={{ height: 40, width: 240 }} /></div>
    <div className="card"><div className="skeleton" style={{ height: 20, width: 180, marginBottom: 16 }} /><div className="skeleton" style={{ height: 160 }} /></div>
    <div className="card">
      <div className="skeleton" style={{ height: 20, width: 200, marginBottom: 20 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16 }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <div className="skeleton" style={{ height: 16, width: 100 }} />
              <div className="skeleton" style={{ height: 20, width: 60, borderRadius: 9999 }} />
            </div>
            <div className="skeleton" style={{ height: 12, width: '100%', marginBottom: 8 }} />
            <div className="skeleton" style={{ height: 12, width: '80%' }} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default SkeletonLoader;
