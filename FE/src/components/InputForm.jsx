import { useState } from 'react';

const EXAMPLES = [
  { label: 'E-Commerce',  prompt: 'Design a scalable e-commerce platform with payment processing and inventory management' },
  { label: 'Chat App',    prompt: 'Build a real-time chat application supporting 1 million concurrent users' },
  { label: 'Banking',     prompt: 'Design a microservices-based banking system with fraud detection' },
  { label: 'Streaming',   prompt: 'Create a video streaming platform like Netflix with CDN and recommendations' },
  { label: 'Inventory',   prompt: 'Build an inventory management system for a retail shop with low stock alerts and mobile app' },
];

const InputForm = ({ onSubmit, isLoading, onReset, hasResult }) => {
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState('');
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim()) { setError('Please describe your system before generating.'); return; }
    setError('');
    onSubmit(prompt.trim());
  };

  return (
    <div className="card animate-fade-in" style={{ padding: 32 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
        <div style={{ width: 48, height: 48, borderRadius: 16, background: 'var(--bg-tag)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
          💬
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--text-1)', letterSpacing: '-0.01em' }}>Describe Your System</div>
          <div style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 2 }}>AI will generate a complete architecture design instantly</div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Textarea */}
        <div style={{ position: 'relative', marginBottom: 14 }}>
          <textarea
            className="input-field"
            style={{ minHeight: 150, borderColor: error ? 'rgba(239,68,68,0.5)' : focused ? 'var(--accent)' : 'var(--border)' }}
            placeholder="e.g. Design a scalable inventory management system for a retail shop with real-time stock tracking, user authentication, notifications for low stock, and a mobile-friendly interface..."
            value={prompt}
            onChange={e => { setPrompt(e.target.value); setError(''); }}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={isLoading}
            rows={6}
          />
          <div style={{ position: 'absolute', bottom: 12, right: 14, fontSize: 11, fontWeight: 600, color: prompt.length > 0 ? 'var(--accent)' : 'var(--text-4)' }}>
            {prompt.length} chars
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#ef4444', fontSize: 13, marginBottom: 14, padding: '10px 14px', background: 'rgba(239,68,68,0.07)', borderRadius: 10, border: '1px solid rgba(239,68,68,0.2)' }}>
            ⚠️ {error}
          </div>
        )}

        {/* Examples */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
            Quick Examples
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {EXAMPLES.map((ex, i) => (
              <button key={i} type="button" onClick={() => { setPrompt(ex.prompt); setError(''); }} disabled={isLoading} className="chip">
                {ex.label}
              </button>
            ))}
          </div>
        </div>

        <div className="divider" style={{ marginBottom: 20 }} />

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontSize: 12, color: 'var(--text-4)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
            Mock mode active — no backend needed
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {hasResult && (
              <button type="button" onClick={() => { setPrompt(''); setError(''); onReset(); }} className="btn-secondary">
                🔄 Reset
              </button>
            )}
            <button type="submit" disabled={isLoading} className="btn-primary">
              {isLoading
                ? <><span className="animate-spin" style={{ display: 'inline-block' }}>⏳</span> Generating…</>
                : <>⚡ Generate Architecture</>
              }
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InputForm;
