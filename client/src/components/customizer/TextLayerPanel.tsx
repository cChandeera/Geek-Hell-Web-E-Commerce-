import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Type, Bold, Italic, Check } from 'lucide-react';
import { useCustomizerStore, generateTextDataUrl } from '../../store/customizerStore';
import { cn } from '../../utils/cn';

/* ─── Constants ─────────────────────────────────────── */

const FONTS = [
  { label: 'Impact',     value: 'Impact' },
  { label: 'Bebas Neue', value: 'Bebas Neue' },
  { label: 'Bangers',    value: 'Bangers' },
  { label: 'Oswald',     value: 'Oswald' },
  { label: 'Roboto',     value: 'Roboto' },
  { label: 'Arial',      value: 'Arial' },
];

const COLOR_PRESETS = [
  '#FFFFFF', '#E50914', '#0476F2', '#FFD700',
  '#00FF88', '#FF6B35', '#C850C0', '#111118',
];

/* ─── Inject Google Fonts once ───────────────────────── */
let fontsInjected = false;
function injectGoogleFonts() {
  if (fontsInjected || typeof document === 'undefined') return;
  fontsInjected = true;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href =
    'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Bangers&family=Oswald:wght@400;700&family=Roboto:ital,wght@0,400;0,700;1,400;1,700&display=swap';
  document.head.appendChild(link);
}

/* ─── Props ──────────────────────────────────────────── */
interface TextLayerPanelProps {
  onClose: () => void;
}

