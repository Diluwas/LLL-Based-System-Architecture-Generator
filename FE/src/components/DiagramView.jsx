import { useCallback, useRef, useState, useEffect, useMemo } from 'react';
import { Maximize2, Minimize2, Download, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

const btnStyle = {
  display: 'flex', alignItems: 'center', gap: 6,
  padding: '6px 12px', borderRadius: 8,
  border: '1px solid #d1d5db', background: '#fff',
  color: '#374151', fontSize: 12, fontWeight: 600,
  cursor: 'pointer', transition: 'all 0.15s ease',
  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
};

/**
 * Decode base64 SVG and patch the root <svg> element so it scales
 * responsively inside the container (width/height → 100%, preserve viewBox).
 */
const prepareSvgHtml = (base64) => {
  if (!base64) return null;
  try {
    const raw = atob(base64);
    // Ensure the root <svg> has width="100%" height="100%" and a viewBox
    const patched = raw.replace(
      /<svg([^>]*)>/i,
      (match, attrs) => {
        // Extract existing viewBox if present
        const hasViewBox = /viewBox/i.test(attrs);
        // Extract original width/height to build a fallback viewBox
        let vb = '';
        if (!hasViewBox) {
          const w = attrs.match(/width="([\d.]+)/i)?.[1] || '800';
          const h = attrs.match(/height="([\d.]+)/i)?.[1] || '600';
          vb = ` viewBox="0 0 ${w} ${h}"`;
        }
        // Strip fixed width/height, add 100% sizing
        const cleaned = attrs
          .replace(/width="[^"]*"/gi, '')
          .replace(/height="[^"]*"/gi, '');
        return `<svg${cleaned} width="100%" height="100%"${vb}>`;
      }
    );
    return patched;
  } catch {
    return null;
  }
};

const DiagramView = ({ data }) => {
  const diagram = data?.diagram;
  const svgBase64 = diagram?.image;

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Decode & patch SVG once
  const svgHtml = useMemo(() => prepareSvgHtml(svgBase64), [svgBase64]);

  // Listen for fullscreen change events
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }, []);

  const handleZoomIn = useCallback(() => setZoom(z => Math.min(z + 0.25, 4)), []);
  const handleZoomOut = useCallback(() => setZoom(z => Math.max(z - 0.25, 0.25)), []);
  const handleReset = useCallback(() => { setZoom(1); setPan({ x: 0, y: 0 }); }, []);

  // Mouse wheel zoom
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    setZoom(z => {
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      return Math.min(Math.max(z + delta, 0.25), 4);
    });
  }, []);

  // Pan handlers
  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return;
    setIsPanning(true);
    setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  }, [pan]);

  const handleMouseMove = useCallback((e) => {
    if (!isPanning) return;
    setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
  }, [isPanning, panStart]);

  const handleMouseUp = useCallback(() => setIsPanning(false), []);

  const handleDownload = useCallback(() => {
    if (!svgBase64) return;
    const svgText = atob(svgBase64);
    const blob = new Blob([svgText], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `architecture-diagram-${Date.now()}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }, [svgBase64]);

  if (!svgHtml) return null;

  return (
    <div className="card animate-slide-up">
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
            D2
          </span>
        </h2>
        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Scroll to zoom · Drag to pan</p>
      </div>

      <div
        ref={containerRef}
        style={{
          height: isFullscreen ? '100vh' : 600,
          borderRadius: isFullscreen ? 0 : 16,
          border: isFullscreen ? 'none' : '1px solid var(--border)',
          overflow: 'hidden',
          background: '#ffffff',
          position: 'relative',
          cursor: isPanning ? 'grabbing' : 'grab',
          userSelect: 'none',
        }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Inline SVG diagram */}
        <div
          style={{
            width: '100%',
            height: '100%',
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isPanning ? 'none' : 'transform 0.15s ease',
          }}
          dangerouslySetInnerHTML={{ __html: svgHtml }}
        />

        {/* Zoom controls (bottom-left) */}
        <div style={{ position: 'absolute', bottom: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 4, zIndex: 10 }}>
          <button onClick={handleZoomIn} style={{ ...btnStyle, padding: '6px 8px' }} title="Zoom in">
            <ZoomIn size={16} />
          </button>
          <button onClick={handleZoomOut} style={{ ...btnStyle, padding: '6px 8px' }} title="Zoom out">
            <ZoomOut size={16} />
          </button>
          <button onClick={handleReset} style={{ ...btnStyle, padding: '6px 8px' }} title="Reset view">
            <RotateCcw size={16} />
          </button>
        </div>

        {/* Toolbar buttons (top-right) */}
        <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', gap: 6, zIndex: 10 }}>
          <span style={{ ...btnStyle, cursor: 'default', color: '#6b7280', fontWeight: 500 }}>
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleDownload}
            style={btnStyle}
            title="Download SVG"
            onMouseEnter={e => { e.currentTarget.style.background = '#f3f4f6'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
          >
            <Download size={14} /> Export
          </button>
          <button
            onClick={toggleFullscreen}
            style={btnStyle}
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            onMouseEnter={e => { e.currentTarget.style.background = '#f3f4f6'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            {isFullscreen ? 'Exit' : 'Fullscreen'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiagramView;