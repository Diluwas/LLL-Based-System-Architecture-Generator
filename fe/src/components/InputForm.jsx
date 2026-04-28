import { useState } from 'react';

const EXAMPLES = [
  'Design a scalable e-commerce platform with payment processing',
  'Build a real-time chat application for 1 million users',
  'Design a microservices-based banking system',
  'Create a video streaming platform like Netflix',
];

const InputForm = ({ onSubmit, isLoading, onReset, hasResult }) => {
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) { setError('Please enter a system description before generating.'); return; }
    setError('');
    onSubmit(prompt.trim());
  };

  const handleReset = () => { setPrompt(''); setError(''); onReset(); };

  return (
    <div className="card animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ width: 40, height: 40, background: '#eef2ff', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>💡</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>Describe Your System</div>
          <div style={{ fontSize: 12, color: '#94a3b8' }}>AI will generate a complete architecture design</div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          className={`input-field${error ? ' border-red-400' : ''}`}
          style={{ minHeight: 140, marginBottom: 8 }}
          placeholder="e.g. Design a scalable e-commerce platform with user authentication, product catalog, shopping cart, payment processing, and order management..."
          value={prompt}
          onChange={(e) => { setPrompt(e.target.value); setError(''); }}
          disabled={isLoading}
          rows={6}
        />
        {error && <p style={{ color: '#ef4444', fontSize: 13, marginBottom: 8 }}>⚠️ {error}</p>}

        <div style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Quick Examples</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {EXAMPLES.map((ex, i) => (
              <button key={i} type="button" onClick={() => { setPrompt(ex); setError(''); }} disabled={isLoading}
                style={{ fontSize: 12, padding: '6px 12px', background: '#eef2ff', color: '#4f46e5', border: '1px solid #c7d2fe', borderRadius: 8, cursor: 'pointer' }}>
                {ex.length > 40 ? ex.slice(0, 40) + '…' : ex}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 12, color: '#94a3b8' }}>{prompt.length} characters</span>
          <div style={{ display: 'flex', gap: 12 }}>
            {hasResult && (
              <button type="button" onClick={handleReset} className="btn-secondary">
                🔄 Reset
              </button>
            )}
            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading ? (
                <><span className="animate-spin" style={{ display: 'inline-block' }}>⏳</span> Generating...</>
              ) : (
                <>⚡ Generate Architecture</>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InputForm;
