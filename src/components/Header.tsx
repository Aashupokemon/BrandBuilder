import React from 'react';
import { Layers, Sparkles, ShieldCheck, Download, Zap, RefreshCw } from 'lucide-react';
import { ProductPreset } from '../types';
import { BRAND_PRESETS } from '../constants/presets';

interface HeaderProps {
  selectedPresetId: string;
  onSelectPreset: (preset: ProductPreset) => void;
  onExportKit: () => void;
  hasShots: boolean;
  isExporting: boolean;
  selectedModel: string;
  onSelectModel: (model: string) => void;
  apiKeyOk: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  selectedPresetId,
  onSelectPreset,
  onExportKit,
  hasShots,
  isExporting,
  selectedModel,
  onSelectModel,
  apiKeyOk,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-neutral-950 font-black">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white tracking-tight">Brand builder</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Nano-Banana
              </span>
            </div>
            <p className="text-xs text-neutral-400 hidden sm:block">
              Cross-medium consistent product visualizer • Billboard, Newspaper, Social & beyond
            </p>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Zero People Guard indicator */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zero Humans Constraint</span>
          </div>

          {/* Model selector dropdown */}
          <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg p-0.5">
            <button
              type="button"
              onClick={() => onSelectModel('gemini-3.1-flash-lite-image')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                selectedModel === 'gemini-3.1-flash-lite-image'
                  ? 'bg-amber-400 text-neutral-950 shadow-sm font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title="Nano-Banana default image model"
            >
              Nano-Banana
            </button>
            <button
              type="button"
              onClick={() => onSelectModel('gemini-nano-banana-2.1')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                selectedModel === 'gemini-nano-banana-2.1'
                  ? 'bg-amber-400 text-neutral-950 shadow-sm font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title="Nano-Banana 2.1 high fidelity model"
            >
              Nano-Banana 2.1
            </button>
          </div>

          {/* Presets dropdown */}
          <div className="relative">
            <select
              value={selectedPresetId}
              onChange={(e) => {
                const found = BRAND_PRESETS.find((p) => p.id === e.target.value);
                if (found) onSelectPreset(found);
              }}
              className="bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-medium border border-neutral-700/80 rounded-lg px-2.5 py-1.5 pr-7 focus:outline-none focus:ring-1 focus:ring-amber-400 cursor-pointer appearance-none"
              style={{
                backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 0.5rem center',
                backgroundSize: '1em',
              }}
            >
              <option value="custom" disabled={selectedPresetId !== 'custom'}>
                Load Archetype Preset...
              </option>
              {BRAND_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* Export Brand Kit */}
          <button
            type="button"
            onClick={onExportKit}
            disabled={!hasShots || isExporting}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
              hasShots && !isExporting
                ? 'bg-amber-400 hover:bg-amber-300 text-neutral-950 border-amber-300 shadow-sm cursor-pointer'
                : 'bg-neutral-900 text-neutral-500 border-neutral-800 cursor-not-allowed opacity-60'
            }`}
            title={hasShots ? 'Download all campaign shots as a ZIP' : 'Generate shots to export kit'}
          >
            {isExporting ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">Export Kit</span>
          </button>
        </div>
      </div>
    </header>
  );
};
