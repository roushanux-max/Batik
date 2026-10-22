import React from 'react';
import { X, Camera, RotateCcw, Upload, Sparkles } from 'lucide-react';
import { HERO_CREATIONS, PRODUCTS, WORK_GROUPS, formatINR } from '../data/storeData';
import { SmartImage } from './SmartImage';

interface ImageReferenceModalProps {
  onClose: () => void;
  customImages: Record<string, string>;
  onUploadCustomImage: (key: string, dataUrl: string) => void;
  onResetCustomImage: (key: string) => void;
  onResetAll: () => void;
}

export const ImageReferenceModal: React.FC<ImageReferenceModalProps> = ({
  onClose,
  customImages,
  onUploadCustomImage,
  onResetCustomImage,
  onResetAll,
}) => {
  const customCount = Object.keys(customImages).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl bg-white shadow-2xl border border-zinc-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF5722] tracking-wider uppercase">
              <Camera className="w-4 h-4" />
              <span>REFERENCE PHOTO MANAGER</span>
            </div>
            <h2 className="text-xl font-extrabold text-zinc-900 mt-0.5">
              Swap Dummy Images with Your Clothes & Pattern Photos
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
          <div className="p-4 rounded-2xl bg-[#FFF8F6] border border-[#FFE8E0] text-xs text-zinc-700 space-y-1">
            <p className="font-bold text-[#D84315] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Upload your own reference images anytime
            </p>
            <p>
              Hover over any item below and click <strong>Swap</strong> to upload your own pattern, dupatta, or block photos. All custom images are saved in your browser and automatically update across the entire platform.
            </p>
          </div>

          {/* Hero Creations */}
          <div>
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-3">
              Hero Section Creations (Revive Dupatta, Bhimbetka Motifs, Wooden Blocks)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {HERO_CREATIONS.map((c) => (
                <div key={c.id} className="p-3 rounded-2xl border border-zinc-200 bg-zinc-50">
                  <div className="aspect-4/3 rounded-xl overflow-hidden bg-white">
                    <SmartImage
                      src={c.heroImage}
                      customKey={`hero-${c.id}`}
                      customImages={customImages}
                      onUploadCustomImage={onUploadCustomImage}
                      onResetCustomImage={onResetCustomImage}
                      alt={c.title}
                    />
                  </div>
                  <h4 className="text-xs font-bold text-zinc-900 mt-2">{c.shortTitle}</h4>
                  <p className="text-[10px] text-zinc-500 mt-0.5">{c.tag}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Work Group Categories */}
          <div>
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-3">
              Work Groups in Small Tasks
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
              {WORK_GROUPS.map((wg) => (
                <div key={wg.id} className="p-2 rounded-xl border border-zinc-200 bg-zinc-50 text-center">
                  <div className="aspect-square rounded-lg overflow-hidden bg-white">
                    <SmartImage
                      src={wg.image}
                      customKey={`wg-${wg.id}`}
                      customImages={customImages}
                      onUploadCustomImage={onUploadCustomImage}
                      onResetCustomImage={onResetCustomImage}
                      alt={wg.title}
                    />
                  </div>
                  <h4 className="text-[11px] font-bold text-zinc-800 mt-1.5 truncate">{wg.title}</h4>
                </div>
              ))}
            </div>
          </div>

          {/* Clothes & Products */}
          <div>
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider mb-3">
              Apparel Clothes, Dupattas & Wooden Blocks Products
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {PRODUCTS.map((p) => (
                <div key={p.id} className="p-2.5 rounded-2xl border border-zinc-200 bg-zinc-50">
                  <div className="aspect-square rounded-xl overflow-hidden bg-white">
                    <SmartImage
                      src={p.image}
                      customKey={`prod-${p.id}`}
                      customImages={customImages}
                      onUploadCustomImage={onUploadCustomImage}
                      onResetCustomImage={onResetCustomImage}
                      alt={p.name}
                    />
                  </div>
                  <h4 className="text-xs font-bold text-zinc-900 mt-2 truncate">{p.name}</h4>
                  <p className="text-[11px] text-zinc-500">{formatINR(p.price)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between">
          {customCount > 0 ? (
            <button
              type="button"
              onClick={onResetAll}
              className="text-xs font-bold text-red-600 hover:underline cursor-pointer"
            >
              Reset all {customCount} custom images to studio default
            </button>
          ) : (
            <span className="text-xs text-zinc-400">Currently using high-resolution studio dummy images</span>
          )}

          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-[#111827] px-6 py-2 text-xs font-bold text-white hover:bg-zinc-800 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
