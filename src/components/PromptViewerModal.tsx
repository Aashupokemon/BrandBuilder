import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Sparkles, ShieldCheck } from 'lucide-react';
import { GeneratedShot } from '../types';

interface PromptViewerModalProps {
  shot: GeneratedShot | null;
  onClose: () => void;
}

export const PromptViewerModal: React.FC<PromptViewerModalProps> = ({ shot, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!shot) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(shot.promptUsed);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-neutral-900 border border-neutral-700/80 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base text-white">Prompt & Consistency Specification</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-300 font-mono">
            Medium: {shot.mediumTitle}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-300 font-mono">
            Aspect Ratio: {shot.aspectRatio}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-300 font-mono flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> {shot.modelUsed}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-950/50 border border-emerald-800/50 text-emerald-300 font-mono flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Zero People Active
          </span>
        </div>

        {/* Prompt content */}
        <div className="relative">
          <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 font-mono text-xs text-neutral-300 whitespace-pre-wrap max-h-80 overflow-y-auto leading-relaxed">
            {shot.promptUsed}
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium border border-neutral-700 transition-all cursor-pointer shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-neutral-400" />
                <span>Copy Prompt</span>
              </>
            )}
          </button>
        </div>

        {/* Info note */}
        <p className="text-[11px] text-neutral-400">
          This prompt embeds the Canonical Visual DNA tokens, medium-specific staging geometry, and the strict zero-human directive into the Nano-Banana image model.
        </p>
      </div>
    </div>
  );
};
