import React, { useState } from 'react';
import {
  Maximize2,
  Download,
  RotateCw,
  Code2,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Sliders,
  Check,
} from 'lucide-react';
import { GeneratedShot, MediumType } from '../types';

interface MediumCardProps {
  shot: GeneratedShot;
  productName: string;
  tagline: string;
  onOpenLightbox: (shot: GeneratedShot) => void;
  onOpenPrompt: (shot: GeneratedShot) => void;
  onRegenerate: (shot: GeneratedShot, customTweak?: string) => void;
}

export const MediumCard: React.FC<MediumCardProps> = ({
  shot,
  productName,
  tagline,
  onOpenLightbox,
  onOpenPrompt,
  onRegenerate,
}) => {
  const [showTweakInput, setShowTweakInput] = useState(false);
  const [tweakText, setTweakText] = useState(shot.customTweak || '');

  // Medium specific labels & mockup styles
  const renderMockupFrame = () => {
    switch (shot.medium) {
      case 'billboard':
        return (
          <div className="relative group bg-neutral-900 border-2 border-neutral-700/80 rounded-lg p-2.5 pb-4 shadow-2xl">
            {/* Top floodlights */}
            <div className="flex justify-around mb-2 px-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-3 h-2 bg-neutral-600 rounded-t-sm shadow-sm" />
                  <div className="w-1.5 h-1.5 bg-amber-300 rounded-full shadow-[0_0_8px_#f59e0b]" />
                </div>
              ))}
            </div>

            {/* Canvas */}
            <div className="relative overflow-hidden rounded border border-neutral-800 bg-neutral-950 aspect-video">
              <img
                src={shot.imageUrl}
                alt={`${productName} Billboard`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-neutral-300 font-mono flex items-center gap-1 border border-neutral-700/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>OUTDOOR MEGA-CANVAS (16:9)</span>
              </div>
            </div>

            {/* Bottom steel truss structure */}
            <div className="mt-2.5 flex items-center justify-between px-2 text-[10px] font-mono text-neutral-400">
              <span className="tracking-widest uppercase">STEEL GANTRY SPEC #408</span>
              <span className="text-amber-400/80 font-bold">CLEAR VIEW HWY</span>
            </div>
          </div>
        );

      case 'newspaper':
        return (
          <div className="relative group bg-[#f7f5ed] text-neutral-900 rounded-lg p-3 sm:p-4 shadow-2xl border border-[#ded9cb] overflow-hidden">
            {/* Broadsheet Newspaper Header */}
            <div className="border-b-2 border-neutral-900 pb-2 mb-2 text-center">
              <div className="flex items-center justify-between text-[8px] font-serif-editorial uppercase tracking-widest text-neutral-600 px-1">
                <span>VOL. CXLIV NO. 29</span>
                <span>GLOBAL ADVERTISING REVIEW</span>
                <span>PRICE $4.50</span>
              </div>
              <h4 className="font-serif-editorial text-base sm:text-lg font-bold tracking-tight text-neutral-900 uppercase mt-0.5">
                The Financial Brand Chronicle
              </h4>
              <div className="flex justify-between items-center text-[7px] text-neutral-500 border-t border-neutral-300 pt-0.5 mt-0.5">
                <span>INTERNATIONAL EDITION</span>
                <span>EXCLUSIVE STILL LIFE FEATURE</span>
                <span>METRO CIRCULATION</span>
              </div>
            </div>

            {/* Article + Image layout */}
            <div className="space-y-2">
              <div className="relative border border-neutral-900/40 rounded overflow-hidden aspect-[4/3] bg-neutral-200">
                <img
                  src={shot.imageUrl}
                  alt={`${productName} Newspaper Print Ad`}
                  className="w-full h-full object-cover grayscale-[25%] contrast-[1.05] transition-transform duration-500 group-hover:scale-[1.02]"
                />
                <div className="absolute top-1.5 left-1.5 bg-neutral-900/85 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] text-[#f7f5ed] font-serif-editorial">
                  FULL-PAGE BROADSHEET AD
                </div>
              </div>

              {/* Newspaper columns dummy text */}
              <div className="grid grid-cols-2 gap-2 text-[8px] text-neutral-700 leading-tight border-t border-neutral-300 pt-1.5 font-serif-editorial">
                <div>
                  <strong className="block text-neutral-900 uppercase font-sans text-[8px]">
                    DESIGN DISTINCTION
                  </strong>
                  The new {productName} establishes a benchmark in structural purity and material tactile integrity.
                </div>
                <div>
                  <strong className="block text-neutral-900 uppercase font-sans text-[8px]">
                    CRITICAL ACCLAIM
                  </strong>
                  "A triumph of restraint and pure inanimate engineering," notes the annual product retrospective.
                </div>
              </div>
            </div>
          </div>
        );

      case 'social':
        return (
          <div className="relative group bg-neutral-950 text-white rounded-2xl border border-neutral-800 p-3 shadow-2xl max-w-sm mx-auto">
            {/* Social Post Header */}
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-500 p-[1.5px]">
                  <div className="w-full h-full bg-neutral-950 rounded-full flex items-center justify-center font-bold text-[10px] text-amber-300">
                    {productName.slice(0, 1).toUpperCase()}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-white tracking-tight">
                      {productName.toLowerCase().replace(/\s+/g, '_')}
                    </span>
                    <span className="w-3 h-3 rounded-full bg-blue-500 text-[8px] flex items-center justify-center font-bold text-white">
                      ✓
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-400">Sponsored Studio Still Life</span>
                </div>
              </div>
              <div className="text-neutral-500 text-xs">•••</div>
            </div>

            {/* Social Image Canvas */}
            <div className="relative overflow-hidden rounded-xl border border-neutral-800 aspect-square bg-neutral-900">
              <img
                src={shot.imageUrl}
                alt={`${productName} Social Post`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-neutral-300 font-mono">
                1:1 FEED
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 px-1">
              <div className="flex items-center justify-between mb-1.5 text-neutral-300">
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4 text-red-500 fill-red-500 cursor-pointer" />
                  <MessageCircle className="w-4 h-4 cursor-pointer hover:text-white" />
                  <Share2 className="w-4 h-4 cursor-pointer hover:text-white" />
                </div>
                <Bookmark className="w-4 h-4 cursor-pointer hover:text-white" />
              </div>
              <p className="text-[11px] text-neutral-300 line-clamp-2">
                <strong className="text-white mr-1.5">{productName}</strong>
                {tagline || 'Experience unmatched craft and architectural form. Pure product still life.'}
              </p>
              <span className="text-[9px] text-neutral-500 uppercase tracking-wider block mt-1">
                2 HOURS AGO • NANO-BANANA RENDER
              </span>
            </div>
          </div>
        );

      case 'subway':
        return (
          <div className="relative group bg-neutral-950 p-3 sm:p-4 rounded-xl border-4 border-neutral-800 shadow-2xl newspaper-halftone">
            {/* Metro wall tiles illusion */}
            <div className="absolute top-2 left-3 text-[9px] font-mono font-bold text-neutral-500 tracking-widest uppercase">
              5TH AVE // DOWNTOWN PLATFORM
            </div>

            {/* Illuminated poster frame */}
            <div className="mt-5 relative overflow-hidden rounded-md border-2 border-amber-400/40 shadow-[0_0_25px_rgba(251,191,36,0.15)] aspect-[3/4] bg-neutral-900">
              <img
                src={shot.imageUrl}
                alt={`${productName} Subway Poster`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-neutral-200 font-mono">
                BACKLIT LIGHTBOX (3:4)
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="relative group bg-neutral-950 border border-neutral-800 rounded-xl overflow-hidden p-2 shadow-xl">
            <div className="relative overflow-hidden rounded-lg aspect-auto max-h-[420px] bg-neutral-900 flex items-center justify-center">
              <img
                src={shot.imageUrl}
                alt={`${productName} in ${shot.mediumTitle}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
              <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-neutral-300 font-mono">
                {shot.aspectRatio} • {shot.mediumTitle.toUpperCase()}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-neutral-900/40 border border-neutral-800/90 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4 hover:border-neutral-700 transition-colors">
      {/* Top Header of Card */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm sm:text-base text-white tracking-tight">
              {shot.mediumTitle}
            </h3>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300">
              {shot.aspectRatio}
            </span>
          </div>
          <p className="text-xs text-amber-400/90 font-medium mt-0.5">
            Model: Nano-Banana ({shot.modelUsed.includes('2.1') ? 'v2.1' : 'Flash-Lite'})
          </p>
        </div>

        {/* Zero human badge */}
        <div
          className="flex items-center gap-1 text-[10px] font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-full"
          title="Strict negative prompts guarantee zero human models or hands"
        >
          <ShieldCheck className="w-3 h-3" />
          <span>Zero People</span>
        </div>
      </div>

      {/* Realistic Mockup Rendering */}
      <div>{renderMockupFrame()}</div>

      {/* Custom tweak input if open */}
      {showTweakInput && (
        <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 animate-fadeIn">
          <label className="block text-[11px] font-semibold text-neutral-300">
            Creative Adjustment for this Shot:
          </label>
          <input
            type="text"
            value={tweakText}
            onChange={(e) => setTweakText(e.target.value)}
            placeholder="e.g. Golden hour sunset lighting, soft morning mist, rain reflections..."
            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowTweakInput(false)}
              className="text-[11px] text-neutral-400 hover:text-white px-2 py-1"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                onRegenerate(shot, tweakText);
                setShowTweakInput(false);
              }}
              className="text-[11px] font-semibold px-2.5 py-1 rounded bg-amber-400 text-neutral-950 hover:bg-amber-300"
            >
              Apply & Re-Roll
            </button>
          </div>
        </div>
      )}

      {/* Action Toolbar */}
      <div className="pt-2 border-t border-neutral-800/70 flex items-center justify-between text-xs text-neutral-400">
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Zoom / Lightbox */}
          <button
            type="button"
            onClick={() => onOpenLightbox(shot)}
            className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            title="Inspect in Fullscreen Lightbox"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Prompt Viewer */}
          <button
            type="button"
            onClick={() => onOpenPrompt(shot)}
            className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            title="View Prompt & Consistency Parameters"
          >
            <Code2 className="w-4 h-4" />
          </button>

          {/* Tweak / Refine */}
          <button
            type="button"
            onClick={() => setShowTweakInput(!showTweakInput)}
            className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-300 hover:text-amber-300 transition-colors cursor-pointer"
            title="Adjust lighting or scene tweaks"
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Re-Roll */}
          <button
            type="button"
            onClick={() => onRegenerate(shot, tweakText)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium transition-colors cursor-pointer"
            title="Re-generate this shot while keeping exact product DNA"
          >
            <RotateCw className="w-3.5 h-3.5 text-amber-400" />
            <span>Re-Roll</span>
          </button>

          {/* Download */}
          <a
            href={shot.imageUrl}
            download={`${productName.toLowerCase().replace(/\s+/g, '-')}-${shot.medium}.png`}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium transition-colors cursor-pointer"
            title="Download high-resolution image"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </a>
        </div>
      </div>
    </div>
  );
};
