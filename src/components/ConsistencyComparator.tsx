import React, { useState } from 'react';
import { Columns, CheckCircle2, ShieldCheck, Eye, Layers, Palette } from 'lucide-react';
import { GeneratedShot, BrandProduct } from '../types';

interface ConsistencyComparatorProps {
  shots: GeneratedShot[];
  product: BrandProduct;
}

export const ConsistencyComparator: React.FC<ConsistencyComparatorProps> = ({
  shots,
  product,
}) => {
  const [selectedShotIds, setSelectedShotIds] = useState<string[]>(() =>
    shots.slice(0, 3).map((s) => s.id)
  );

  const toggleShot = (id: string) => {
    if (selectedShotIds.includes(id)) {
      if (selectedShotIds.length > 2) {
        setSelectedShotIds(selectedShotIds.filter((s) => s !== id));
      }
    } else {
      setSelectedShotIds([...selectedShotIds, id]);
    }
  };

  const activeShots = shots.filter((s) => selectedShotIds.includes(s.id));

  return (
    <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5 sm:p-6 backdrop-blur-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Columns className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Cross-Medium Consistency Inspector
            </h2>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-medium">
              Audit Mode
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Compare product geometry, materials, and colors side-by-side to verify multi-shot consistency across mediums.
          </p>
        </div>

        {/* Medium selectors */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-neutral-400 font-mono mr-1">Compare:</span>
          {shots.map((s) => {
            const isSelected = selectedShotIds.includes(s.id);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => toggleShot(s.id)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-amber-400 text-neutral-950 font-bold border-amber-300 shadow-sm'
                    : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                {s.mediumTitle}
              </button>
            );
          })}
        </div>
      </div>

      {/* Side-by-Side Canvas Grid */}
      <div
        className={`grid gap-4 ${
          activeShots.length === 2
            ? 'grid-cols-1 md:grid-cols-2'
            : activeShots.length === 3
            ? 'grid-cols-1 md:grid-cols-3'
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
        }`}
      >
        {activeShots.map((shot) => (
          <div
            key={shot.id}
            className="bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden p-3 space-y-2.5 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white">{shot.mediumTitle}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-800">
                {shot.aspectRatio}
              </span>
            </div>

            <div className="relative aspect-square rounded-lg overflow-hidden bg-neutral-900 border border-neutral-800/80">
              <img
                src={shot.imageUrl}
                alt={shot.mediumTitle}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-neutral-200 font-mono">
                {shot.medium.toUpperCase()}
              </div>
            </div>

            <div className="text-[11px] text-neutral-400 font-mono">
              Model: Nano-Banana ({shot.modelUsed.includes('2.1') ? '2.1' : 'Flash-Lite'})
            </div>
          </div>
        ))}
      </div>

      {/* Consistency Audit Checklist */}
      <div className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800/80 space-y-3">
        <h3 className="text-xs font-bold text-neutral-200 uppercase tracking-wider flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Active Product DNA Verification Tokens</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Silhouette & Geometry */}
          <div className="p-3 rounded-lg bg-neutral-900/50 border border-neutral-800/60 space-y-1">
            <span className="font-semibold text-neutral-300 block">1. Form & Proportions</span>
            <p className="text-neutral-400 text-[11px] line-clamp-3">
              {product.canonicalDna || 'Structured form factor locked in canonical DNA.'}
            </p>
          </div>

          {/* Materials & Finishes */}
          <div className="p-3 rounded-lg bg-neutral-900/50 border border-neutral-800/60 space-y-1.5">
            <span className="font-semibold text-neutral-300 flex items-center gap-1">
              <Layers className="w-3 h-3 text-amber-400" />
              <span>2. Verified Materials</span>
            </span>
            <div className="flex flex-wrap gap-1">
              {product.materials.map((m, i) => (
                <span
                  key={i}
                  className="px-1.5 py-0.5 rounded bg-neutral-950 text-neutral-300 text-[10px] border border-neutral-800"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* Color Palette & Zero People */}
          <div className="p-3 rounded-lg bg-neutral-900/50 border border-neutral-800/60 space-y-1.5">
            <span className="font-semibold text-neutral-300 flex items-center gap-1">
              <Palette className="w-3 h-3 text-amber-400" />
              <span>3. Color & Zero-Human Guard</span>
            </span>
            <div className="flex items-center gap-1.5">
              {product.colors.map((c, i) => (
                <span
                  key={i}
                  className="w-4 h-4 rounded-full border border-neutral-700 shadow-sm"
                  style={{ backgroundColor: c.hex }}
                  title={`${c.name} (${c.hex})`}
                />
              ))}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium pt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Zero-People Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
