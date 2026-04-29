import { useState, useCallback } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import InputForm from './components/InputForm';
import ResultView from './components/ResultView';
import SkeletonLoader from './components/SkeletonLoader';
import HistoryPanel from './components/HistoryPanel';
import { generateArchitecture } from './services/api';
import { getHistory, saveToHistory, clearHistory } from './utils/storage';
import { useDarkMode } from './hooks/useDarkMode';

export default function App() {
  const [isDark, setIsDark] = useDarkMode();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [error, setError] = useState(null);
  const [history, setHistory] = useState(getHistory);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = useCallback(async (prompt) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setCurrentPrompt(prompt);
    const toastId = toast.loading('Generating architecture...');
    try {
      const response = await generateArchitecture(prompt);
      if (!response?.success || !response?.data) throw new Error('Invalid response from server.');
      setResult(response.data);
      const updated = saveToHistory(prompt, response);
      setHistory(updated);
      toast.success('Architecture generated!', { id: toastId });
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.error || err?.message || 'Something went wrong.';
      setError(msg);
      toast.error(msg, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleReset = useCallback(() => {
    setResult(null); setError(null); setCurrentPrompt(''); setSearchQuery('');
  }, []);

  const handleHistorySelect = useCallback((item) => {
    setCurrentPrompt(item.prompt);
    setResult(item.result?.data || null);
    setError(null);
    toast('Loaded from history', { icon: '🕐' });
  }, []);

  const handleClearHistory = useCallback(() => {
    clearHistory(); setHistory([]); toast.success('History cleared');
  }, []);

  const filteredResult = result && searchQuery.trim()
    ? {
        ...result,
        architectural_components: (result.architectural_components || []).filter(c =>
          c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.description?.toLowerCase().includes(searchQuery.toLowerCase())
        ),
        rationale_for_components: (result.rationale_for_components || []).filter(r =>
          r.component?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          r.rationale?.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }
    : result;

  const s = {
    page:   { minHeight: '100vh', position: 'relative', backgroundColor: 'var(--bg-page)', color: 'var(--text-1)', transition: 'background-color 0.35s ease, color 0.35s ease' },
    header: { position: 'sticky', top: 0, zIndex: 100, background: 'var(--bg-header)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', transition: 'background 0.35s ease, border-color 0.35s ease' },
    headerInner: { maxWidth: 1160, margin: '0 auto', padding: '0 24px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
    main:   { maxWidth: 1160, margin: '0 auto', padding: '52px 24px 80px', position: 'relative', zIndex: 1 },
    footer: { position: 'relative', zIndex: 1, borderTop: '1px solid var(--border)', padding: '24px', textAlign: 'center', fontSize: 12, color: 'var(--text-4)', transition: 'border-color 0.35s ease' },
  };

  return (
    <div style={s.page}>
      <div className="bg-mesh" />

      <Toaster position="top-right" toastOptions={{
        style: { background: 'var(--bg-card)', color: 'var(--text-1)', border: '1px solid var(--border)', fontSize: 13 },
        success: { iconTheme: { primary: '#6366f1', secondary: '#fff' } },
      }} />

      {/* ── HEADER ── */}
      <header style={s.header}>
        <div style={s.headerInner}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className="animate-float" style={{ width: 42, height: 42, borderRadius: 14, background: 'linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: '0 0 20px rgba(99,102,241,0.35)', flexShrink: 0 }}>
              ⚗️
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                <span className="gradient-text">AI Architecture</span>
                <span style={{ color: 'var(--text-1)' }}> Workbench</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-4)', letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 1 }}>
                Software Design Assistant
              </div>
            </div>
          </div>

          {/* Right controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '6px 14px', background: 'var(--bg-status)', border: '1px solid var(--border)', borderRadius: 10, transition: 'all 0.35s ease' }}>
              <div className="glow-dot animate-pulse" style={{ background: isLoading ? '#f59e0b' : result ? '#22c55e' : 'var(--text-4)', boxShadow: isLoading ? '0 0 6px #f59e0b' : result ? '0 0 6px #22c55e' : 'none' }} />
              <span style={{ fontSize: 12, color: 'var(--text-3)', fontWeight: 500 }}>
                {isLoading ? 'Processing…' : result ? 'Ready' : 'Idle'}
              </span>
            </div>

            {/* Dark mode toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--bg-status)', border: '1px solid var(--border)', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.25s ease' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-hover)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN ── */}
      <main style={s.main}>

        {/* Hero */}
        {!result && !isLoading && (
          <div className="animate-fade-in" style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 16px', borderRadius: 99, background: 'var(--bg-tag)', border: '1px solid var(--border)', fontSize: 11, color: 'var(--text-accent)', fontWeight: 700, marginBottom: 24, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 6px var(--accent)', display: 'inline-block' }} />
              Powered by AI
            </div>

            <h1 style={{ fontSize: 'clamp(36px, 6vw, 58px)', fontWeight: 900, lineHeight: 1.08, letterSpacing: '-0.03em', marginBottom: 20, color: 'var(--text-1)' }}>
              Design Software<br />
              <span className="gradient-text">Architecture with AI</span>
            </h1>

            <p style={{ fontSize: 17, color: 'var(--text-3)', maxWidth: 540, margin: '0 auto', lineHeight: 1.75 }}>
              Describe your system requirements and instantly get a complete architectural design — components, patterns, diagrams, and rationale.
            </p>

            {/* Stats */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 48, marginTop: 44, flexWrap: 'wrap' }}>
              {[['10+', 'Patterns Supported'], ['Auto', 'Components Generated'], ['< 5s', 'Response Time']].map(([val, label], i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--accent)', letterSpacing: '-0.02em' }}>{val}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-4)', marginTop: 4, fontWeight: 500 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <InputForm onSubmit={handleSubmit} isLoading={isLoading} onReset={handleReset} hasResult={!!result} />

          {!isLoading && !result && (
            <HistoryPanel history={history} onSelect={handleHistorySelect} onClear={handleClearHistory} />
          )}

          {/* Error */}
          {error && !isLoading && (
            <div className="card animate-scale-in" style={{ borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.04)' }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>❌</div>
                <div>
                  <div style={{ fontWeight: 700, color: '#ef4444', fontSize: 14, marginBottom: 4 }}>Generation Failed</div>
                  <div style={{ color: 'var(--text-3)', fontSize: 13 }}>{error}</div>
                </div>
              </div>
            </div>
          )}

          {isLoading && <SkeletonLoader />}

          {/* Search */}
          {result && !isLoading && (
            <div className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: 1, maxWidth: 340 }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: 'var(--text-4)', pointerEvents: 'none' }}>🔍</span>
                <input
                  type="text"
                  placeholder="Filter components..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: 40, paddingTop: 9, paddingBottom: 9, borderRadius: 12 }}
                />
              </div>
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="btn-secondary" style={{ fontSize: 12 }}>✕ Clear</button>
              )}
              <div style={{ fontSize: 12, color: 'var(--text-3)', padding: '8px 14px', background: 'var(--bg-status)', border: '1px solid var(--border)', borderRadius: 10 }}>
                <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{filteredResult?.architectural_components?.length || 0}</span> components
              </div>
            </div>
          )}

          {filteredResult && !isLoading && <ResultView data={filteredResult} prompt={currentPrompt} />}
        </div>
      </main>

      {/* Footer */}
      <footer style={s.footer}>
        <span className="gradient-text" style={{ fontWeight: 700 }}>AI Architecture Workbench</span>
        <span style={{ color: 'var(--text-4)' }}> — Powered by Flask API & React</span>
      </footer>
    </div>
  );
}
