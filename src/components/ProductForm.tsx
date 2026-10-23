import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Wand2,
  Image as ImageIcon,
  Upload,
  X,
  Palette,
  Layers,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Camera,
  RefreshCw,
} from 'lucide-react';
import { BrandProduct } from '../types';

interface ProductFormProps {
  product: BrandProduct;
  onChange: (updated: BrandProduct) => void;
  onGenerateMasterShot: () => Promise<void>;
  isGeneratingMaster: boolean;
  selectedModel: string;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  product,
  onChange,
  onGenerateMasterShot,
  isGeneratingMaster,
  selectedModel,
}) => {
  const [isEnhancingDna, setIsEnhancingDna] = useState(false);
  const [dnaEnhancedMessage, setDnaEnhancedMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quick categories
  const categories = [
    'Luxury Skincare',
    'Fine Horology',
    'Gourmet Beverage',
    'Audio & Tech',
    'Footwear & Apparel',
    'Automotive & Mobility',
    'Home & Industrial Design',
  ];

  // AI DNA Synthesizer
  const handleEnhanceDna = async () => {
    setIsEnhancingDna(true);
    setDnaEnhancedMessage(null);
    try {
      const res = await fetch('/api/brand/enhance-dna', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: product.name,
          category: product.category,
          rawDescription: product.description,
          colors: product.colors.map((c) => `${c.name} (${c.hex})`),
          materials: product.materials.join(', '),
          logoDescription: product.logoDetails,
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        onChange({
          ...product,
          canonicalDna: data.data.canonicalDna || product.canonicalDna,
          materials: data.data.materialsList?.length ? data.data.materialsList : product.materials,
          colors: data.data.colorPalette?.length ? data.data.colorPalette : product.colors,
          tagline: data.data.recommendedTagline || product.tagline,
        });
        setDnaEnhancedMessage('Visual DNA synthesized! Consistency tokens updated.');
        setTimeout(() => setDnaEnhancedMessage(null), 4000);
      } else {
        alert(data.error || 'Failed to synthesize DNA');
      }
    } catch (err: any) {
      alert('Error connecting to DNA synthesizer: ' + err.message);
    } finally {
      setIsEnhancingDna(false);
    }
  };

  // Handle image upload as master reference
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onChange({
        ...product,
        masterImage: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  // Color addition
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#d4af37');

  const addColor = () => {
    if (!newColorName.trim()) return;
    onChange({
      ...product,
      colors: [...product.colors, { name: newColorName.trim(), hex: newColorHex }],
    });
    setNewColorName('');
  };

  const removeColor = (idx: number) => {
    onChange({
      ...product,
      colors: product.colors.filter((_, i) => i !== idx),
    });
  };

  // Material tags
  const [newMaterial, setNewMaterial] = useState('');
  const addMaterial = () => {
    if (!newMaterial.trim()) return;
    onChange({
      ...product,
      materials: [...product.materials, newMaterial.trim()],
    });
    setNewMaterial('');
  };

  const removeMaterial = (idx: number) => {
    onChange({
      ...product,
      materials: product.materials.filter((_, i) => i !== idx),
    });
  };

  return (
    <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5 sm:p-6 backdrop-blur-sm space-y-6">
      {/* Title & badge */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white tracking-tight">1. Product Visual DNA</h2>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300 font-mono">
              Anchor Identity
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Specify the exact physical silhouette, materials, and colors to preserve across all medium shots.
          </p>
        </div>

        {/* AI DNA Synthesizer Button */}
        <button
          type="button"
          onClick={handleEnhanceDna}
          disabled={isEnhancingDna || !product.name}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-500/40 transition-all cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          title="Use Gemini 3.8 Flash to synthesize exact geometric & physical tokens"
        >
          {isEnhancingDna ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
          ) : (
            <Wand2 className="w-3.5 h-3.5 text-amber-400" />
          )}
          <span>{isEnhancingDna ? 'Synthesizing...' : 'Synthesize DNA'}</span>
        </button>
      </div>

      {dnaEnhancedMessage && (
        <div className="text-xs flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{dnaEnhancedMessage}</span>
        </div>
      )}

      {/* Basic fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Product Name */}
        <div>
          <label className="block text-xs font-semibold text-neutral-300 mb-1">
            Product & Brand Name <span className="text-amber-400">*</span>
          </label>
          <input
            type="text"
            value={product.name}
            onChange={(e) => onChange({ ...product, name: e.target.value })}
            placeholder="e.g., Lumina Glow Radiance Serum"
            className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400/80 rounded-xl px-3.5 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-colors"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold text-neutral-300 mb-1">
            Category <span className="text-amber-400">*</span>
          </label>
          <input
            type="text"
            value={product.category}
            onChange={(e) => onChange({ ...product, category: e.target.value })}
            placeholder="e.g., Luxury Skincare, Fine Horology, Tech"
            className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400/80 rounded-xl px-3.5 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-colors"
          />
        </div>
      </div>

      {/* Category quick chips */}
      <div className="flex flex-wrap items-center gap-1.5 -mt-2">
        <span className="text-[11px] text-neutral-500 mr-1 font-mono">Suggested:</span>
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onChange({ ...product, category: cat })}
            className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all ${
              product.category.toLowerCase() === cat.toLowerCase()
                ? 'bg-amber-400/10 border-amber-400/50 text-amber-300 font-medium'
                : 'bg-neutral-950/60 border-neutral-800/80 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Canonical Visual DNA Blueprint (Crucial for Consistency) */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-semibold text-neutral-200 flex items-center gap-1.5">
            <span>Canonical Visual DNA Specification</span>
            <span className="text-[10px] bg-amber-400/15 text-amber-300 px-1.5 py-0.2 rounded border border-amber-400/30">
              Injected into all shots
            </span>
          </label>
          <span className="text-[11px] text-neutral-400 font-mono">
            Key to cross-medium consistency
          </span>
        </div>
        <textarea
          rows={3}
          value={product.canonicalDna}
          onChange={(e) => onChange({ ...product, canonicalDna: e.target.value })}
          placeholder="Describe the exact silhouette geometry, materials, cap/closures, textures, embossed typography, and finishes that must appear identical in every shot..."
          className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400/80 rounded-xl p-3 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-colors leading-relaxed font-mono"
        />
      </div>

      {/* Color Palette & Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
        {/* Color Palette */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span>Brand Color Palette</span>
            </label>
            <span className="text-[11px] text-neutral-500 font-mono">
              {product.colors.length} active
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {product.colors.map((c, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-200 shadow-sm"
              >
                <span
                  className="w-3 h-3 rounded-full border border-neutral-700 shrink-0"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="font-medium">{c.name}</span>
                <span className="text-[10px] text-neutral-400 font-mono uppercase">{c.hex}</span>
                <button
                  type="button"
                  onClick={() => removeColor(idx)}
                  className="text-neutral-500 hover:text-red-400 p-0.5 rounded transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Add color row */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="color"
              value={newColorHex}
              onChange={(e) => setNewColorHex(e.target.value)}
              className="w-8 h-8 rounded-lg cursor-pointer bg-neutral-950 border border-neutral-800 p-0.5 shrink-0"
            />
            <input
              type="text"
              value={newColorName}
              onChange={(e) => setNewColorName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addColor();
                }
              }}
              placeholder="e.g., Cobalt Blue, Rose Gold"
              className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
            <button
              type="button"
              onClick={addColor}
              className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {/* Materials & Finishes */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              <span>Physical Materials & Textures</span>
            </label>
            <span className="text-[11px] text-neutral-500 font-mono">
              {product.materials.length} tags
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {product.materials.map((m, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-300"
              >
                <span>{m}</span>
                <button
                  type="button"
                  onClick={() => removeMaterial(idx)}
                  className="text-neutral-500 hover:text-red-400 p-0.5 rounded transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          {/* Add material row */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="text"
              value={newMaterial}
              onChange={(e) => setNewMaterial(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addMaterial();
                }
              }}
              placeholder="e.g., Frosted borosilicate glass, brushed brass"
              className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
            <button
              type="button"
              onClick={addMaterial}
              className="px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Logo & Brand Mark Description */}
      <div>
        <label className="block text-xs font-semibold text-neutral-300 mb-1">
          Signature Brandmark / Logo & Label Detail
        </label>
        <input
          type="text"
          value={product.logoDetails}
          onChange={(e) => onChange({ ...product, logoDetails: e.target.value })}
          placeholder="e.g., Minimalist geometric crescent moon crest with debossed gold foil sans-serif logotype"
          className="w-full bg-neutral-950 border border-neutral-800 focus:border-amber-400/80 rounded-xl px-3.5 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-colors"
        />
      </div>

      {/* Master Visual Anchor Image Section */}
      <div className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800/80 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-neutral-200">
                Master Product Hero Shot (Visual Consistency Reference)
              </span>
              {product.masterImage ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/60 font-medium">
                  Active Reference
                </span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400">
                  Optional
                </span>
              )}
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Providing a master image allows Nano-Banana to visually reference identical shapes and textures across mediums.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Generate master shot */}
            <button
              type="button"
              onClick={onGenerateMasterShot}
              disabled={isGeneratingMaster || !product.name}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-neutral-700 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              title="Generate a clean studio master shot with Nano-Banana"
            >
              {isGeneratingMaster ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Camera className="w-3.5 h-3.5" />
              )}
              <span>{isGeneratingMaster ? 'Generating...' : 'Generate Master'}</span>
            </button>

            {/* Upload reference */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition-all cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload</span>
            </button>
          </div>
        </div>

        {/* Master image preview if present */}
        {product.masterImage && (
          <div className="relative inline-flex items-center gap-4 p-2 rounded-xl bg-neutral-900 border border-neutral-800">
            <img
              src={product.masterImage}
              alt="Master Product Anchor"
              className="w-16 h-16 rounded-lg object-cover border border-neutral-700 shadow-sm"
            />
            <div className="text-xs">
              <p className="font-semibold text-neutral-200">Master Product Reference Attached</p>
              <p className="text-[11px] text-neutral-400">
                Nano-Banana will align all billboard, newspaper, and social shots with this exact physical geometry.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onChange({ ...product, masterImage: undefined })}
              className="absolute top-2 right-2 text-neutral-400 hover:text-red-400 p-1 rounded-md hover:bg-neutral-800 transition-colors"
              title="Remove master reference"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Zero humans reminder banner */}
      <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800/80 text-xs text-neutral-400">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
        <p>
          <strong className="text-neutral-200">Zero People Mandate:</strong> All generated shots strictly depict the inanimate product and atmospheric architectural or print environments. No models, passersby, or hands.
        </p>
      </div>
    </div>
  );
};
