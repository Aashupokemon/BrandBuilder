import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import {
  Sparkles,
  Layers,
  Columns,
  Download,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Eye,
  Sliders,
  ShieldCheck,
  Maximize2,
  Camera,
  Play,
  RotateCcw,
} from 'lucide-react';
import { Header } from './components/Header';
import { ProductForm } from './components/ProductForm';
import { MediumSelector } from './components/MediumSelector';
import { MediumCard } from './components/MediumCard';
import { LightboxModal } from './components/LightboxModal';
import { PromptViewerModal } from './components/PromptViewerModal';
import { ConsistencyComparator } from './components/ConsistencyComparator';
import { BRAND_PRESETS, INITIAL_MEDIUMS } from './constants/presets';
import { BrandProduct, GeneratedShot, MediumConfig, MediumType, ProductPreset } from './types';

export default function App() {
  // Active product
  const [selectedPresetId, setSelectedPresetId] = useState<string>(BRAND_PRESETS[0].id);
  const [product, setProduct] = useState<BrandProduct>(BRAND_PRESETS[0].product);

  // Active mediums
  const [mediums, setMediums] = useState<MediumConfig[]>(INITIAL_MEDIUMS);

  // Model selection (Nano-Banana)
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.1-flash-lite-image');

  // Generated shots
  const [shots, setShots] = useState<GeneratedShot[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<{ current: number; total: number; currentMedium?: string }>({
    current: 0,
    total: 0,
  });

  // Master shot generation
  const [isGeneratingMaster, setIsGeneratingMaster] = useState(false);

  // Tab view
  const [activeTab, setActiveTab] = useState<'gallery' | 'consistency' | 'dna'>('gallery');

  // Modals
  const [lightboxShot, setLightboxShot] = useState<GeneratedShot | null>(null);
  const [promptViewerShot, setPromptViewerShot] = useState<GeneratedShot | null>(null);

  // Export state
  const [isExporting, setIsExporting] = useState(false);
  const [apiHealthOk, setApiHealthOk] = useState(true);
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Check backend health
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setApiHealthOk(data.hasApiKey);
      })
      .catch((err) => {
        console.warn('API health check error:', err);
      });
  }, []);

  // Preset switch
  const handleSelectPreset = (preset: ProductPreset) => {
    setSelectedPresetId(preset.id);
    setProduct(preset.product);
  };

  // Toggle medium selection
  const handleToggleMedium = (id: MediumType) => {
    setMediums((prev) =>
      prev.map((m) => (m.id === id ? { ...m, selected: !m.selected } : m))
    );
  };

  const handleSelectAll = (select: boolean) => {
    setMediums((prev) => prev.map((m) => ({ ...m, selected: select })));
  };

  const handleSelectRecommended = () => {
    setMediums((prev) =>
      prev.map((m) => ({
        ...m,
        selected: ['billboard', 'newspaper', 'social'].includes(m.id),
      }))
    );
  };

  const handleAddCustomMedium = (
    title: string,
    aspectRatio: '16:9' | '4:3' | '1:1' | '3:4' | '9:16',
    desc: string
  ) => {
    const newMedium: MediumConfig = {
      id: `custom-${Date.now()}` as any,
      title,
      subtitle: 'Custom Scenic Medium',
      aspectRatio,
      description: desc,
      iconName: 'Layers',
      selected: true,
    };
    setMediums((prev) => [newMedium, ...prev]);
  };

  // Generate Master Shot
  const handleGenerateMasterShot = async () => {
    setIsGeneratingMaster(true);
    setGlobalError(null);
    try {
      const res = await fetch('/api/brand/generate-master', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: product.name,
          category: product.category,
          canonicalDna: product.canonicalDna,
          model: selectedModel,
        }),
      });

      const data = await res.json();
      if (data.success && data.imageUrl) {
        setProduct((prev) => ({
          ...prev,
          masterImage: data.imageUrl,
        }));
      } else {
        throw new Error(data.error || 'Failed to generate master shot');
      }
    } catch (err: any) {
      console.error('Master shot error:', err);
      setGlobalError(err.message || 'Failed to generate master shot.');
    } finally {
      setIsGeneratingMaster(false);
    }
  };

  // Generate Full Cross-Medium Campaign
  const handleGenerateCampaign = async () => {
    const selectedList = mediums.filter((m) => m.selected);
    if (selectedList.length === 0) return;

    setIsGenerating(true);
    setGlobalError(null);
    setGenerationProgress({ current: 0, total: selectedList.length });

    // Prepare shots list or clear previous
    const completedShots: GeneratedShot[] = [];

    for (let i = 0; i < selectedList.length; i++) {
      const targetMedium = selectedList[i];
      setGenerationProgress({
        current: i + 1,
        total: selectedList.length,
        currentMedium: targetMedium.title,
      });

      try {
        const res = await fetch('/api/brand/generate-shot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            medium: targetMedium.id,
            productName: product.name,
            category: product.category,
            canonicalDna: product.canonicalDna,
            aspectRatio: targetMedium.aspectRatio,
            referenceImage: product.masterImage,
            model: selectedModel,
          }),
        });

        const data = await res.json();

        if (data.success && data.imageUrl) {
          const newShot: GeneratedShot = {
            id: `${targetMedium.id}-${Date.now()}`,
            medium: targetMedium.id,
            mediumTitle: targetMedium.title,
            aspectRatio: data.aspectRatio || targetMedium.aspectRatio,
            imageUrl: data.imageUrl,
            promptUsed: data.promptUsed,
            modelUsed: data.modelUsed || selectedModel,
            timestamp: Date.now(),
          };

          completedShots.push(newShot);
          // Stream updates into state live
          setShots((prev) => {
            // Replace if existing of same medium or append
            const filtered = prev.filter((s) => s.medium !== targetMedium.id);
            return [...filtered, newShot];
          });
        } else {
          console.error(`Failed to generate ${targetMedium.title}:`, data.error);
          setGlobalError(`Warning: ${targetMedium.title} generation error: ${data.error}`);
        }
      } catch (err: any) {
        console.error(`Error on ${targetMedium.title}:`, err);
        setGlobalError(`Network error on ${targetMedium.title}: ${err.message}`);
      }
    }

    setIsGenerating(false);
  };

  // Regenerate individual shot
  const handleRegenerateShot = async (shot: GeneratedShot, customTweak?: string) => {
    try {
      const targetMedium = mediums.find((m) => m.id === shot.medium) || {
        id: shot.medium,
        title: shot.mediumTitle,
        aspectRatio: shot.aspectRatio,
      };

      const res = await fetch('/api/brand/generate-shot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          medium: shot.medium,
          productName: product.name,
          category: product.category,
          canonicalDna: product.canonicalDna,
          aspectRatio: targetMedium.aspectRatio,
          referenceImage: product.masterImage,
          customTweak,
          model: selectedModel,
        }),
      });

      const data = await res.json();
      if (data.success && data.imageUrl) {
        setShots((prev) =>
          prev.map((s) =>
            s.id === shot.id
              ? {
                  ...s,
                  imageUrl: data.imageUrl,
                  promptUsed: data.promptUsed,
                  modelUsed: data.modelUsed || selectedModel,
                  customTweak,
                  timestamp: Date.now(),
                }
              : s
          )
        );
      } else {
        alert(data.error || 'Failed to re-roll shot.');
      }
    } catch (err: any) {
      alert('Error re-rolling shot: ' + err.message);
    }
  };

  // Export Brand Kit as ZIP
  const handleExportKit = async () => {
    if (shots.length === 0) return;
    setIsExporting(true);
    try {
      const zip = new JSZip();
      const folderName = `${product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-brand-kit`;
      const kitFolder = zip.folder(folderName) || zip;

      // Add product DNA JSON
      const dnaData = {
        productName: product.name,
        category: product.category,
        tagline: product.tagline,
        canonicalVisualDna: product.canonicalDna,
        materials: product.materials,
        colorPalette: product.colors,
        logoDetails: product.logoDetails,
        modelEngine: 'Google Gemini Nano-Banana (gemini-3.1-flash-lite-image)',
        exportDate: new Date().toISOString(),
      };
      kitFolder.file('brand-visual-dna.json', JSON.stringify(dnaData, null, 2));

      // Add text summary
      const summaryText = `=========================================
BRAND BUILDER APP • CROSS-MEDIUM CAMPAIGN
=========================================
Product: ${product.name}
Category: ${product.category}
Tagline: ${product.tagline}

CANONICAL PRODUCT VISUAL DNA:
${product.canonicalDna}

MATERIALS:
${product.materials.map((m) => `- ${m}`).join('\n')}

COLORS:
${product.colors.map((c) => `- ${c.name} (${c.hex})`).join('\n')}

MEDIUMS INCLUDED:
${shots.map((s) => `- ${s.mediumTitle} [${s.aspectRatio}] (${s.modelUsed})`).join('\n')}

CONSTRAINT ENFORCED: Zero people, models, or hands.
ENGINE: Nano-Banana model.
`;
      kitFolder.file('README.txt', summaryText);

      // Add shots
      for (let i = 0; i < shots.length; i++) {
        const s = shots[i];
        if (s.imageUrl.startsWith('data:image/')) {
          const base64Data = s.imageUrl.split(',')[1];
          const filename = `${i + 1}-${s.medium}-${s.aspectRatio.replace(':', 'x')}.png`;
          kitFolder.file(filename, base64Data, { base64: true });
        }
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${folderName}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Export error:', err);
      alert('Failed to package Brand Kit: ' + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  const selectedMediumCount = mediums.filter((m) => m.selected).length;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      {/* Top Header */}
      <Header
        selectedPresetId={selectedPresetId}
        onSelectPreset={handleSelectPreset}
        onExportKit={handleExportKit}
        hasShots={shots.length > 0}
        isExporting={isExporting}
        selectedModel={selectedModel}
        onSelectModel={setSelectedModel}
        apiKeyOk={apiHealthOk}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full space-y-8">
        {/* Global Error Banner if any */}
        {globalError && (
          <div className="p-4 rounded-xl bg-red-950/70 border border-red-800 text-red-200 text-xs flex items-start justify-between gap-3 animate-fadeIn">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{globalError}</span>
            </div>
            <button
              type="button"
              onClick={() => setGlobalError(null)}
              className="text-red-400 hover:text-white text-xs font-semibold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Step 1 & 2 Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Product DNA Studio */}
          <div className="lg:col-span-5 space-y-6">
            <ProductForm
              product={product}
              onChange={setProduct}
              onGenerateMasterShot={handleGenerateMasterShot}
              isGeneratingMaster={isGeneratingMaster}
              selectedModel={selectedModel}
            />
          </div>

          {/* Right Column: Medium Selection & Trigger */}
          <div className="lg:col-span-7 space-y-6">
            <MediumSelector
              mediums={mediums}
              onToggleMedium={handleToggleMedium}
              onSelectAll={handleSelectAll}
              onSelectRecommended={handleSelectRecommended}
              onAddCustomMedium={handleAddCustomMedium}
              onGenerateCampaign={handleGenerateCampaign}
              isGenerating={isGenerating}
              selectedCount={selectedMediumCount}
            />

            {/* Generation Progress Display */}
            {isGenerating && (
              <div className="p-4 rounded-2xl bg-neutral-900 border border-amber-500/30 shadow-xl space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-amber-300 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                    <span>
                      Generating Shot {generationProgress.current} of {generationProgress.total}:{' '}
                      <strong className="text-white">{generationProgress.currentMedium}</strong>
                    </span>
                  </span>
                  <span className="font-mono text-neutral-400">
                    {Math.round((generationProgress.current / generationProgress.total) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-neutral-950 h-2 rounded-full overflow-hidden border border-neutral-800">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-300 rounded-full"
                    style={{
                      width: `${(generationProgress.current / generationProgress.total) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-[11px] text-neutral-400">
                  Executing prompt on Nano-Banana with zero-human constraint and exact Visual DNA tokens...
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Output Section: The Cross-Medium Showcase */}
        <section className="pt-4 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white tracking-tight">
                  Cross-Medium Brand Showcase
                </h2>
                {shots.length > 0 && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-400 text-neutral-950 font-bold">
                    {shots.length} Active Shots
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                Visualizing <strong className="text-white">{product.name}</strong> rendered with strict consistency in each medium.
              </p>
            </div>

            {/* View Switcher Tabs */}
            {shots.length > 0 && (
              <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('gallery')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'gallery'
                      ? 'bg-amber-400 text-neutral-950 shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Mockup Gallery</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('consistency')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'consistency'
                      ? 'bg-amber-400 text-neutral-950 shadow-sm'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Columns className="w-3.5 h-3.5" />
                  <span>Consistency Audit</span>
                </button>
              </div>
            )}
          </div>

          {/* Empty State when no shots yet */}
          {shots.length === 0 && !isGenerating && (
            <div className="p-12 text-center rounded-2xl bg-neutral-900/30 border border-dashed border-neutral-800 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-amber-400 shadow-lg">
                <Sparkles className="w-7 h-7" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-base font-bold text-white">Ready to Imagine Your Brand</h3>
                <p className="text-xs text-neutral-400">
                  Select your product archetype or customize the Visual DNA above, then click{' '}
                  <strong className="text-amber-400">"Imagine Across {selectedMediumCount} Mediums"</strong> to generate consistent billboard, newspaper, and social post shots using Nano-Banana.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleGenerateCampaign}
                  className="inline-flex items-center gap-2 text-xs font-bold px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Launch Initial Campaign ({selectedMediumCount} Shots)</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab 1: Mockup Gallery */}
          {shots.length > 0 && activeTab === 'gallery' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              {shots.map((shot) => (
                <MediumCard
                  key={shot.id}
                  shot={shot}
                  productName={product.name}
                  tagline={product.tagline}
                  onOpenLightbox={setLightboxShot}
                  onOpenPrompt={setPromptViewerShot}
                  onRegenerate={handleRegenerateShot}
                />
              ))}
            </div>
          )}

          {/* Tab 2: Consistency Comparator */}
          {shots.length > 0 && activeTab === 'consistency' && (
            <ConsistencyComparator shots={shots} product={product} />
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 py-6 text-center text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>Brand builder app • Powered by Nano-Banana Image Model</span>
          <span className="flex items-center gap-1.5 text-neutral-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Strict Zero-People Commercial Still Life Protocol</span>
          </span>
        </div>
      </footer>

      {/* Lightbox Modal */}
      <LightboxModal
        shot={lightboxShot}
        productName={product.name}
        onClose={() => setLightboxShot(null)}
      />

      {/* Prompt Viewer Modal */}
      <PromptViewerModal
        shot={promptViewerShot}
        onClose={() => setPromptViewerShot(null)}
      />
    </div>
  );
}
