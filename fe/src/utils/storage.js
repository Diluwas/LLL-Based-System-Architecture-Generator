const HISTORY_KEY = 'arch_workbench_history';
const MAX_HISTORY = 3;

export const getHistory = () => {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); }
  catch { return []; }
};

export const saveToHistory = (prompt, result) => {
  const history = getHistory();
  const entry = { id: Date.now(), prompt, result, timestamp: new Date().toISOString() };
  const updated = [entry, ...history].slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  return updated;
};

export const clearHistory = () => localStorage.removeItem(HISTORY_KEY);

export const downloadJSON = (data, filename = 'architecture.json') => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
};

export const copyToClipboard = async (text) => {
  await navigator.clipboard.writeText(typeof text === 'string' ? text : JSON.stringify(text, null, 2));
};
