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
    const toastId = toast.loading('Generating architecture design...');
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

  const handleReset = useCallback(() => { setResult(null); setError(null); setCurrentPrompt(''); }, []);

  const handleHistorySelect = useCallback((item) => {
    setCurrentPrompt(item.prompt);
    setResult(item.result?.data || null);
    setError(null);
    toast('Loaded from history', { icon: '🕐' });
  }, []);

  const handleClearHistory = useCallback(() => { clearHistory(); setHistory([]); toast.success('History cleared'); }, []);

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
    <div className="min-h-screen" style={{ backgroundColor: isDark ? '#030712' : '#f8fafc' }}>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: isDark ? 'rgba(17,24,39,0.85)' : 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${isDark ? '#1f2937' : '#e2e8f0'}`
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#6366f1,#a855f7)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 18 }}>⚗️</span>
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: isDark ? '#f1f5f9' : '#0f172a' }}>AI Architecture Workbench</div>
              <div style={{ fontSize: 11, color: '#94a3b8' }}>Software Architecture Design Assistant</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#94a3b8' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: isLoading ? '#facc15' : result ? '#4ade80' : '#94a3b8', animation: isLoading ? 'pulse 1s infinite' : 'none' }} />
              {isLoading ? 'Processing...' : result ? 'Ready' : 'Idle'}
            </div>
            <button onClick={() => setIsDark(!isDark)} style={{ width: 36, height: 36, borderRadius: 10, border: 'none', cursor: 'pointer', background: isDark ? '#1f2937' : '#f1f5f9', fontSize: 16 }}>
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {!result && !isLoading && (
          <div className="animate-fade-in" style={{ textAlign: 'center', padding: '2rem 0' }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, color: isDark ? '#f1f5f9' : '#0f172a', marginBottom: 12 }}>
              Design Software Architecture{' '}
              <span style={{ background: 'linear-gradient(90deg,#6366f1,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>with AI</span>
            </h2>
            <p style={{ color: '#94a3b8', maxWidth: 520, margin: '0 auto', fontSize: 15 }}>
              Describe your system requirements and get a complete architectural design with components, patterns, and rationale.
            </p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <InputForm onSubmit={handleSubmit} isLoading={isLoading} onReset={handleReset} hasResult={!!result} />

          {!isLoading && !result && (
            <HistoryPanel history={history} onSelect={handleHistorySelect} onClear={handleClearHistory} />
          )}

          {error && !isLoading && (
            <div className="card animate-slide-up" style={{ borderColor: '#fca5a5', background: isDark ? 'rgba(127,29,29,0.2)' : '#fef2f2' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 20 }}>❌</span>
                <div>
                  <div style={{ fontWeight: 600, color: '#dc2626', fontSize: 14 }}>Generation Failed</div>
                  <div style={{ color: '#ef4444', fontSize: 14, marginTop: 4 }}>{error}</div>
                </div>
              </div>
            </div>
          )}

          {isLoading && <SkeletonLoader />}

          {result && !isLoading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} className="animate-fade-in">
              <div style={{ position: 'relative', flex: 1, maxWidth: 320 }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 14 }}>🔍</span>
                <input
                  type="text"
                  placeholder="Filter components..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field"
                  style={{ paddingLeft: 36, paddingTop: 8, paddingBottom: 8 }}
                />
              </div>
              {searchQuery && <button onClick={() => setSearchQuery('')} className="btn-secondary">Clear</button>}
              <span style={{ fontSize: 12, color: '#94a3b8' }}>{filteredResult?.architectural_components?.length || 0} components</span>
            </div>
          )}

          {filteredResult && !isLoading && <ResultView data={filteredResult} prompt={currentPrompt} />}
        </div>
      </main>

      <footer style={{ marginTop: 64, borderTop: `1px solid ${isDark ? '#1f2937' : '#e2e8f0'}`, padding: '1.5rem', textAlign: 'center', fontSize: 12, color: '#94a3b8' }}>
        AI Architecture Workbench — Powered by Flask API
      </footer>
    </div>
  );
}
