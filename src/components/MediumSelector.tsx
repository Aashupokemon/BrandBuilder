import React, { useState } from 'react';
import {
  Check,
  Plus,
  Sparkles,
  Maximize2,
  Newspaper,
  Instagram,
  Navigation,
  BookOpen,
  ShoppingBag,
  Box,
  Tv,
  Layers,
  Play,
  RefreshCw,
} from 'lucide-react';
import { MediumConfig, MediumType } from '../types';

interface MediumSelectorProps {
  mediums: MediumConfig[];
  onToggleMedium: (id: MediumType) => void;
  onSelectAll: (select: boolean) => void;
  onSelectRecommended: () => void;
  onAddCustomMedium: (title: string, aspectRatio: '16:9' | '4:3' | '1:1' | '3:4' | '9:16', desc: string) => void;
  onGenerateCampaign: () => void;
  isGenerating: boolean;
  selectedCount: number;
}

export const MediumSelector: React.FC<MediumSelectorProps> = ({
  mediums,
  onToggleMedium,
  onSelectAll,
  onSelectRecommended,
  onAddCustomMedium,
  onGenerateCampaign,
  isGenerating,
  selectedCount,
}) => {
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customAspect, setCustomAspect] = useState<'16:9' | '4:3' | '1:1' | '3:4' | '9:16'>('16:9');
  const [customDesc, setCustomDesc] = useState('');

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Maximize2':
        return <Maximize2 className="w-4 h-4" />;
      case 'Newspaper':
        return <Newspaper className="w-4 h-4" />;
      case 'Instagram':
        return <Instagram className="w-4 h-4" />;
      case 'Navigation':
        return <Navigation className="w-4 h-4" />;
      case 'BookOpen':
        return <BookOpen className="w-4 h-4" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-4 h-4" />;
      case 'Box':
        return <Box className="w-4 h-4" />;
      case 'Tv':
        return <Tv className="w-4 h-4" />;
      default:
        return <Layers className="w-4 h-4" />;
    }
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;
    onAddCustomMedium(
      customTitle.trim(),
      customAspect,
      customDesc.trim() || `Atmospheric commercial product photography in a ${customTitle.trim()} setting.`
    );
    setCustomTitle('');
    setCustomDesc('');
    setShowCustomModal(false);
  };

  return (
    <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5 sm:p-6 backdrop-blur-sm space-y-5">
      {/* Header and selection tools */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight">2. Select Target Mediums</h2>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 font-mono font-medium">
              {selectedCount} Selected
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5">
            Cross-medium consistency engine adapts your product into each distinctive physical format.
          </p>
        </div>

        {/* Quick select buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onSelectRecommended}
            className="text-xs px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-neutral-700 transition-colors font-medium cursor-pointer"
            title="Select Billboard, Broadsheet Newspaper, and Social Post"
          >
            Recommended Trio
          </button>
          <button
            type="button"
            onClick={() => onSelectAll(true)}
            className="text-xs px-2 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition-colors cursor-pointer"
          >
            All
          </button>
          <button
            type="button"
            onClick={() => onSelectAll(false)}
            className="text-xs px-2 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 border border-neutral-800 transition-colors cursor-pointer"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => setShowCustomModal(true)}
            className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-700 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>Custom</span>
          </button>
        </div>
      </div>

      {/* Grid of Medium Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {mediums.map((m) => {
          const isSelected = m.selected;
          const isCoreRecommended = ['billboard', 'newspaper', 'social'].includes(m.id);

          return (
            <div
              key={m.id}
              onClick={() => onToggleMedium(m.id)}
              className={`group relative p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-neutral-950/90 border-amber-400/60 shadow-lg shadow-amber-500/5 ring-1 ring-amber-400/20'
                  : 'bg-neutral-950/40 border-neutral-800/80 hover:border-neutral-700 text-neutral-400'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-amber-400/15 text-amber-400 border border-amber-400/30'
                        : 'bg-neutral-900 text-neutral-500 border border-neutral-800 group-hover:text-neutral-300'
                    }`}
                  >
                    {getIcon(m.iconName)}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {isCoreRecommended && (
                      <span className="text-[9px] uppercase tracking-wider font-mono font-semibold px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20">
                        Prompt Pick
                      </span>
                    )}
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-800">
                      {m.aspectRatio}
                    </span>
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-amber-400 text-neutral-950'
                          : 'border border-neutral-700 group-hover:border-neutral-500'
                      }`}
                    >
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </div>
                  </div>
                </div>

                <h3
                  className={`text-sm font-semibold tracking-tight transition-colors ${
                    isSelected ? 'text-white' : 'text-neutral-300'
                  }`}
                >
                  {m.title}
                </h3>
                <p className="text-[11px] text-amber-400/90 font-medium mb-1">{m.subtitle}</p>
                <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                  {m.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Campaign Generation Trigger */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-800/70">
        <div className="text-xs text-neutral-400 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Generates <strong>{selectedCount} unique campaign shots</strong> simultaneously using Nano-Banana.
          </span>
        </div>

        <button
          type="button"
          onClick={onGenerateCampaign}
          disabled={isGenerating || selectedCount === 0}
          className={`w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-bold px-6 py-3 rounded-xl transition-all shadow-lg ${
            selectedCount > 0 && !isGenerating
              ? 'bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-300 hover:to-orange-400 text-neutral-950 shadow-amber-500/20 cursor-pointer active:scale-[0.98]'
              : 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700'
          }`}
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-neutral-950" />
              <span>Synthesizing Across Mediums...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current text-neutral-950" />
              <span>Imagine Across {selectedCount} Mediums</span>
            </>
          )}
        </button>
      </div>

      {/* Custom Medium Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Add Custom Medium</h3>
            <p className="text-xs text-neutral-400">
              Imagine your product in any bespoke architectural or print setting (e.g. Cinema marquee, Vintage Kraft Box, Glass Bus Shelter).
            </p>

            <form onSubmit={handleCreateCustom} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Medium Title
                </label>
                <input
                  type="text"
                  required
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="e.g., Luxury Airport Lounge Display, Bus Shelter Vitrine"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Aspect Ratio
                </label>
                <select
                  value={customAspect}
                  onChange={(e) => setCustomAspect(e.target.value as any)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                >
                  <option value="16:9">16:9 (Landscape / Billboard / Cinematic)</option>
                  <option value="4:3">4:3 (Traditional / Broadsheet / Editorial)</option>
                  <option value="1:1">1:1 (Square / Studio / Social Grid)</option>
                  <option value="3:4">3:4 (Portrait / Transit / Poster)</option>
                  <option value="9:16">9:16 (Vertical / Mobile Story / Kiosk)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Scenic Details (Optional)
                </label>
                <textarea
                  rows={2}
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  placeholder="Describe lighting, surfaces, background architecture..."
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-400 hover:text-white bg-neutral-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 cursor-pointer"
                >
                  Add Medium
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
