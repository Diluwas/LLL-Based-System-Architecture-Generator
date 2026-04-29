import { useEffect, useState } from 'react';
import { deflateRaw } from 'pako';

/**
 * Correct PlantUML encoding:
 * 1. UTF-8 encode the string
 * 2. deflateRaw compress (no zlib header)
 * 3. Encode with PlantUML custom base64 alphabet
 */
const encode6bit = (b) => {
  if (b < 10) return String.fromCharCode(48 + b);       // 0-9
  b -= 10;
  if (b < 26) return String.fromCharCode(65 + b);       // A-Z
  b -= 26;
  if (b < 26) return String.fromCharCode(97 + b);       // a-z
  b -= 26;
  if (b === 0) return '-';
  if (b === 1) return '_';
  return '?';
};

const append3bytes = (b1, b2, b3) => {
  const c1 = b1 >> 2;
  const c2 = ((b1 & 0x3) << 4) | (b2 >> 4);
  const c3 = ((b2 & 0xF) << 2) | (b3 >> 6);
  const c4 = b3 & 0x3F;
  return encode6bit(c1) + encode6bit(c2) + encode6bit(c3) + encode6bit(c4);
};

const encodePlantUML = (code) => {
  try {
    // Convert string to UTF-8 bytes
    const utf8Bytes = new TextEncoder().encode(code);

    // Compress using raw deflate (no zlib/gzip header)
    const compressed = deflateRaw(utf8Bytes);

    // Encode with PlantUML custom base64
    let result = '';
    for (let i = 0; i < compressed.length; i += 3) {
      const b1 = compressed[i];
      const b2 = i + 1 < compressed.length ? compressed[i + 1] : 0;
      const b3 = i + 2 < compressed.length ? compressed[i + 2] : 0;
      result += append3bytes(b1, b2, b3);
    }
    return result;
  } catch (e) {
    console.error('PlantUML encode error:', e);
    return null;
  }
};

/**
 * Build a simple PlantUML diagram from components array as fallback
 */
const buildPlantUML = (components = []) => {
  if (!components.length) return null;

  const getUMLType = (type = '') => {
    const t = type.toLowerCase();
    if (t.includes('database') || t.includes('db')) return 'database';
    if (t.includes('cache') || t.includes('storage')) return 'storage';
    if (t.includes('gateway') || t.includes('proxy')) return 'boundary';
    if (t.includes('ui') || t.includes('frontend') || t.includes('mobile')) return 'actor';
    if (t.includes('queue') || t.includes('message')) return 'queue';
    return 'component';
  };

  const nodes = components.map((c, i) => {
    const id = `C${i}`;
    const label = (c.name || 'Component').replace(/"/g, "'");
    const umlType = getUMLType(c.type);
    return `${umlType} "${label}" as ${id}`;
  });

  const arrows = components.slice(0, -1).map((_, i) => `C${i} --> C${i + 1}`);

  return [
    '@startuml',
    '!theme plain',
    'skinparam backgroundColor #FAFAFA',
    'skinparam componentBackgroundColor #EEF2FF',
    'skinparam componentBorderColor #6366F1',
    'skinparam componentFontColor #1E1B4B',
    'skinparam arrowColor #6366F1',
    'skinparam databaseBackgroundColor #DCFCE7',
    'skinparam databaseBorderColor #16A34A',
    'skinparam actorBackgroundColor #FEF3C7',
    'skinparam actorBorderColor #D97706',
    '',
    ...nodes,
    '',
    ...arrows,
    '@enduml'
  ].join('\n');
};

const DiagramView = ({ data }) => {
  const [imgSrc, setImgSrc] = useState('');
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const [copied, setCopied] = useState(false);

  // Priority 1: base64 image from backend
  const base64Image = data?.diagram?.image;
  const mimeType = data?.diagram?.mime_type || 'image/png';

  // Priority 2: PlantUML code from backend LLM response
  const plantUMLCode = data?.architechure_diagram_code || data?.architecture_diagram_code;

  // Priority 3: auto-build from components
  const fallbackCode = buildPlantUML(data?.architectural_components);

  const diagramCode = plantUMLCode || fallbackCode;

  useEffect(() => {
    setLoading(true);
    setImgError(false);

    if (base64Image) {
      setImgSrc(`data:${mimeType};base64,${base64Image}`);
      setLoading(false);
      return;
    }

    if (diagramCode) {
      const encoded = encodePlantUML(diagramCode);
      if (encoded) {
        setImgSrc(`https://www.plantuml.com/plantuml/png/${encoded}`);
      } else {
        setImgError(true);
      }
      setLoading(false);
      return;
    }

    setLoading(false);
    setImgError(true);
  }, [base64Image, diagramCode]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(diagramCode || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!imgSrc) return;
    const a = document.createElement('a');
    a.href = imgSrc;
    a.download = 'architecture-diagram.png';
    a.click();
  };

  if (!base64Image && !diagramCode) return null;

  return (
    <div className="card animate-slide-up">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 className="section-title">
          <span style={{ fontSize: 20 }}>🗺️</span>
          Architecture Diagram
          <span style={{
            fontSize: 11, fontWeight: 600,
            background: 'rgba(99,102,241,0.12)',
            color: 'var(--tag-text)',
            border: '1px solid var(--chip-border)',
            padding: '2px 10px', borderRadius: 9999,
          }}>
            PlantUML
          </span>
        </h2>
        <div style={{ display: 'flex', gap: 8 }}>
          {diagramCode && (
            <button onClick={handleCopy} className="btn-secondary" style={{ fontSize: 12 }}>
              {copied ? '✅ Copied!' : '📋 Copy Code'}
            </button>
          )}
          {imgSrc && !imgError && (
            <button onClick={handleDownload} className="btn-secondary" style={{ fontSize: 12 }}>
              ⬇️ Download
            </button>
          )}
        </div>
      </div>

      {/* Diagram area */}
      <div style={{
        background: 'var(--diagram-bg)',
        borderRadius: 16,
        padding: 24,
        border: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 200,
        overflowX: 'auto',
      }}>
        {loading ? (
          <div className="skeleton" style={{ height: 180, width: '100%' }} />
        ) : imgError ? (
          /* Fallback: simple flow boxes */
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
            {(data?.architectural_components || []).map((c, i, arr) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  background: 'rgba(99,102,241,0.12)',
                  border: '1px solid var(--border)',
                  color: 'var(--tag-text)',
                  padding: '10px 18px',
                  borderRadius: 12, fontSize: 13, fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}>
                  {c.name}
                </div>
                {i < arr.length - 1 && (
                  <span style={{ color: 'var(--text-muted)', fontSize: 18 }}>→</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <img
            src={imgSrc}
            alt="Architecture Diagram"
            style={{ maxWidth: '100%', borderRadius: 8 }}
            onLoad={() => setLoading(false)}
            onError={() => { setImgError(true); setLoading(false); }}
          />
        )}
      </div>
    </div>
  );
};

export default DiagramView;