/* ══════════════════════════════════════════════════════
   TextLayerPanel — with live 3D shirt preview
══════════════════════════════════════════════════════ */
export const TextLayerPanel: React.FC<TextLayerPanelProps> = ({ onClose }) => {
  const addTextLayer = useCustomizerStore((s) => s.addTextLayer);
  const addLayer     = useCustomizerStore((s) => s.addLayer);
  const deleteLayer  = useCustomizerStore((s) => s.deleteLayer);

  /* ─── Local form state ─── */
  const [text,     setText]     = useState('');
  const [font,     setFont]     = useState('Impact');
  const [color,    setColor]    = useState('#FFFFFF');
  const [fontSize, setFontSize] = useState(72);
  const [isBold,   setIsBold]   = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [hexInput, setHexInput] = useState('#FFFFFF');

  /* ─── Live preview layer tracking ─── */
  // We keep a temporary layer ID on the 3D shirt while the panel is open.
  // It gets replaced on every keystroke / setting change and removed on cancel.
  const previewLayerId = useRef<string | null>(null);

  useEffect(() => { injectGoogleFonts(); }, []);

  // Sync hex ↔ color
  useEffect(() => { setHexInput(color); }, [color]);

  /* ─── Core: push / update live preview layer on shirt ─── */
  const updateLivePreview = useCallback(
    (t: string, f: string, fs: number, c: string, bold: boolean, italic: boolean) => {
      const trimmed = t.trim();
      if (!trimmed) {
        // Remove preview layer if text is empty
        if (previewLayerId.current) {
          deleteLayer(previewLayerId.current);
          previewLayerId.current = null;
        }
        return;
      }

      const dataUrl = generateTextDataUrl(trimmed, f, fs, c, bold, italic);

      if (previewLayerId.current) {
        // Update existing preview: replace url in store by re-adding with same id trick
        // Easiest: delete old + add new with our tracked id
        deleteLayer(previewLayerId.current);
      }

      // Add fresh preview layer and capture the resulting active layer id
      addLayer(dataUrl, '✦ Preview');

      // The newly added layer becomes active. Capture its id from the store.
      const state = useCustomizerStore.getState();
      const isFront = state.currentView === 'front';
      const side = isFront ? state.frontDesign : state.backDesign;
      previewLayerId.current = side.activeLayerId;
    },
    [addLayer, deleteLayer]
  );

  /* ─── Debounced live update on any setting change ─── */
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleUpdate = useCallback(
    (t: string, f: string, fs: number, c: string, bold: boolean, italic: boolean) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        updateLivePreview(t, f, fs, c, bold, italic);
      }, 120); // 120ms debounce — feels instant, avoids spam
    },
    [updateLivePreview]
  );

  /* ─── Handlers that update state AND trigger live preview ─── */
  const handleTextChange = (val: string) => {
    setText(val);
    scheduleUpdate(val, font, fontSize, color, isBold, isItalic);
  };
  const handleFontChange = (val: string) => {
    setFont(val);
    scheduleUpdate(text, val, fontSize, color, isBold, isItalic);
  };
  const handleFontSizeChange = (val: number) => {
    setFontSize(val);
    scheduleUpdate(text, font, val, color, isBold, isItalic);
  };
  const handleColorChange = (val: string) => {
    setColor(val);
    scheduleUpdate(text, font, fontSize, val, isBold, isItalic);
  };
  const handleBoldToggle = () => {
    const next = !isBold;
    setIsBold(next);
    scheduleUpdate(text, font, fontSize, color, next, isItalic);
  };
  const handleItalicToggle = () => {
    const next = !isItalic;
    setIsItalic(next);
    scheduleUpdate(text, font, fontSize, color, isBold, next);
  };
  const handleHexChange = (val: string) => {
    setHexInput(val);
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) handleColorChange(val);
  };

  /* ─── Confirm: convert preview → permanent layer ─── */
  const handleAddToDesign = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    // Remove the temporary preview layer first
    if (previewLayerId.current) {
      deleteLayer(previewLayerId.current);
      previewLayerId.current = null;
    }

    // Add the real permanent layer via addTextLayer (stores all metadata)
    addTextLayer(trimmed, font, fontSize, color, isBold, isItalic);
    onClose();
  };

  /* ─── Cancel: remove preview layer and close ─── */
  const handleClose = () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (previewLayerId.current) {
      deleteLayer(previewLayerId.current);
      previewLayerId.current = null;
    }
    onClose();
  };

  /* ─── Cleanup on unmount (safety net) ─── */
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      if (previewLayerId.current) {
        deleteLayer(previewLayerId.current);
      }
    };
  }, [deleteLayer]);

  const previewFontStyle = `${isItalic ? 'italic ' : ''}${isBold ? 'bold ' : ''}${Math.min(fontSize, 46)}px ${font}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-end"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      {/* Scrim */}
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={handleClose} />

      {/* Panel */}
      <div
        className="relative z-10 w-[320px] h-full flex flex-col bg-[#0d0d12] border-l border-white/8 shadow-2xl overflow-y-auto"
        style={{ animation: 'slideInRight 0.28s cubic-bezier(0.22,1,0.36,1)' }}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/8 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-400/15 border border-blue-400/20 flex items-center justify-center">
              <Type className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-white">
                Add Text
              </span>
              <span className="text-[9px] text-blue-400/70 font-medium">
                Live preview on shirt ✦
              </span>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg border border-white/8 text-text-muted hover:text-white hover:border-white/15 transition-all duration-200 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex flex-col gap-5 p-5 flex-1">
          {/* ── Text Input ── */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-text-muted">
              Text Content
            </label>
            <textarea
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Type your text here…"
              rows={3}
              autoFocus
              className="w-full resize-none rounded-xl bg-white/[0.04] border border-white/10 px-3.5 py-2.5 text-[13px] text-white placeholder:text-text-muted/50 outline-none focus:border-blue-400/40 focus:bg-blue-400/5 transition-all duration-200"
            />
          </div>

          {/* ── Font Family ── */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-text-muted">
              Font
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {FONTS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => handleFontChange(f.value)}
                  className={cn(
                    'px-3 py-2 rounded-lg border text-[11px] text-left transition-all duration-200 cursor-pointer truncate',
                    font === f.value
                      ? 'border-blue-400/50 bg-blue-400/10 text-white shadow-[0_0_8px_rgba(96,165,250,0.15)]'
                      : 'border-white/8 bg-white/[0.02] text-text-secondary hover:text-white hover:border-white/15'
                  )}
                  style={{ fontFamily: f.value }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Bold / Italic ── */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-text-muted">
              Style
            </label>
            <div className="flex gap-2">
              <button
                onClick={handleBoldToggle}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border text-[11px] font-bold transition-all duration-200 cursor-pointer',
                  isBold
                    ? 'border-blue-400/50 bg-blue-400/10 text-blue-300'
                    : 'border-white/8 bg-white/[0.02] text-text-secondary hover:text-white hover:border-white/15'
                )}
              >
                <Bold className="w-3.5 h-3.5" />
                Bold
              </button>
              <button
                onClick={handleItalicToggle}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border text-[11px] font-bold transition-all duration-200 cursor-pointer',
                  isItalic
                    ? 'border-blue-400/50 bg-blue-400/10 text-blue-300'
                    : 'border-white/8 bg-white/[0.02] text-text-secondary hover:text-white hover:border-white/15'
                )}
              >
                <Italic className="w-3.5 h-3.5" />
                Italic
              </button>
            </div>
          </div>

          {/* ── Font Size ── */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-text-muted">
                Size
              </label>
              <span className="text-[10px] font-bold text-text-muted tabular-nums">{fontSize}px</span>
            </div>
            <input
              type="range"
              min={24}
              max={128}
              step={2}
              value={fontSize}
              onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-400 [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(96,165,250,0.5)] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:duration-200 [&::-webkit-slider-thumb]:hover:scale-125
                [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-400 [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:shadow-[0_0_8px_rgba(96,165,250,0.5)] [&::-moz-range-thumb]:cursor-pointer"
            />
          </div>

          {/* ── Color ── */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-text-muted">
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {COLOR_PRESETS.map((c) => (
                <button
                  key={c}
                  onClick={() => handleColorChange(c)}
                  title={c}
                  className="relative w-7 h-7 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:scale-110 flex-shrink-0"
                  style={{
                    backgroundColor: c,
                    borderColor: color === c ? '#60A5FA' : 'rgba(255,255,255,0.12)',
                    boxShadow: color === c ? '0 0 10px rgba(96,165,250,0.5)' : 'none',
                  }}
                >
                  {color === c && (
                    <Check
                      className="w-3 h-3 absolute inset-0 m-auto"
                      style={{ color: c === '#FFFFFF' || c === '#FFD700' ? '#111118' : '#fff' }}
                    />
                  )}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div
                className="w-7 h-7 rounded-lg border border-white/15 flex-shrink-0 transition-colors duration-150"
                style={{ backgroundColor: color }}
              />
              <input
                type="text"
                value={hexInput}
                onChange={(e) => handleHexChange(e.target.value)}
                placeholder="#FFFFFF"
                maxLength={7}
                className="flex-1 bg-white/[0.04] border border-white/10 rounded-lg px-3 py-1.5 text-[11px] font-mono text-white placeholder:text-text-muted/40 outline-none focus:border-blue-400/40 transition-all duration-200 uppercase"
              />
            </div>
          </div>

          {/* ── CSS Live Preview ── */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold tracking-[0.2em] uppercase text-text-muted">
                Preview
              </label>
              {text.trim() && (
                <span className="text-[9px] text-blue-400/70 font-semibold animate-pulse">
                  ● Live on shirt
                </span>
              )}
            </div>
            <div className="w-full min-h-[72px] rounded-xl border border-white/8 bg-[#1a1a24] flex items-center justify-center px-4 py-3 overflow-hidden">
              {text.trim() ? (
                <span
                  className="text-center leading-tight break-words max-w-full transition-all duration-150"
                  style={{
                    font: previewFontStyle,
                    color,
                    wordBreak: 'break-word',
                    fontFamily: font,
                  }}
                >
                  {text}
                </span>
              ) : (
                <span className="text-[11px] text-text-muted/40 select-none">
                  Your text will appear here…
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ── Footer CTA ── */}
        <div className="px-5 pb-6 pt-3 border-t border-white/8 flex-shrink-0 flex flex-col gap-2">
          <button
            onClick={handleAddToDesign}
            disabled={!text.trim()}
            className={cn(
              'w-full py-3 rounded-xl text-[11px] font-extrabold tracking-[0.18em] uppercase transition-all duration-300 cursor-pointer select-none',
              text.trim()
                ? 'bg-blue-500 hover:bg-blue-400 text-white shadow-[0_4px_20px_rgba(96,165,250,0.3)] hover:shadow-[0_6px_28px_rgba(96,165,250,0.5)] hover:-translate-y-0.5'
                : 'bg-white/5 text-text-muted cursor-not-allowed border border-white/8'
            )}
          >
            Confirm & Add to Design
          </button>
          <button
            onClick={handleClose}
            className="w-full py-2.5 rounded-xl text-[11px] font-bold tracking-[0.15em] uppercase text-text-muted hover:text-white border border-white/8 hover:border-white/15 transition-all duration-200 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Slide-in animation */}
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
};
