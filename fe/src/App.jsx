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
      const architectureData = response.data?.architectural_pattern ? response.data : response.data;
      setResult(architectureData);
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

  return (
    <div style={{ minHeight: '100vh', position: 'relative', backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)', transition: 'all 0.4s ease' }}>

      {/* Background mesh */}
      <div className="bg-mesh" />

      <Toaster position="top-right" toastOptions={{
        style: { background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)' }
      }} />

      {/* ── Header ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'var(--header-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        transition: 'all 0.4s ease',
      }}>
        <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 24px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 42, height: 42,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)',
              borderRadius: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20,
              boxShadow: '0 0 20px rgba(99,102,241,0.4)',
            }} className="animate-float">⚗️</div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: '-0.02em' }}>
                <span className="gradient-text">AI Architecture</span>
                <span style={{ color: 'var(--text-primary)' }}> Workbench</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Software Design Assistant
              </div>
            </div>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Status pill */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 14px',
              background: 'var(--status-bg)',
              borderRadius: 10,
              border: '1px solid var(--border)',
            }}>
              <div className="glow-dot animate-pulse" style={{
                background: isLoading ? '#facc15' : result ? '#4ade80' : 'var(--text-faint)',
                color:      isLoading ? '#facc15' : result ? '#4ade80' : 'var(--text-faint)',
              }} />
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>
                {isLoading ? 'Processing' : result ? 'Ready' : 'Idle'}
              </span>
            </div>

            {/* Theme toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              style={{
                width: 42, height: 42, borderRadius: 12,
                background: 'var(--status-bg)',
                border: '1px solid var(--border)',
                cursor: 'pointer', fontSize: 18,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s',
              }}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main style={{ maxWidth: 1140, margin: '0 auto', padding: '48px 24px', position: 'relative', zIndex: 1 }}>

        {/* Hero */}
        {!result && !isLoading && (
          <div className="animate-fade-in" style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', borderRadius: 9999,
              background: 'var(--tag-bg)',
              border: '1px solid var(--chip-border)',
              fontSize: 12, color: 'var(--tag-text)', fontWeight: 600,
              marginBottom: 24, letterSpacing: '0.05em', textTransform: 'uppercase',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#6366f1', boxShadow: '0 0 6px #6366f1', display: 'inline-block' }} />
              Powered by AI
            </div>

            <h1 style={{ fontSize: 52, fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: 20, color: 'var(--text-primary)' }}>
              Design Software<br />
              <span className="gradient-text">Architecture with AI</span>
            </h1>

            <p style={{ fontSize: 17, color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
              Describe your system requirements and instantly get a complete architectural design with components, patterns, diagrams, and rationale.
            </p>

            {/* Stats */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 48, marginTop: 40 }}>
              {[
                { label: 'Patterns Supported', value: '10+' },
                { label: 'Components Generated', value: 'Auto' },
                { label: 'Response Time', value: '< 5s' },
              ].map((stat, i) => (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: '#6366f1' }}>{stat.value}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <InputForm onSubmit={handleSubmit} isLoading={isLoading} onReset={handleReset} hasResult={!!result} />

          {!isLoading && !result && (
            <HistoryPanel history={history} onSelect={handleHistorySelect} onClear={handleClearHistory} />
          )}

          {/* Error */}
          {error && !isLoading && (
            <div className="card animate-scale-in" style={{ borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.05)' }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(239,68,68,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>❌</div>
                <div>
                  <div style={{ fontWeight: 700, color: '#ef4444', fontSize: 14, marginBottom: 4 }}>Generation Failed</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{error}</div>
                </div>
              </div>
            </div>
          )}

          {isLoading && <SkeletonLoader />}

          {/* Search */}
          {result && !isLoading && (
            <div className="animate-fade-in" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
                <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: 'var(--text-muted)' }}>🔍</span>
                <input
                  type="text"
                  placeholder="Filter components..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: 44, paddingTop: 10, paddingBottom: 10, borderRadius: 12 }}
                />
              </div>
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="btn-secondary" style={{ fontSize: 12 }}>✕ Clear</button>
              )}
              <div style={{
                fontSize: 12, color: 'var(--text-secondary)',
                padding: '8px 14px',
                background: 'var(--status-bg)',
                borderRadius: 10,
                border: '1px solid var(--border)',
              }}>
                <span style={{ color: '#6366f1', fontWeight: 700 }}>{filteredResult?.architectural_components?.length || 0}</span> components
              </div>
            </div>
          )}

          {filteredResult && !isLoading && <ResultView data={filteredResult} prompt={currentPrompt} />}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        position: 'relative', zIndex: 1,
        borderTop: '1px solid var(--border)',
        padding: '24px', textAlign: 'center',
      }}>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          <span className="gradient-text" style={{ fontWeight: 700 }}>AI Architecture Workbench</span>
          <span> — Powered by Flask API & React</span>
        </div>
      </footer>
    </div>
  );
}
