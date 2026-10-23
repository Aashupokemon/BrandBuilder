import React, { useState } from 'react';
import { X, Download, ZoomIn, ZoomOut, ShieldCheck, Sparkles } from 'lucide-react';
import { GeneratedShot } from '../types';

interface LightboxModalProps {
  shot: GeneratedShot | null;
  productName: string;
  onClose: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({ shot, productName, onClose }) => {
  const [zoomLevel, setZoomLevel] = useState(1);

  if (!shot) return null;

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fadeIn">
      {/* Top Header Controls */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-10">
        <div className="flex items-center gap-3">
          <div className="bg-neutral-900/80 border border-neutral-700 px-3 py-1.5 rounded-xl backdrop-blur-sm">
            <span className="font-bold text-sm tracking-tight text-white">{shot.mediumTitle}</span>
            <span className="text-xs text-neutral-400 ml-2 font-mono">({shot.aspectRatio})</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nano-Banana Model</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero People Guarantee</span>
          </div>
        </div>

        {/* Zoom Controls & Close */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-neutral-900/80 border border-neutral-700 rounded-xl p-1 backdrop-blur-sm">
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-300 hover:text-white transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              className="px-2 py-1 text-xs font-mono text-neutral-300 hover:text-white"
            >
              {Math.round(zoomLevel * 100)}%
            </button>
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1.5 hover:bg-neutral-800 rounded-lg text-neutral-300 hover:text-white transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          <a
            href={shot.imageUrl}
            download={`${productName.toLowerCase().replace(/\s+/g, '-')}-${shot.medium}.png`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold text-xs transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </a>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700 text-neutral-400 hover:text-white transition-colors"
            title="Close Lightbox"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main image viewer with pan/zoom */}
      <div className="w-full h-full flex items-center justify-center overflow-auto p-8 pt-16 pb-16">
        <div
          className="transition-transform duration-200 ease-out flex items-center justify-center max-w-full max-h-full"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <img
            src={shot.imageUrl}
            alt={shot.mediumTitle}
            className="max-h-[82vh] max-w-[92vw] object-contain rounded-xl shadow-2xl border border-neutral-800 select-none"
          />
        </div>
      </div>

      {/* Bottom info pill */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-neutral-950/80 border border-neutral-800 backdrop-blur-md px-4 py-2 rounded-full text-xs text-neutral-300 flex items-center gap-3">
        <span>Product: <strong className="text-white">{productName}</strong></span>
        <span className="text-neutral-600">•</span>
        <span>Canvas: <strong className="text-white">{shot.mediumTitle}</strong></span>
        <span className="text-neutral-600">•</span>
        <span className="font-mono text-neutral-400">{shot.modelUsed}</span>
      </div>
    </div>
  );
};
